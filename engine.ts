import { SESSIONS } from "./programme";

// ── ENGINES ───────────────────────────────────────────────────────────────────
// Units: kg (default), "level" (Stairmaster), "km/h" (Incline Walk)
export const unitOf=ex=>ex.unit||"kg";
export function roundLoad(v,unit="kg"){return unit==="level"?Math.round(v):unit==="km/h"?Math.round(v*2)/2:Math.round(v*4)/4;}
export function fmtLoad(v,unit="kg"){if(v==null||v==="")return"—";if(v==="BW")return"BW";return unit==="level"?`Level ${v}`:unit==="km/h"?`${v} km/h`:`${v} kg`;}

// An exercise counts only when at least one set was done and it wasn't swapped for something else
export const performed=(s,id)=>(Number(s.comp?.[id])||0)>0&&!(s.swapped&&s.swapped[id])&&s.weights&&s.weights[id]!=null;
// "Reset weights" starts strength tracking over from that day; earlier sessions stay in the history
export const sinceReset=data=>data.weightsResetAt?data.sessions.filter(s=>new Date(s.date).getTime()>new Date(data.weightsResetAt).getTime()):data.sessions;

// ── ENGINES ───────────────────────────────────────────────────────────────────
// Next weight for an exercise (pass sinceReset(data) as sessions):
// 1 history = same session type, sets done, not swapped · 2 none → programme start
// 3 last done 14+ days ago → 10 % lower (kg only) · 4 step up once the last `freq` sessions
//   AT THE CURRENT WEIGHT were all complete and span 7+ days (no span rule when freq is 1)
export function getWeight(ex,sessions,sessionId=null){
  if(ex.bw)return"BW";
  const unit=unitOf(ex);
  const hist=sessions.filter(s=>performed(s,ex.id)&&(!sessionId||s.sessionId===sessionId));
  if(!hist.length)return ex.kg;
  const last=hist[hist.length-1];
  const w=last.weights[ex.id];
  const daysSince=Math.floor((Date.now()-new Date(last.date).getTime())/86400000);
  if(daysSince>14)return unit==="kg"?roundLoad(w*0.9,unit):w;
  if(!ex.step||!ex.freq)return w;
  const atW=[];
  for(let i=hist.length-1;i>=0&&hist[i].weights[ex.id]===w;i--)atW.unshift(hist[i]);
  const recent=atW.slice(-ex.freq);
  if(recent.length<ex.freq)return w;
  const spanDays=(new Date(recent[recent.length-1].date).getTime()-new Date(recent[0].date).getTime())/86400000;
  if(ex.freq>1&&spanDays<7)return w;
  const allDone=recent.every(s=>(Number(s.comp?.[ex.id])||0)>=ex.sets);
  return allDone?roundLoad(w+ex.step,unit):w;
}
// Highest weight actually lifted (sets done, not swapped)
export function getPR(ex,sessions){
  const vals=sessions.filter(s=>performed(s,ex.id)).map(s=>s.weights[ex.id]);
  return vals.length?Math.max(...vals):null;
}
// Last weight actually lifted, or null
export function lastWeight(ex,sessions,sessionId=null){
  const hist=sessions.filter(s=>performed(s,ex.id)&&(!sessionId||s.sessionId===sessionId));
  return hist.length?hist[hist.length-1].weights[ex.id]:null;
}
export function kcal(met,mins,wt=50){return Math.round(met*wt*(mins/60));}
export function getGreeting(){const h=new Date().getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening";}
export function getProteinHitRate(nutritionLog){
  const weekAgo=Date.now()-7*86400000;
  const week=(nutritionLog||[]).filter(e=>new Date(e.date)>weekAgo&&!e.skipped&&e.hit!==null&&e.hit!==undefined);
  if(!week.length)return null;
  const hits=week.filter(e=>e.hit===true).length;
  return{hits,total:week.length,rate:hits/week.length};
}
export function getTodayProtein(nutritionLog){
  const today=new Date().toISOString().slice(0,10);
  return(nutritionLog||[]).find(e=>e.date===today)||null;
}
export function getBanner(sessions,nutritionLog,bodyLog=[],profile={}){
  const last=bodyLog.length?bodyLog[bodyLog.length-1]:null;
  const gw=profile?.goalWeight??45;const gws=profile?.goalWaist??63;
  const hitWeight=last?.weight!=null&&last.weight<=gw;
  const hitWaist=last?.waist!=null&&last.waist<=gws;
  if(hitWeight&&hitWaist)return`${gws} cm waist. ${gw} kg. You did both. Now let's see how far you can really go.`;
  if(hitWeight)return`${gw} kg — you hit your weight goal. The work isn't over, it's just beginning.`;
  if(hitWaist)return`${gws} cm — waist goal reached. Keep pushing. There's always a next level.`;
  if(!sessions.length)return"Your journey starts today. Every rep counts.";
  const lastSession=sessions[sessions.length-1];
  const daysSince=Math.floor((Date.now()-new Date(lastSession.date))/86400000);
  if(daysSince>14)return"More than two weeks since your last session. Weights will be slightly reduced to protect you — restart steady.";
  if(daysSince>10)return"Welcome back. Starting steady — same weights as before.";
  const pr=getProteinHitRate(nutritionLog);
  if(pr&&pr.total>=3&&pr.rate<3/7)return"Most days this week you didn't hit protein. Even Greek yoghurt + chicken = 40g. Your muscles need it.";
  const weekAgo=Date.now()-7*86400000;
  const thisWeek=sessions.filter(s=>new Date(s.date)>weekAgo);
  const counts={glutes:0,core:0,shape:0};
  thisWeek.forEach(s=>{if(counts[s.sessionId]!==undefined)counts[s.sessionId]++;});
  if(counts.glutes>=2&&counts.core===0)return"You've trained glutes twice — consider Core today for balance.";
  if(daysSince>=7)return`It's been ${daysSince} days since your last session — your body is ready. Pick any session and go.`;
  if(thisWeek.length>=3)return`Strong 7 days — ${thisWeek.length} sessions done. You're building the habit.`;
  const lastType=SESSIONS.find(s=>s.id===lastSession.sessionId);
  if(lastType){
    const next=suggestSession(sessions);
    if(next&&next.id!==lastType.id)return`Last: ${lastType.name}. Try ${next.name} today for full coverage.`;
  }
  return daysSince===0?"Today is a great day to train.":daysSince===1?"Yesterday you trained — rest or go again.":`Last session was ${daysSince} days ago — your body is ready.`;
}
export function getETA(sessions,profile,bodyLog=[]){
  const gw=profile?.goalWeight??45;const gws=profile?.goalWaist??63;
  const weeks=sessions.length>=2?(Date.now()-new Date(sessions[0].date))/604800000:0;
  const avg=sessions.length>=2?Math.round((sessions.length/Math.max(weeks,0.5))*10)/10:null;

  // Weight ETA — from actual body log rate
  const wtEntries=bodyLog.filter(e=>e.weight!=null);
  let weeksToGoalWeight="—";
  if(wtEntries.length>=2){
    const spanWks=(new Date(wtEntries[wtEntries.length-1].date)-new Date(wtEntries[0].date))/604800000;
    const rateWk=(wtEntries[0].weight-wtEntries[wtEntries.length-1].weight)/Math.max(spanWks,0.5);
    const remaining=wtEntries[wtEntries.length-1].weight-gw;
    if(rateWk<=0)weeksToGoalWeight="↑ gaining";
    else if(remaining<=0)weeksToGoalWeight="✓ reached";
    else weeksToGoalWeight=Math.ceil(remaining/rateWk);
  }

  // Waist ETA — from actual body log rate
  const wsEntries=bodyLog.filter(e=>e.waist!=null);
  let weeksToGoalWaist="—";
  if(wsEntries.length>=2){
    const spanWks=(new Date(wsEntries[wsEntries.length-1].date)-new Date(wsEntries[0].date))/604800000;
    const rateWk=(wsEntries[0].waist-wsEntries[wsEntries.length-1].waist)/Math.max(spanWks,0.5);
    const remaining=wsEntries[wsEntries.length-1].waist-gws;
    if(rateWk<=0)weeksToGoalWaist="↑ gaining";
    else if(remaining<=0)weeksToGoalWaist="✓ reached";
    else weeksToGoalWaist=Math.ceil(remaining/rateWk);
  }

  if(!avg&&weeksToGoalWeight==="—"&&weeksToGoalWaist==="—")return null;
  return{avg:avg??0,weeksToGoalWeight,weeksToGoalWaist,gw,gws};
}

// ── PROGRESS COACH + MILESTONES ───────────────────────────────────────────────
export function getCoach(sessions,bodyLog){
  if(!bodyLog.length&&!sessions.length)return"Your journey starts here. Log stats and train.";
  if(!bodyLog.length)return`${sessions.length} session${sessions.length>1?"s":""} done. Log body stats to unlock your progress.`;
  const last=bodyLog[bodyLog.length-1];
  const first=bodyLog[0];
  const wtDelta=last.weight!=null&&first.weight!=null?last.weight-first.weight:0;
  const hasWaist=last.waist!=null&&first.waist!=null;
  const wsDelta=hasWaist?last.waist-first.waist:0;
  const weekAgo=Date.now()-7*86400000;
  const recentCore=sessions.filter(s=>new Date(s.date)>weekAgo&&s.sessionId==="core").length;
  const daysSinceLog=Math.floor((Date.now()-new Date(last.date))/86400000);
  if(daysSinceLog>7)return"Step on the scale — your progress is waiting.";
  if(wtDelta<-1&&hasWaist&&wsDelta<-1)return`Weight down ${Math.abs(wtDelta).toFixed(1)} kg, waist down ${Math.abs(wsDelta).toFixed(1)} cm. Keep going.`;
  if(wtDelta>=0&&last.bodyFat&&bodyLog.length>1&&last.bodyFat<bodyLog[bodyLog.length-2].bodyFat)return"Weight steady, body fat dropping. That's recomposition.";
  if(hasWaist&&wsDelta<-0.5&&recentCore>=2)return`Waist down ${Math.abs(wsDelta).toFixed(1)} cm. Core sessions are working.`;
  if(wtDelta<-0.5)return`Weight down ${Math.abs(wtDelta).toFixed(1)} kg. The deficit is working — stay consistent.`;
  if(sessions.length>=10)return`${sessions.length} sessions done. Consistency is everything.`;
  return"Every session counts. You're building something real.";
}
export function getMilestones(sessions,bodyLog,profile={}){
  const ms=[];
  const first=bodyLog[0];
  bodyLog.forEach(e=>{
    if(first&&e.weight<first.weight-0.9&&!ms.find(m=>m.id==="w1"))ms.push({id:"w1",icon:"weight",title:"First kilogram gone",sub:`${first.weight} → ${e.weight} kg — the first one is the hardest.`});
    if(first&&e.waist&&first.waist&&e.waist<first.waist-0.9&&!ms.find(m=>m.id==="ws1"))ms.push({id:"ws1",icon:"waist",title:"First centimetre off the waist",sub:`${first.waist} → ${e.waist} cm — the core work is showing.`});
    if(first&&e.weight!=null&&e.weight<=(profile?.goalWeight??45)&&!ms.find(m=>m.id==="goalW"))ms.push({id:"goalW",icon:"trophy",title:`Goal weight reached — ${e.weight} kg`,sub:"You hit your target. Now set a new one and keep going."});
    if(first&&e.waist!=null&&e.waist<=(profile?.goalWaist??63)&&!ms.find(m=>m.id==="goalWs"))ms.push({id:"goalWs",icon:"trophy",title:`Goal waist reached — ${e.waist} cm`,sub:`${profile?.goalWaist??63} cm. You earned it. There's always a next level.`});
    const bfGoal=profile?.goalBodyFat??20;
    if(e.bodyFat&&e.bodyFat<=bfGoal&&!ms.find(m=>m.id==="bf23"))ms.push({id:"bf23",icon:"fire",title:`Under ${bfGoal}% body fat`,sub:"Visible toning territory. You're in it."});
  });
  const allExIds=SESSIONS.flatMap(s=>s.exercises.map(e=>e.id));
  allExIds.forEach(id=>{
    const pr=sessions.filter(s=>performed(s,id));
    if(pr.length>1){const ex=SESSIONS.flatMap(s=>s.exercises).find(e=>e.id===id);if(ex&&!ex.bw&&!ms.find(m=>m.id==="pr_"+id)){const u=unitOf(ex);const maxW=Math.max(...pr.map(s=>s.weights[id]));const startW=pr[0].weights[id];if(maxW>startW+4)ms.push({id:"pr_"+id,icon:"trophy",title:`${ex.name} PR`,sub:`${u==="kg"?`${startW} → ${maxW} kg`:`${fmtLoad(startW,u)} → ${fmtLoad(maxW,u)}`} — up ${u==="level"?`${maxW-startW} levels`:`${(maxW-startW).toFixed(1)} ${u}`} from start.`});}}
  });
  if(sessions.length>=10)ms.push({id:"s10",icon:"sessions",title:"10 sessions complete",sub:"You showed up 10 times. That's the whole game."});
  if(sessions.length>=25)ms.push({id:"s25",icon:"sessions",title:"25 sessions complete",sub:"25 sessions. You're not trying it anymore — you're doing it."});
  const types=new Set(sessions.filter(s=>new Date(s.date)>Date.now()-7*86400000).map(s=>s.sessionId));
  if(types.size===3)ms.push({id:"full3",icon:"star",title:"Full week — all 3 sessions",sub:"Glutes, Core, and Shape all covered in one week. Balanced."});
  return ms.reverse();
}

// ── SESSION SUGGESTION — one rule for the Today badge and the banner ─────────
// Two glutes sessions this week and no core → Core. Otherwise the session done longest ago (never done first).
export function suggestSession(sessions){
  const weekAgo=Date.now()-7*86400000;
  const counts={glutes:0,core:0,shape:0};
  sessions.filter(s=>new Date(s.date).getTime()>weekAgo).forEach(s=>{if(counts[s.sessionId]!==undefined)counts[s.sessionId]++;});
  if(counts.glutes>=2&&counts.core===0)return SESSIONS.find(s=>s.id==="core");
  return SESSIONS.reduce((a,s)=>{
    const lastA=sessions.filter(x=>x.sessionId===a.id).slice(-1)[0];
    const lastS=sessions.filter(x=>x.sessionId===s.id).slice(-1)[0];
    const tA=lastA?new Date(lastA.date).getTime():0;
    const tS=lastS?new Date(lastS.date).getTime():0;
    return tS<tA?s:a;
  },SESSIONS[0]);
}

// ── DATES ─────────────────────────────────────────────────────────────────────
export const localDay=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
