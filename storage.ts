import { localDay } from "./engine";

// ── STORAGE ──────────────────────────────────────────────────────────────────
export const KEY="lynn_gym_v3";
export const LIVE_KEY="lynn_gym_v3_live";   // the running workout; removed on finish or discard
export const PRE4_KEY="lynn_gym_v3_pre4";   // untouched copy taken once, before the cleanup below
export const APP_VERSION="1.6";
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

// ── ONE-TIME CLEANUP (schema 4) ──────────────────────────────────────────────
// Removes sessions that were saved twice (same workout = same type, same sets, same start time)
// and sessions with no set done. Keeps an untouched copy under PRE4_KEY first.
export function migrate(d){
  if(d.schema===4)return d;
  try{const raw=localStorage.getItem(KEY);if(raw&&!localStorage.getItem(PRE4_KEY))localStorage.setItem(PRE4_KEY,raw);}catch{}
  const setsDone=s=>Object.values(s.comp||{}).reduce((a,n)=>a+(Number(n)||0),0);
  const startOf=s=>new Date(s.date).getTime()-(s.duration||0)*1000;
  const kept=[];
  for(const s of d.sessions||[]){
    // empty FINISH: no set done (sessions wiped by "Reset weights" have no weights and a real duration — they stay)
    if(setsDone(s)===0&&(Object.keys(s.weights||{}).length>0||(s.duration||0)<300))continue;
    const twin=kept.find(k=>k.sessionId===s.sessionId&&JSON.stringify(k.comp||{})===JSON.stringify(s.comp||{})&&Math.abs(startOf(k)-startOf(s))<2000);
    if(twin)continue;
    kept.push(s);
  }
  return{...d,sessions:kept,schema:4};
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
