// ── CLOUD SYNC (Supabase) ────────────────────────────────────────────────────
// The app keeps working from this phone's storage (offline too). Every change is also put in an
// outbox and sent to Supabase when signed in and online. Opening the app — or coming back to it —
// pulls everything from Supabase and re-applies changes that weren't sent yet, so all phones show
// the same plan, workouts, weights, body numbers and protein days.
//
// Tables: supabase/schema.sql · Wiring (client + key): cloud.ts
// This file has no Supabase import, so the logic can be tested with a fake client.

// ── WHAT IS SYNCED: one entity per row ───────────────────────────────────────
// profile|me · psession|<day id> · exercise|<exercise id> · workout|<id> · body|<id> · nutrition|<YYYY-MM-DD>
type Ent=Map<string,any>;
const kindOf=(key:string)=>key.slice(0,key.indexOf("|"));
const byPos=(a,b)=>(a.position??0)-(b.position??0);
const byDate=(a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime();

export function entities(d:any):Ent{
  const m:Ent=new Map();
  m.set("profile|me",{profile:d.profile||{},weightsResetAt:d.weightsResetAt||null});
  (d.programme||[]).forEach((s,si)=>{
    const {exercises,...meta}=s;
    m.set("psession|"+s.id,{...meta,position:si});
    (exercises||[]).forEach((e,ei)=>m.set("exercise|"+e.id,{...e,session_id:s.id,position:ei}));
  });
  for(const w of d.sessions||[])if(w&&w.id)m.set("workout|"+w.id,w);
  for(const b of d.bodyLog||[])if(b&&b.id)m.set("body|"+b.id,b);
  for(const n of d.nutritionLog||[])if(n&&n.date)m.set("nutrition|"+n.date,n);
  return m;
}

// Entities back to the app's data shape. `base` supplies everything that isn't synced (schema, …).
export function fromEntities(m:Ent,base:any){
  const out:any={...base,sessions:[],bodyLog:[],nutritionLog:[]};
  const ps:any[]=[],ex:any[]=[];
  for(const [key,v] of m){
    switch(kindOf(key)){
      case "profile":out.profile=v.profile;if(v.weightsResetAt)out.weightsResetAt=v.weightsResetAt;else delete out.weightsResetAt;break;
      case "psession":ps.push(v);break;
      case "exercise":ex.push(v);break;
      case "workout":out.sessions.push(v);break;
      case "body":out.bodyLog.push(v);break;
      case "nutrition":out.nutritionLog.push(v);break;
    }
  }
  if(ps.length)out.programme=ps.sort(byPos).map(({position,...meta})=>({...meta,
    exercises:ex.filter(e=>e.session_id===meta.id).sort(byPos).map(({session_id,position,...e})=>e)}));
  out.sessions.sort(byDate);out.bodyLog.sort(byDate);
  out.nutritionLog.sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  return out;
}

// What changed between two versions of the data → outbox operations
export function diffOps(prev:any,next:any){
  const a=entities(prev||{}),b=entities(next||{}),ops:{key:string,op:"put"|"del",v?:any}[]=[];
  for(const [key,v] of b){const old=a.get(key);if(!old||JSON.stringify(old)!==JSON.stringify(v))ops.push({key,op:"put",v});}
  for(const key of a.keys())if(!b.has(key))ops.push({key,op:"del"});
  return ops;
}
const applyTo=(m:Ent,ops:any[])=>{for(const o of ops){if(o.op==="put")m.set(o.key,o.v);else m.delete(o.key);}return m;};
export const applyOps=(d:any,ops:any[])=>fromEntities(applyTo(entities(d),ops),d);

// ── ROWS ⇄ APP OBJECTS (column names: supabase/schema.sql) ───────────────────
const num=v=>v==null||v===""||isNaN(Number(v))?null:Number(v);
const int=v=>v==null||v===""||isNaN(Number(v))?0:Math.round(Number(v));
const iso=v=>new Date(v).toISOString();
const rest=(o,known:string[])=>{const x={};for(const k in o||{})if(!known.includes(k))x[k]=o[k];return x;};
const clean=o=>{for(const k in o)if(o[k]==null)delete o[k];return o;};

const PROFILE_KEYS=["name","goalWeight","goalWaist","goalBodyFat"];
export const toProfileRow=(v,uid)=>{const p=v.profile||{};return{user_id:uid,name:p.name??"",goal_weight:num(p.goalWeight),goal_waist:num(p.goalWaist),goal_body_fat:num(p.goalBodyFat),weights_reset_at:v.weightsResetAt||null,extra:rest(p,PROFILE_KEYS)};};
export const fromProfileRow=r=>({profile:clean({...(r.extra||{}),name:r.name??"",goalWeight:r.goal_weight,goalWaist:r.goal_waist,goalBodyFat:r.goal_body_fat}),weightsResetAt:r.weights_reset_at?iso(r.weights_reset_at):null});

const SESSION_KEYS=["id","day","short","cell","optional","flexible","name","tag","info","color","duration","met","position"];
export const toSessionRow=(v,uid)=>({user_id:uid,id:v.id,position:int(v.position),name:v.name||v.id,day_label:v.day??null,short:v.short??null,cell:v.cell??null,tag:v.tag??null,info:v.info??null,color:v.color??null,duration_min:v.duration==null?null:int(v.duration),met:num(v.met),optional:!!v.optional,flexible:!!v.flexible,extra:rest(v,SESSION_KEYS)});
export const fromSessionRow=r=>clean({...(r.extra||{}),id:r.id,day:r.day_label,short:r.short,cell:r.cell,optional:r.optional||null,flexible:r.flexible||null,name:r.name,tag:r.tag,info:r.info,color:r.color,duration:r.duration_min,met:r.met,position:r.position});

const EXERCISE_KEYS=["id","name","group","muscle","sets","reps","kg","bar","per","note","equip","unit","step","freq","bw","rest","anim","tip","cue","start","dont","swaps","session_id","position"];
export const toExerciseRow=(v,uid)=>({user_id:uid,id:v.id,session_id:v.session_id,position:int(v.position),name:v.name||"Exercise",section:v.group??null,muscle:v.muscle??null,sets:Math.max(1,int(v.sets)),reps:String(v.reps??""),bodyweight:!!v.bw,start_weight:num(v.kg)??0,unit:v.unit??null,bar_weight:num(v.bar),per:v.per??null,hold_note:v.note??null,equipment:v.equip??null,step:num(v.step)??0,sessions_to_increase:int(v.freq),rest_sec:int(v.rest),anim:v.anim??null,tip:v.tip??null,cue:v.cue??null,start_position:v.start??null,avoid:v.dont??null,swaps:Array.isArray(v.swaps)?v.swaps:[],extra:rest(v,EXERCISE_KEYS)});
export const fromExerciseRow=r=>clean({...(r.extra||{}),id:r.id,name:r.name,group:r.section,muscle:r.muscle,sets:r.sets,reps:r.reps,kg:r.start_weight,bar:r.bar_weight,per:r.per,note:r.hold_note,equip:r.equipment,unit:r.unit,step:r.step,freq:r.sessions_to_increase,bw:r.bodyweight,rest:r.rest_sec,anim:r.anim,tip:r.tip,cue:r.cue,start:r.start_position,dont:r.avoid,swaps:r.swaps||[],session_id:r.session_id,position:r.position});

const WORKOUT_KEYS=["id","date","sessionId","tag","duration","calories","weights","comp","swapped","skipped","top"];
export function toWorkoutRows(w,uid){
  const ids=new Set([...Object.keys(w.comp||{}),...Object.keys(w.weights||{}),...Object.keys(w.swapped||{}),...Object.keys(w.top||{})]);
  return{
    workout:{id:w.id,user_id:uid,session_id:w.sessionId||"",session_tag:w.tag??null,performed_at:w.date,duration_sec:int(w.duration),calories:int(w.calories),skipped:Array.isArray(w.skipped)?w.skipped:[],extra:rest(w,WORKOUT_KEYS)},
    exercises:[...ids].map(ex=>({workout_id:w.id,user_id:uid,exercise_id:ex,weight:num(w.weights?.[ex]),sets_done:int(w.comp?.[ex]),top_of_range:typeof w.top?.[ex]==="boolean"?w.top[ex]:null,swapped_to:w.swapped?.[ex]!=null?String(w.swapped[ex]):null})),
  };
}
export function fromWorkoutRows(r,exRows:any[]){
  const weights={},comp={},swapped={},top={};
  for(const e of exRows){
    if(e.weight!=null)weights[e.exercise_id]=e.weight;
    if(e.sets_done>0)comp[e.exercise_id]=e.sets_done;
    if(e.swapped_to!=null)swapped[e.exercise_id]=e.swapped_to;
    if(e.top_of_range!=null)top[e.exercise_id]=e.top_of_range;
  }
  const skipped=Array.isArray(r.skipped)?r.skipped:[];
  return clean({...(r.extra||{}),id:r.id,date:iso(r.performed_at),sessionId:r.session_id,tag:r.session_tag,duration:r.duration_sec,calories:r.calories,weights,comp,swapped,
    skipped:skipped.length?skipped:null,top:Object.keys(top).length?top:null});
}

const BODY_FIELDS:[string,string][]=[["weight","weight"],["waist","waist"],["bodyFat","body_fat"],["muscleMass","muscle_mass"],["metabolicAge","metabolic_age"]];
export function toBodyRow(b,uid){const row:any={id:b.id,user_id:uid,logged_at:b.date,extra:rest(b,["id","date",...BODY_FIELDS.map(f=>f[0])])};for(const [k,c] of BODY_FIELDS)row[c]=num(b[k]);return row;}
export function fromBodyRow(r){const b:any={...(r.extra||{}),id:r.id,date:iso(r.logged_at)};for(const [k,c] of BODY_FIELDS)if(r[c]!=null)b[k]=r[c];return b;}

export const toNutritionRow=(n,uid)=>({user_id:uid,day:n.date,hit:typeof n.hit==="boolean"?n.hit:null,skipped:!!n.skipped});
export const fromNutritionRow=r=>({date:r.day,hit:r.hit,...(r.skipped?{skipped:true}:{})});

// All rows of one account → entities
export function fromRemote(t:any):Ent{
  const m:Ent=new Map();
  if(t.profiles&&t.profiles[0])m.set("profile|me",fromProfileRow(t.profiles[0]));
  for(const r of t.programme_sessions||[])m.set("psession|"+r.id,fromSessionRow(r));
  for(const r of t.exercises||[])m.set("exercise|"+r.id,fromExerciseRow(r));
  const byWorkout=new Map<string,any[]>();
  for(const e of t.workout_exercises||[]){if(!byWorkout.has(e.workout_id))byWorkout.set(e.workout_id,[]);byWorkout.get(e.workout_id)!.push(e);}
  for(const r of t.workouts||[])m.set("workout|"+r.id,fromWorkoutRows(r,byWorkout.get(r.id)||[]));
  for(const r of t.body_log||[])m.set("body|"+r.id,fromBodyRow(r));
  for(const r of t.nutrition_log||[])m.set("nutrition|"+r.day,fromNutritionRow(r));
  return m;
}

// ── SYNC ENGINE ──────────────────────────────────────────────────────────────
const TABLES:[string,string][]=[["profiles","user_id"],["programme_sessions","user_id,id"],["exercises","user_id,id"],["workouts","id"],["workout_exercises","workout_id,exercise_id"],["body_log","id"],["nutrition_log","user_id,day"]];
const PAGE=1000,CHUNK=200;
const chunks=(a:any[],n=CHUNK)=>{const out:any[][]=[];for(let i=0;i<a.length;i+=n)out.push(a.slice(i,i+n));return out;};

export type SyncStatus={linked:boolean,email:string|null,state:"off"|"idle"|"syncing"|"ok"|"offline"|"setup"|"signin"|"error",message:string,lastSync:number|null,pending:number};

// getClient: () => Promise<SupabaseClient> — loaded only when this phone syncs (keeps the app quick to open)
export function createSync({getClient,store,keyPrefix="lynn_gym_v3",win=(typeof window!=="undefined"?window:null)}:{getClient:()=>Promise<any>,store:any,keyPrefix?:string,win?:any}){
  const META_KEY=keyPrefix+"_sync",BOX_KEY=keyPrefix+"_outbox";
  const read=(k,fb)=>{try{return JSON.parse(store.getItem(k))||fb;}catch{return fb;}};
  const write=(k,v)=>{try{store.setItem(k,JSON.stringify(v));}catch{}};
  const meta=()=>read(META_KEY,{}) as {uid?:string,email?:string,firstDone?:boolean,lastSync?:number};
  const setMeta=(m)=>write(META_KEY,m);
  const box=()=>read(BOX_KEY,{seq:0,ops:{}}) as {seq:number,ops:Record<string,any>};
  const pendingCount=()=>Object.keys(box().ops).length;
  const enqueue=(ops:any[])=>{if(!ops.length)return;const b=box();for(const o of ops)b.ops[o.key]={...o,seq:++b.seq};write(BOX_KEY,b);};
  const settle=(done:any[])=>{const b=box();for(const o of done)if(b.ops[o.key]&&b.ops[o.key].seq===o.seq)delete b.ops[o.key];write(BOX_KEY,b);};

  let app:{getData:()=>any,replaceData:(d:any)=>void}|null=null;
  let status:SyncStatus={linked:!!meta().uid,email:meta().email||null,state:meta().uid?"idle":"off",message:"",lastSync:meta().lastSync||null,pending:pendingCount()};
  const listeners=new Set<(s:SyncStatus)=>void>();
  const setStatus=(p:Partial<SyncStatus>)=>{status={...status,...p,pending:pendingCount()};listeners.forEach(f=>f(status));};

  // one sync task at a time (a pull never interleaves with a push)
  let chain:Promise<any>=Promise.resolve();
  const run=(fn:()=>Promise<any>)=>(chain=chain.then(fn).catch(e=>fail(e)));

  const online=()=>!win||!win.navigator||win.navigator.onLine!==false;
  function fail(e:any){
    const msg=String(e?.message||e||"");
    if(e?.code==="PGRST205"||e?.code==="42P01"||/does not exist|could not find the table/i.test(msg))
      return setStatus({state:"setup",message:"Supabase tables are missing — run supabase/schema.sql in the Supabase SQL Editor."});
    if(!online()||/failed to fetch|load failed|fetch failed|network/i.test(msg))
      return setStatus({state:"offline",message:"Offline — changes are kept on this phone and sync when you're back online."});
    if(e?.status===401||/jwt|refresh token|not authenticated/i.test(msg))
      return setStatus({state:"signin",message:"Sign in again to keep syncing."});
    setStatus({state:"error",message:msg||"Sync failed"});
  }
  const userId=async()=>{const client=await getClient();const {data}=await client.auth.getSession();return data?.session?.user?.id||null;};

  async function fetchAll(){
    const client=await getClient();
    const out:any={};
    await Promise.all(TABLES.map(async([t,pk])=>{
      const rows:any[]=[];
      for(let from=0;;from+=PAGE){
        let q=client.from(t).select("*");
        for(const col of pk.split(","))q=q.order(col,{ascending:true});
        const {data,error}=await q.range(from,from+PAGE-1);
        if(error)throw error;
        rows.push(...(data||[]));
        if(!data||data.length<PAGE)break;
      }
      out[t]=rows;
    }));
    return out;
  }

  async function pull(){
    const uid=await userId();if(!uid||!app)return;
    const remote=fromRemote(await fetchAll());
    const local=app.getData();
    const localEnts=entities(local);
    const m=meta();
    if(!m.firstDone){
      // First sync of this phone with this account: keep what's only on this phone.
      // Remote wins where both have something; the plan and profile only upload if the account has none yet.
      const remoteHasPlan=[...remote.keys()].some(k=>kindOf(k)==="psession");
      const ops:any[]=[];
      for(const [key,v] of localEnts){
        const kind=kindOf(key);
        if(kind==="psession"||kind==="exercise"){if(!remoteHasPlan)ops.push({key,op:"put",v});}
        else if(!remote.has(key))ops.push({key,op:"put",v});
      }
      enqueue(ops);
      setMeta({...meta(),firstDone:true});
    }else if(!remote.has("profile|me")){
      enqueue([{key:"profile|me",op:"put",v:localEnts.get("profile|me")}]);
    }
    // what Supabase has + what this phone hasn't sent yet
    const merged=applyTo(new Map(remote),Object.values(box().ops).sort((a,b)=>a.seq-b.seq));
    if(![...merged.keys()].some(k=>kindOf(k)==="psession")){
      const plan=[...localEnts].filter(([k])=>kindOf(k)==="psession"||kindOf(k)==="exercise");
      enqueue(plan.map(([key,v])=>({key,op:"put",v})));
      for(const [k,v] of plan)merged.set(k,v);
    }
    app.replaceData(fromEntities(merged,local));
  }

  async function push(){
    const uid=await userId();if(!uid)return;
    const ops=Object.values(box().ops);if(!ops.length)return;
    const client=await getClient();
    const of=(kind,op)=>ops.filter(o=>kindOf(o.key)===kind&&o.op===op);
    const upsert=async(table,rows,onConflict)=>{for(const c of chunks(rows)){const {error}=await client.from(table).upsert(c,{onConflict});if(error)throw error;}};
    const remove=async(table,col,vals,byUser)=>{for(const c of chunks(vals,100)){let q=client.from(table).delete();if(byUser)q=q.eq("user_id",uid);const {error}=await q.in(col,c);if(error)throw error;}};
    const step=async(list,fn)=>{if(!list.length)return;await fn(list);settle(list);setStatus({});};
    const idOf=(o)=>o.key.slice(o.key.indexOf("|")+1);

    await step(of("profile","put"),l=>upsert("profiles",l.map(o=>toProfileRow(o.v,uid)),"user_id"));
    await step(of("psession","put"),l=>upsert("programme_sessions",l.map(o=>toSessionRow(o.v,uid)),"user_id,id"));
    await step(of("exercise","put"),l=>upsert("exercises",l.map(o=>toExerciseRow(o.v,uid)),"user_id,id"));
    await step(of("workout","put"),async l=>{
      const rows=l.map(o=>toWorkoutRows(o.v,uid));
      await upsert("workouts",rows.map(r=>r.workout),"id");
      await remove("workout_exercises","workout_id",rows.map(r=>r.workout.id),false);
      for(const c of chunks(rows.flatMap(r=>r.exercises))){const {error}=await client.from("workout_exercises").insert(c);if(error)throw error;}
    });
    await step(of("body","put"),l=>upsert("body_log",l.map(o=>toBodyRow(o.v,uid)),"id"));
    await step(of("nutrition","put"),l=>upsert("nutrition_log",l.map(o=>toNutritionRow(o.v,uid)),"user_id,day"));
    await step(of("exercise","del"),l=>remove("exercises","id",l.map(idOf),true));
    await step(of("psession","del"),l=>remove("programme_sessions","id",l.map(idOf),true));
    await step(of("workout","del"),l=>remove("workouts","id",l.map(idOf),false));
    await step(of("body","del"),l=>remove("body_log","id",l.map(idOf),false));
    await step(of("nutrition","del"),l=>remove("nutrition_log","day",l.map(idOf),true));
  }

  let lastPull=0;
  const sync=(withPull=true)=>run(async()=>{
    if(!meta().uid)return;
    if(!online()){setStatus({state:"offline",message:"Offline — changes are kept on this phone and sync when you're back online."});return;}
    if(!(await start()))return;
    if(!(await userId())){setStatus({state:"signin",message:"Sign in again to keep syncing."});return;}
    setStatus({state:"syncing",message:""});
    if(withPull){await pull();lastPull=Date.now();}
    await push();
    const now=Date.now();setMeta({...meta(),lastSync:now});
    setStatus({state:"ok",message:"",lastSync:now});
  });

  let pushTimer:any=null;
  const schedulePush=()=>{if(pushTimer)clearTimeout(pushTimer);pushTimer=setTimeout(()=>{pushTimer=null;sync(false);},1200);};

  async function onAuth(event:string,session:any){
    const u=session?.user;
    if(u){
      const m=meta();
      if(m.uid!==u.id){if(m.uid)write(BOX_KEY,{seq:0,ops:{}});setMeta({uid:u.id,email:u.email||null,firstDone:false});}
      setStatus({linked:true,email:u.email||null});
      if(event==="TOKEN_REFRESHED")schedulePush();else sync(true);
    }else{
      const m=meta();
      setStatus(m.uid?{linked:true,state:"signin",message:"Sign in again to keep syncing."}:{linked:false,email:null,state:"off",message:""});
    }
  }

  // Load Supabase and listen to sign-in changes (once)
  let started:Promise<boolean>|null=null;
  const start=()=>started||(started=getClient().then(client=>{
    client.auth.onAuthStateChange((event,session)=>{setTimeout(()=>onAuth(event,session),0);});
    return true;
  }).catch(e=>{started=null;fail(e);return false;})); // e.g. no signal: the next sync tries again

  let inited=false;
  return{
    init(a:{getData:()=>any,replaceData:(d:any)=>void}){
      app=a;if(inited)return;inited=true;
      const loc=win&&win.location?String(win.location.hash||"")+String(win.location.search||""):"";
      if(meta().uid||/access_token|refresh_token|[?&]code=/.test(loc))start(); // signed in, or back from a Supabase email link
      if(win){
        win.addEventListener("online",()=>sync(true));
        win.document?.addEventListener("visibilitychange",()=>{if(win.document.visibilityState==="visible")sync(Date.now()-lastPull>20000);});
      }
    },
    // every saved change (called by the app's persist)
    recordChange(prev:any,next:any){
      if(!meta().uid)return;
      const ops=diffOps(prev,next);if(!ops.length)return;
      enqueue(ops);setStatus({});schedulePush();
    },
    syncNow:()=>sync(true),
    async signIn(email:string,password:string){
      await start();const client=await getClient();
      const {error}=await client.auth.signInWithPassword({email:email.trim(),password});
      if(error)throw error;
    },
    async signOut(){
      // this phone keeps its data; it just stops syncing
      write(BOX_KEY,{seq:0,ops:{}});setMeta({});
      setStatus({linked:false,email:null,state:"off",message:""});
      if(started)await getClient().then(c=>c.auth.signOut()).catch(()=>{});
    },
    getStatus:()=>status,
    subscribe(fn:(s:SyncStatus)=>void){listeners.add(fn);return()=>{listeners.delete(fn);};},
    // for tests
    _run:()=>chain,
  };
}
