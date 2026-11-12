import { localDay } from "./engine";
import { DEFAULT_SESSIONS, clonePlan } from "./programme";

// ── STORAGE ──────────────────────────────────────────────────────────────────
export const KEY="lynn_gym_v3";
export const LIVE_KEY="lynn_gym_v3_live";   // the running workout; removed on finish or discard
export const PRE4_KEY="lynn_gym_v3_pre4";   // untouched copy taken once, before the cleanup below
export const APP_VERSION="1.7";
export const DEFAULT_PROFILE={name:"Lynn",goalWeight:45,goalWaist:63,goalBodyFat:20};
export const ld=()=>{
  try{
    const raw=JSON.parse(localStorage.getItem(KEY))||{};
    if(!raw.profile)raw.profile={...DEFAULT_PROFILE};
    if(!raw.nutritionLog)raw.nutritionLog=[];
    return raw;
  }catch{return{};}
};
export const sv=(d)=>{try{localStorage.setItem(KEY,JSON.stringify(d));}catch{}};

// Stable id from text (same input → same id on every phone), formatted as a UUID for Supabase
export function idFrom(str:string){
  let h1=1779033703,h2=3144134277,h3=1013904242,h4=2773480762;
  for(let i=0;i<str.length;i++){const k=str.charCodeAt(i);
    h1=h2^Math.imul(h1^k,597399067);h2=h3^Math.imul(h2^k,2869860233);h3=h4^Math.imul(h3^k,951274213);h4=h1^Math.imul(h4^k,2716044179);}
  h1=Math.imul(h3^(h1>>>18),597399067);h2=Math.imul(h4^(h2>>>22),2869860233);h3=Math.imul(h1^(h3>>>17),951274213);h4=Math.imul(h2^(h4>>>19),2716044179);
  const hex=[h1^h2^h3^h4,h2^h1,h3^h1,h4^h1].map(n=>(n>>>0).toString(16).padStart(8,"0")).join("");
  return`${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-${(8+(parseInt(hex[16],16)&3)).toString(16)}${hex.slice(17,20)}-${hex.slice(20,32)}`;
}
export const workoutId=(date:string,sessionId:string)=>idFrom(`w|${date}|${sessionId}`);
export const bodyId=(date:string)=>idFrom(`b|${date}`);

export const SCHEMA=5;
export function migrate(d){
  if((d.schema||0)>=SCHEMA)return d;
  let out=d;
  // ── schema 4 (one-time cleanup) ──
  // Removes sessions that were saved twice (same workout = same type, same sets, same start time)
  // and sessions with no set done. Keeps an untouched copy under PRE4_KEY first.
  if((out.schema||0)<4){
    try{const raw=localStorage.getItem(KEY);if(raw&&!localStorage.getItem(PRE4_KEY))localStorage.setItem(PRE4_KEY,raw);}catch{}
    const setsDone=s=>Object.values(s.comp||{}).reduce((a:number,n)=>a+(Number(n)||0),0);
    const startOf=s=>new Date(s.date).getTime()-(s.duration||0)*1000;
    const kept=[];
    for(const s of out.sessions||[]){
      // empty FINISH: no set done (sessions wiped by "Reset weights" have no weights and a real duration — they stay)
      if(setsDone(s)===0&&(Object.keys(s.weights||{}).length>0||(s.duration||0)<300))continue;
      const twin=kept.find(k=>k.sessionId===s.sessionId&&JSON.stringify(k.comp||{})===JSON.stringify(s.comp||{})&&Math.abs(startOf(k)-startOf(s))<2000);
      if(twin)continue;
      kept.push(s);
    }
    out={...out,sessions:kept,schema:4};
  }
  // ── schema 5: ids for syncing between phones + the plan saved with the data (editable) ──
  out={...out,
    sessions:(out.sessions||[]).map(s=>s.id?s:{id:workoutId(s.date,s.sessionId),...s}),
    bodyLog:(out.bodyLog||[]).map(e=>e.id?e:{id:bodyId(e.date),...e}),
    programme:Array.isArray(out.programme)&&out.programme.length?out.programme:clonePlan(DEFAULT_SESSIONS),
    schema:SCHEMA};
  return out;
}

// ── RUNNING WORKOUT ──────────────────────────────────────────────────────────
export const loadLive=()=>{try{return JSON.parse(localStorage.getItem(LIVE_KEY))||null;}catch{return null;}};
export const saveLive=(s)=>{try{localStorage.setItem(LIVE_KEY,JSON.stringify(s));}catch{}};
export const clearLive=()=>{try{localStorage.removeItem(LIVE_KEY);}catch{}};

// ── BACKUP ───────────────────────────────────────────────────────────────────
export const backupJson=(data)=>JSON.stringify({app:"PeachFit",format:1,appVersion:APP_VERSION,exportedAt:new Date().toISOString(),data},null,2);
// Accepts a PeachFit backup file (or raw saved data) and returns data ready to save
export const parseBackup=(text)=>{
  const raw=JSON.parse(text);
  const d=raw&&raw.app==="PeachFit"&&raw.data?raw.data:raw;
  if(!d||typeof d!=="object"||!Array.isArray(d.sessions)||!Array.isArray(d.bodyLog))throw new Error("not a PeachFit backup");
  return{
    data:{...d,sessions:d.sessions,bodyLog:d.bodyLog,nutritionLog:Array.isArray(d.nutritionLog)?d.nutritionLog:[],profile:{...DEFAULT_PROFILE,...(d.profile||{})}},
    exportedAt:raw&&raw.exportedAt?raw.exportedAt:null,
  };
};
// Share sheet on phones (Save to Files, AirDrop, mail); plain download where sharing files isn't supported
export const exportBackup=(data)=>{
  const json=backupJson(data);
  const name=`peachfit-backup-${localDay()}.json`;
  const download=()=>{
    const url=URL.createObjectURL(new Blob([json],{type:"application/json"}));
    const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
  };
  const nav:any=navigator;
  for(const type of ["application/json","text/plain"]){
    let file=null;try{file=new File([json],name,{type});}catch{}
    if(file&&nav.canShare&&nav.canShare({files:[file]})){
      nav.share({files:[file],title:"PeachFit backup"}).catch(e=>{if(!e||e.name!=="AbortError")download();});
      return;
    }
  }
  download();
};
