import { useState, useEffect, useRef, useCallback } from "react";

const FONT="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=DM+Sans:wght@300;400;500&family=Tenor+Sans&display=swap";
const P={bg:"#fdf6f7",white:"#ffffff",roseHero:"#f7c5cf",rosePrimary:"#f2a0b0",roseDark:"#d4788a",roseMid:"#c4909a",roseLite:"#fce8ec",roseDeep:"#3d2028",accent:"#e87090"};

// ── CUSTOM SVG ICONS ─────────────────────────────────────────────────────────
// Each icon is a React component: <IcHome c="#d4788a" s={22}/>
const IcHome=({c=P.roseDark,s=22})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z"/><path d="M9 22V12h6v10"/></svg>;
const IcTrain=({c=P.roseDark,s=22})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="10" width="4" height="4" rx="1"/><rect x="18" y="10" width="4" height="4" rx="1"/><rect x="5" y="8" width="3" height="8" rx="1"/><rect x="16" y="8" width="3" height="8" rx="1"/><line x1="8" y1="12" x2="16" y2="12" strokeWidth="2"/></svg>;
const IcStats=({c=P.roseDark,s=22})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/><line x1="2" y1="21" x2="22" y2="21"/></svg>;
const IcMe=({c=P.roseDark,s=22})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IcGlutes=({c=P.roseDark,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20C2 14 6 10 9.5 10C11 10 12 11 12 11C12 11 13 10 14.5 10C18 10 22 14 22 20"/><path d="M5 20C5 16 7.5 13.5 9.5 13.5C11 13.5 12 15 12 15C12 15 13 13.5 14.5 13.5C16.5 13.5 19 16 19 20" strokeOpacity="0.38"/></svg>;
const IcCore=({c=P.roseDark,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4C8 4 7 8 7.5 12C7 16 8 20 8 20L16 20C16 20 17 16 16.5 12C17 8 16 4 16 4Z"/><line x1="7.2" y1="12" x2="16.8" y2="12" strokeOpacity="0.45"/></svg>;
const IcShape=({c=P.roseDark,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 6.5L22 10l-5 5 1.2 7L12 19l-6.2 3L7 15 2 10l7-.5z"/></svg>;
const IcPlay=({c=P.white,s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M6 4l14 8-14 8V4z"/></svg>;
const IcCheck=({c=P.white,s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6"/></svg>;
const IcInfo=({c=P.roseDark,s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="0.5" fill={c}/><line x1="12" y1="12" x2="12" y2="16"/></svg>;
const IcSwap=({c=P.roseMid,s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 7l4-4M4 7l4 4"/><path d="M20 17H4M20 17l-4-4M20 17l-4 4"/></svg>;
const IcArrowUp=({c=P.white,s=12})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
const IcWeight=({c=P.roseDark,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M3 21l2-7h14l2 7H3z"/><line x1="12" y1="3" x2="12" y2="8"/></svg>;
const IcWaist=({c=P.roseDark,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3L17 3C17 3 13.5 8 13.5 12C13.5 16 17 21 17 21L7 21C7 21 10.5 16 10.5 12C10.5 8 7 3 7 3Z"/><line x1="7" y1="12" x2="17" y2="12" strokeOpacity="0.35"/></svg>;
const IcSessions=({c=P.roseDark,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14l2 2 4-4"/></svg>;
const IcTrophy=({c=P.roseDark,s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4"/><path d="M17 4h3l-1 6a4 4 0 01-4 3H9a4 4 0 01-4-3L4 4h3"/><path d="M9 4h6"/></svg>;
const IcProtein=({c=P.roseDark,s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5C19 7 20 12 17 16C14 20 9 20 7 18C5 16 5 12 8 10C10 8 13 9 13 9L9 20"/><circle cx="8.5" cy="19" r="2.2"/></svg>;
const IcFire=({c=P.roseDark,s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C12 2 18 8 18 14C18 18.4 15.3 21 12 21C8.7 21 6 18.4 6 14C6 8 12 2 12 2Z"/><path d="M12 21C12 21 9.5 18.5 9.5 15.5C9.5 13.5 10.8 12 12 12C13.2 12 14 13 14 14.5C14 16.5 12 21 12 21Z" strokeOpacity="0.45"/></svg>;
const IcClock=({c=P.roseDark,s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IcBack=({c=P.roseMid,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>;
const IcSparkle=({c=P.roseHero,s=20})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.2 16.2l2.1 2.1M5.6 18.4l2.1-2.1M16.2 7.8l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>;
const IcClose=({c=P.roseMid,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const IcPin=({c=P.roseDark,s=13})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.7 2 6 4.7 6 8C6 12.5 12 19 12 19C12 19 18 12.5 18 8C18 4.7 15.3 2 12 2Z"/><circle cx="12" cy="8" r="2.2"/></svg>;
const IcMove=({c=P.roseDark,s=13})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12C5 7.6 8.6 4 13 4"/><path d="M10 4L13 4L13 7"/><path d="M19 12C19 16.4 15.4 20 11 20"/><path d="M14 20L11 20L11 17"/></svg>;
const IcStar=({c=P.roseDark,s=13})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L13.8 10.2L21 12L13.8 13.8L12 21L10.2 13.8L3 12L10.2 10.2Z"/></svg>;
const IcDont=({c=P.roseDark,s=13})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9L9 15M9 9L15 15"/></svg>;
const IcEdit=({c=P.roseDark,s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcTrash=({c=P.roseMid,s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>;
const IcRefresh=({c=P.roseDark,s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>;

// Session icon map
const SessIcon={glutes:IcGlutes,core:IcCore,shape:IcShape};

// ── PROGRAMME ────────────────────────────────────────────────────────────────
const SESSIONS=[
  {id:"glutes",name:"Glutes Heavy",tag:"GLUTES",color:P.rosePrimary,duration:45,met:4.5,
   exercises:[
    {id:"ht",name:"Barbell Hip Thrust",muscle:"Glutes — Primary",sets:4,reps:"10–12",kg:20,step:2.5,freq:2,bw:false,rest:90,anim:"ht",
     tip:"Lean upper back into bench — keeps tension on glutes, not lower back.",cue:"Drive heels into floor. Thrust hips to ceiling. Squeeze 1 full second at top.",start:"Upper back on bench, barbell above hip crease, feet flat shoulder-width.",dont:"Don't hyperextend lower back at the top. Stop just before full extension.",
     swaps:[{name:"Smith Machine Hip Thrust",note:"Bar is guided — go heavier safely"},{name:"Dumbbell Hip Thrust",note:"Lighter load, same glute pattern"},{name:"Glute Bridge (BW + Band)",note:"No equipment — band above knees"}]},
    {id:"rdl",name:"Romanian Deadlift",muscle:"Glutes + Hamstrings",sets:3,reps:"10",kg:15,step:2.5,freq:2,bw:false,rest:90,anim:"rdl",
     tip:"Push hips BACK — this is a hinge, not a squat. Feel the glute stretch.",cue:"Soft knees, hinge at hips, bar close to legs. Drive hips forward to stand.",start:"Stand hip-width, bar in front of thighs, slight knee bend.",dont:"Don't round your lower back. Keep chest up throughout.",
     swaps:[{name:"Dumbbell RDL",note:"Dumbbells free — same hinge pattern"},{name:"Single-Leg RDL (BW)",note:"No equipment, balance focus"},{name:"Cable Pull-Through",note:"Cable machine, great glute stretch"}]},
    {id:"kb",name:"Cable Kickback",muscle:"Glute Peak",sets:3,reps:"15 each",kg:7,step:1,freq:3,bw:false,rest:60,anim:"kb",
     tip:"Lean slightly forward on the machine — isolates the glute peak perfectly.",cue:"Leg straight. Kick back and up. Squeeze hard 1 second at the top.",start:"Face cable machine, ankle cuff attached, slight lean forward on handles.",dont:"Don't swing or use momentum. Slow and controlled gets the burn.",
     swaps:[{name:"Resistance Band Kickback",note:"Band around ankle — no machine needed"},{name:"Donkey Kick on Mat",note:"Bodyweight, same movement pattern"},{name:"Machine Glute Kickback",note:"If gym has dedicated machine"}]},
    {id:"fp",name:"Frog Pump (Band)",muscle:"Inner Glutes",sets:3,reps:"20",kg:0,step:0,freq:0,bw:true,rest:45,anim:"fp",
     tip:"Short fast pulses in the top third only — the burn should be intense.",cue:"Soles together, knees out like a frog. Pulse hips up rapidly.",start:"Lie on back, band just above knees, soles of feet pressed together.",dont:"Don't do full slow reps here — short pulses only.",
     swaps:[{name:"Sumo Glute Bridge",note:"Feet wide, same inner glute focus"},{name:"Clamshell (Band)",note:"Side lying, targets same area"},{name:"Hip Abduction Machine",note:"Seated machine, inner glute burn"}]},
    {id:"sm_w",name:"Stairmaster",muscle:"Cardio + Glutes",sets:1,reps:"15 min",kg:5,step:1,freq:3,bw:false,rest:0,anim:"cd",
     tip:"Lean slightly forward — activates glutes and mirrors the hip thrust angle.",cue:"Steady pace. Full step down each time. No rail-gripping.",start:"Level 5. Stand tall, light hands on rails for balance only.",dont:"No death-gripping the rails — it reduces calorie burn and glute activation.",
     swaps:[{name:"Incline Treadmill Walk",note:"6% incline, 5.5 kmh — no leg bulk"},{name:"Elliptical (low resistance)",note:"Easy on joints, burns fat"},{name:"Skip cardio today",note:"Strength was strong — rest is valid"}]},
  ]},
  {id:"core",name:"Core + Waist",tag:"CORE",color:P.roseDark,duration:40,met:4.0,
   exercises:[
    {id:"cc",name:"Cable Crunch (Kneeling)",muscle:"Upper Abs",sets:3,reps:"15",kg:15,step:2.5,freq:2,bw:false,rest:60,anim:"cc",
     tip:"Round your spine — you're crunching, not just bending forward.",cue:"Pull elbows to knees. Contract abs at bottom. Control the way up.",start:"Kneel facing cable, rope attachment at forehead height, elbows in.",dont:"Don't use hip flexors to pull down. The movement is all in the abs.",
     swaps:[{name:"Crunch on Mat",note:"No cable — same upper ab focus"},{name:"Swiss Ball Crunch",note:"Ball adds range of motion"},{name:"Decline Crunch",note:"Bench set to decline"}]},
    {id:"wc",name:"Cable Woodchop",muscle:"Obliques — Waist",sets:3,reps:"12 each",kg:5,step:1,freq:3,bw:false,rest:60,anim:"wc",
     tip:"Rotate through your waist — not just your arms. This carves the obliques.",cue:"Low to high diagonal. Plant feet, rotate torso fully. Slow on the return.",start:"Stand sideways to cable, set low, both hands on handle, arms extended.",dont:"Don't let your hips rotate — feet stay planted, only the torso moves.",
     swaps:[{name:"Resistance Band Woodchop",note:"Band anchored low — same rotation"},{name:"Dumbbell Side Bend",note:"Lateral waist, dumbbell in hand"},{name:"Russian Twist (BW)",note:"Seated, bodyweight rotation"}]},
    {id:"hk",name:"Hanging Knee Raise",muscle:"Lower Abs — Belly Pouch",sets:3,reps:"12",kg:0,step:2,freq:4,bw:true,rest:60,anim:"hk",
     tip:"Curl your PELVIS up at the top — this is what flattens the lower belly.",cue:"Hang from bar. Bring knees to chest curling the pelvis. Lower slowly.",start:"Hang from pull-up bar, arms shoulder-width, body still.",dont:"Don't just raise knees — the pelvic curl at the top is the key movement.",
     swaps:[{name:"Captain's Chair Knee Raise",note:"Forearms supported — easier grip"},{name:"Lying Leg Raise",note:"On mat — no bar needed"},{name:"Reverse Crunch",note:"Floor, targets lower belly same way"}]},
    {id:"pp",name:"Pallof Press",muscle:"Anti-Rotation Core",sets:3,reps:"12 each",kg:5,step:1,freq:3,bw:false,rest:60,anim:"pp",
     tip:"The goal is NOT to rotate — your core works hardest resisting the pull.",cue:"Press hands straight out. Hold 1 sec. Return controlled.",start:"Stand perpendicular to cable, handle at chest height, feet shoulder-width.",dont:"Don't let your torso twist toward the cable — that defeats the exercise.",
     swaps:[{name:"Pallof Press with Band",note:"Band anchored to rack — same feel"},{name:"Dead Bug (BW)",note:"Floor exercise, anti-rotation focus"},{name:"Plank Hold",note:"No equipment, strong core stability"}]},
    {id:"sp",name:"Side Plank Hip Lift",muscle:"Lateral Waist",sets:3,reps:"10 each",kg:0,step:0,freq:0,bw:true,rest:45,anim:"sp",
     tip:"Lift your hip toward the ceiling — feel the side waist working intensely.",cue:"Side plank. Dip hip to floor. Lift as high as possible. Squeeze.",start:"Forearm side plank, elbow under shoulder, body in straight line.",dont:"Don't let hips sag between reps. Full range — floor to max height.",
     swaps:[{name:"Side Plank Hold",note:"Static hold — easier starting point"},{name:"Lateral Band Walk",note:"Band above knees, side steps"},{name:"Standing Side Crunch (BW)",note:"Standing, elbow to hip"}]},
    {id:"vac",name:"Vacuum Hold",muscle:"TVA — Internal Waist Corset",sets:3,reps:"30 sec",kg:0,step:0,freq:0,bw:true,rest:30,anim:"vac",
     tip:"Most underrated waist exercise. Consistent practice = measurably smaller waist.",cue:"Exhale fully. Suck navel to spine as hard as possible. Hold.",start:"Stand or kneel. Deep breath in, then exhale completely.",dont:"Don't hold your breath entirely — breathe shallowly while holding.",
     swaps:[{name:"Stomach Vacuum on All Fours",note:"Gravity helps — easier to feel it"},{name:"Diaphragmatic Breathing",note:"Deep belly breathing, TVA activation"},{name:"Plank with Exhale Hold",note:"Plank position, exhale and brace"}]},
  ]},
  {id:"shape",name:"Glutes + Core",tag:"SHAPE",color:P.accent,duration:50,met:4.2,
   exercises:[
    {id:"sm",name:"Smith Machine Hip Thrust",muscle:"Glutes Max",sets:4,reps:"12",kg:25,step:2.5,freq:2,bw:false,rest:90,anim:"ht",
     tip:"Smith machine lets you go heavier safely — really load those glutes today.",cue:"Full extension. 2-second squeeze at top every single rep.",start:"Upper back on bench, bar on hip crease padded, feet flat.",dont:"Don't trade weight for form. Full range every rep.",
     swaps:[{name:"Barbell Hip Thrust",note:"Free bar — same movement"},{name:"Dumbbell Hip Thrust",note:"Dumbbells each side of hips"},{name:"Single-Leg Hip Thrust",note:"Bodyweight, one leg at a time"}]},
    {id:"dk",name:"Cable Donkey Kick",muscle:"Glute Peak + Upper",sets:3,reps:"15 each",kg:5,step:1,freq:3,bw:false,rest:60,anim:"kb",
     tip:"Squeeze at the absolute top — builds the upper glute that lifts the shape.",cue:"Kick straight back and up. Pause and squeeze at the top.",start:"Ankle cuff on, facing machine, flat back.",dont:"Don't arch your lower back to get more range.",
     swaps:[{name:"Resistance Band Kickback",note:"Band anchored low, same kick pattern"},{name:"Donkey Kick on Mat",note:"All fours, bodyweight"},{name:"Machine Glute Kickback",note:"Dedicated machine if available"}]},
    {id:"be",name:"Back Extension (45°)",muscle:"Lower Back + Glutes",sets:3,reps:"15",kg:0,step:5,freq:4,bw:true,rest:60,anim:"be",
     tip:"Slight round at the bottom targets glutes more than a flat back does.",cue:"Lower torso slowly. Drive back up squeezing glutes at top.",start:"Hips on 45° pad, feet locked, arms crossed on chest.",dont:"Don't hyperextend at the top — neutral spine at peak.",
     swaps:[{name:"Good Morning (BW)",note:"Standing, hip hinge, no machine"},{name:"Superman Hold",note:"Floor prone, back extension hold"},{name:"Bird Dog",note:"All fours, opposite arm and leg"}]},
    {id:"rh",name:"Reverse Hyper",muscle:"Glutes + Lower Back",sets:3,reps:"15",kg:0,step:5,freq:4,bw:true,rest:60,anim:"be",
     tip:"Control the swing — slow up, slow down. The glutes fire hardest at the top of the arc.",cue:"Lie face down on bench, legs hanging. Lift legs to hip height. Squeeze glutes at top. Lower slow.",start:"Face down on a high bench or hyperextension station, hips at the edge, legs hanging freely.",dont:"Don't use momentum to swing legs up — that's your lower back, not your glutes.",
     swaps:[{name:"Superman Hold",note:"Floor, no equipment — prone back extension"},{name:"Glute Ham Raise",note:"GHD machine if available"},{name:"Bird Dog",note:"All fours — gentler lower back option"}]},
    {id:"aw",name:"Ab Wheel Rollout",muscle:"Full Core",sets:3,reps:"8–10",kg:0,step:0,freq:0,bw:true,rest:75,anim:"aw",
     tip:"From knees only. One quality rollout beats five sloppy ones.",cue:"Roll forward slowly. As far as core holds. Pull back engaging abs.",start:"Kneeling on mat, ab wheel directly under shoulders.",dont:"Don't let your lower back collapse — brace core the entire movement.",
     swaps:[{name:"Plank to Pike",note:"Similar core demand, no wheel"},{name:"TRX Rollout",note:"TRX straps — if available"},{name:"Dead Bug (BW)",note:"Floor, controlled and safe"}]},
    {id:"bc",name:"Bicycle Crunch",muscle:"Obliques + Rectus",sets:3,reps:"20 total",kg:0,step:0,freq:0,bw:true,rest:45,anim:"bc",
     tip:"Go slow. The slower you go, the more the obliques work. Speed ruins this.",cue:"Elbow to opposite knee with full torso rotation. Extend the other leg long.",start:"Lie on back, hands light behind head, knees at 90°.",dont:"Don't pull your neck. Rotation comes from the torso, not the elbows.",
     swaps:[{name:"Cross-Body Mountain Climber",note:"Standing-equivalent rotation"},{name:"Oblique V-Up",note:"Side lying, targets same muscles"},{name:"Standing Oblique Crunch",note:"No floor needed — standing"}]},
    {id:"iw",name:"Incline Walk",muscle:"Fat Burn — No Leg Bulk",sets:1,reps:"10 min",kg:5.5,step:0.5,freq:4,bw:false,rest:0,anim:"cd",
     tip:"6% incline, 5.5 kmh. Burns fat without building leg muscle. Perfect for your goal.",cue:"Steady walk. Natural arm swing. Don't hold the rails.",start:"Treadmill: 6% incline, 5.5 kmh speed.",dont:"No running. No HIIT. Incline walk only — running grows the legs.",
     swaps:[{name:"Stairmaster (15 min)",note:"Glute-focused cardio alternative"},{name:"Elliptical (low resistance)",note:"Low impact, fat burn zone"},{name:"Skip cardio today",note:"Core was intense — rest is earned"}]},
  ]},
];

// ── STORAGE ──────────────────────────────────────────────────────────────────
const KEY="lynn_gym_v3";
const DEFAULT_PROFILE={name:"Lynn",goalWeight:45,goalWaist:63,startWeight:null,startWaist:null};
const ld=()=>{
  try{
    const raw=JSON.parse(localStorage.getItem(KEY))||{};
    if(!raw.profile)raw.profile={...DEFAULT_PROFILE};
    if(!raw.nutritionLog)raw.nutritionLog=[];
    return raw;
  }catch{return{};}
};
const sv=(d)=>{try{localStorage.setItem(KEY,JSON.stringify(d));}catch{}};

// ── ENGINES ───────────────────────────────────────────────────────────────────
function getWeight(ex,sessions,sessionId=null){
  if(ex.bw)return"BW";
  // Only sessions that include this exercise AND match the session type
  const hist=sessions.filter(s=>s.weights&&s.weights[ex.id]!==undefined&&(!sessionId||s.sessionId===sessionId));
  if(!hist.length)return ex.kg;
  const last=hist[hist.length-1];
  const w=last.weights[ex.id];
  // daysSince is per-exercise — days since the last time THIS exercise was done
  const daysSince=Math.floor((Date.now()-new Date(last.date))/86400000);
  // Overload reset: 2+ week break → reduce 10%
  if(daysSince>14)return Math.round((w*0.9)*4)/4;
  if(!ex.step||!ex.freq)return w;
  const recent=hist.slice(-ex.freq);
  // TIME GATE: all freq sessions must have happened AND span at least 7 days
  if(recent.length<ex.freq)return w;
  const spanDays=(new Date(recent[recent.length-1].date)-new Date(recent[0].date))/86400000;
  const minSpan=ex.freq>1?7:0;
  if(spanDays<minSpan)return w;
  const allDone=recent.every(s=>s.comp&&(s.comp[ex.id]||0)>=ex.sets);
  return allDone?Math.round((w+ex.step)*4)/4:w;
}
function getPR(ex,sessions){
  const vals=sessions.filter(s=>s.weights&&s.weights[ex.id]!=null).map(s=>s.weights[ex.id]);
  return vals.length?Math.max(...vals):null;
}
function kcal(met,mins,wt=50){return Math.round(met*wt*(mins/60));}
function getGreeting(){const h=new Date().getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening";}
function getProteinHitRate(nutritionLog){
  const weekAgo=Date.now()-7*86400000;
  const week=(nutritionLog||[]).filter(e=>new Date(e.date)>weekAgo&&!e.skipped&&e.hit!==null&&e.hit!==undefined);
  if(!week.length)return null;
  const hits=week.filter(e=>e.hit===true).length;
  return{hits,total:week.length,rate:hits/week.length};
}
function getTodayProtein(nutritionLog){
  const today=new Date().toISOString().slice(0,10);
  return(nutritionLog||[]).find(e=>e.date===today)||null;
}
function getBanner(sessions,nutritionLog,bodyLog=[],profile={}){
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
    const next=SESSIONS.filter(s=>s.id!==lastSession.sessionId).sort((a,b)=>{
      const tA=sessions.filter(x=>x.sessionId===a.id).slice(-1)[0];
      const tB=sessions.filter(x=>x.sessionId===b.id).slice(-1)[0];
      return(tA?new Date(tA.date).getTime():0)-(tB?new Date(tB.date).getTime():0);
    })[0];
    if(next)return`Last: ${lastType.name}. Try ${next.name} today for full coverage.`;
  }
  return daysSince===0?"Today is a great day to train.":daysSince===1?"Yesterday you trained — rest or go again.":`Last session was ${daysSince} days ago — your body is ready.`;
}
function getETA(sessions,profile,bodyLog=[]){
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

// ── SVG EXERCISE ANIMATIONS ───────────────────────────────────────────────────
const A={
  ht:()=><svg viewBox="0 0 120 90" width="120" height="90"><style>{`@keyframes th{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}.hb{transform-origin:40px 55px;animation:th 1.6s ease-in-out infinite}`}</style><rect x="5" y="62" width="40" height="7" rx="4" fill={P.roseLite}/><rect x="90" y="54" width="25" height="7" rx="3" fill={P.roseMid}/><g className="hb"><ellipse cx="40" cy="57" rx="16" ry="9" fill={P.roseDark}/><rect x="30" y="38" width="20" height="22" rx="6" fill={P.rosePrimary}/><circle cx="40" cy="28" r="10" fill={P.roseHero}/><rect x="28" y="60" width="12" height="22" rx="5" fill={P.rosePrimary}/><rect x="42" y="60" width="12" height="22" rx="5" fill={P.rosePrimary}/><rect x="22" y="56" width="82" height="6" rx="3" fill={P.roseMid} opacity="0.5"/></g></svg>,
  rdl:()=><svg viewBox="0 0 120 100" width="120" height="100"><style>{`@keyframes hg{0%,100%{transform:rotate(0deg)}50%{transform:rotate(40deg)}}.rb{transform-origin:60px 65px;animation:hg 2s ease-in-out infinite}`}</style><rect x="50" y="78" width="12" height="20" rx="5" fill={P.rosePrimary}/><rect x="44" y="78" width="10" height="18" rx="5" fill={P.rosePrimary}/><g className="rb"><rect x="52" y="40" width="14" height="28" rx="5" fill={P.roseDark}/><circle cx="59" cy="30" r="10" fill={P.roseHero}/><rect x="30" y="60" width="58" height="7" rx="3" fill={P.roseMid}/></g></svg>,
  kb:()=><svg viewBox="0 0 140 90" width="140" height="90"><style>{`@keyframes kk{0%,100%{transform:rotate(0deg)}60%{transform:rotate(-55deg)}}.kl{transform-origin:70px 58px;animation:kk 1.8s ease-in-out infinite}`}</style><rect x="10" y="30" width="8" height="50" rx="3" fill={P.roseLite}/><rect x="28" y="40" width="30" height="12" rx="5" fill={P.roseDark}/><rect x="52" y="38" width="14" height="25" rx="5" fill={P.rosePrimary}/><rect x="46" y="60" width="14" height="18" rx="5" fill={P.rosePrimary}/><circle cx="59" cy="30" r="9" fill={P.roseHero}/><g className="kl"><rect x="60" y="58" width="13" height="28" rx="5" fill={P.accent}/><rect x="58" y="82" width="20" height="7" rx="3" fill={P.roseDark}/></g></svg>,
  fp:()=><svg viewBox="0 0 140 80" width="140" height="80"><style>{`@keyframes fp{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}.fb{animation:fp 1s ease-in-out infinite}`}</style><rect x="0" y="72" width="140" height="5" rx="2" fill={P.roseLite}/><g className="fb"><ellipse cx="70" cy="56" rx="22" ry="12" fill={P.roseDark}/><rect x="56" y="42" width="26" height="20" rx="6" fill={P.rosePrimary}/><circle cx="70" cy="34" r="10" fill={P.roseHero}/><line x1="48" y1="58" x2="24" y2="45" stroke={P.rosePrimary} strokeWidth="8" strokeLinecap="round"/><line x1="24" y1="45" x2="10" y2="64" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/><line x1="92" y1="58" x2="116" y2="45" stroke={P.rosePrimary} strokeWidth="8" strokeLinecap="round"/><line x1="116" y1="45" x2="130" y2="64" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/></g></svg>,
  cc:()=><svg viewBox="0 0 120 110" width="120" height="110"><style>{`@keyframes cr{0%,100%{transform:rotate(0deg)}55%{transform:rotate(35deg)}}.cb{transform-origin:60px 68px;animation:cr 1.8s ease-in-out infinite}`}</style><rect x="100" y="0" width="6" height="110" rx="2" fill={P.roseLite}/><line x1="104" y1="20" x2="72" y2="38" stroke={P.roseMid} strokeWidth="3"/><rect x="46" y="78" width="12" height="26" rx="5" fill={P.rosePrimary}/><rect x="60" y="78" width="12" height="26" rx="5" fill={P.rosePrimary}/><g className="cb"><rect x="52" y="42" width="14" height="30" rx="5" fill={P.roseDark}/><circle cx="59" cy="32" r="10" fill={P.roseHero}/><line x1="59" y1="42" x2="45" y2="38" stroke={P.rosePrimary} strokeWidth="6" strokeLinecap="round"/><line x1="59" y1="42" x2="73" y2="38" stroke={P.rosePrimary} strokeWidth="6" strokeLinecap="round"/></g></svg>,
  wc:()=><svg viewBox="0 0 140 110" width="140" height="110"><style>{`@keyframes ch{0%{transform:rotate(-20deg)}50%{transform:rotate(20deg) translateX(10px)}100%{transform:rotate(-20deg)}}.wb{transform-origin:70px 65px;animation:ch 2s ease-in-out infinite}`}</style><rect x="10" y="85" width="120" height="6" rx="2" fill={P.roseLite}/><g className="wb"><rect x="62" y="50" width="16" height="30" rx="6" fill={P.roseDark}/><circle cx="70" cy="40" r="10" fill={P.roseHero}/><rect x="56" y="78" width="12" height="18" rx="5" fill={P.rosePrimary}/><rect x="72" y="78" width="12" height="18" rx="5" fill={P.rosePrimary}/><line x1="70" y1="55" x2="40" y2="75" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/><circle cx="36" cy="78" r="5" fill={P.roseMid}/></g></svg>,
  hk:()=><svg viewBox="0 0 120 120" width="120" height="120"><style>{`@keyframes kr{0%,100%{transform:rotate(0deg)}55%{transform:rotate(-80deg)}}.kn{transform-origin:60px 65px;animation:kr 2s ease-in-out infinite}`}</style><rect x="20" y="2" width="80" height="8" rx="3" fill={P.roseMid}/><line x1="50" y1="10" x2="50" y2="28" stroke={P.roseMid} strokeWidth="3"/><line x1="70" y1="10" x2="70" y2="28" stroke={P.roseMid} strokeWidth="3"/><rect x="52" y="28" width="16" height="30" rx="6" fill={P.roseDark}/><circle cx="60" cy="20" r="10" fill={P.roseHero}/><line x1="52" y1="35" x2="38" y2="30" stroke={P.rosePrimary} strokeWidth="6" strokeLinecap="round"/><line x1="68" y1="35" x2="82" y2="30" stroke={P.rosePrimary} strokeWidth="6" strokeLinecap="round"/><g className="kn"><rect x="54" y="58" width="12" height="22" rx="5" fill={P.rosePrimary}/><rect x="48" y="76" width="12" height="18" rx="5" fill={P.rosePrimary}/><rect x="60" y="76" width="12" height="18" rx="5" fill={P.rosePrimary}/></g></svg>,
  pp:()=><svg viewBox="0 0 140 100" width="140" height="100"><style>{`@keyframes pr{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.3)}}.pa{transform-origin:72px 56px;animation:pr 2s ease-in-out infinite}`}</style><rect x="120" y="0" width="6" height="100" rx="2" fill={P.roseLite}/><rect x="62" y="80" width="12" height="18" rx="5" fill={P.rosePrimary}/><rect x="76" y="80" width="12" height="18" rx="5" fill={P.rosePrimary}/><rect x="64" y="46" width="16" height="36" rx="6" fill={P.roseDark}/><circle cx="72" cy="36" r="10" fill={P.roseHero}/><g className="pa"><line x1="72" y1="56" x2="55" y2="56" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/><line x1="72" y1="56" x2="89" y2="56" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/><circle cx="50" cy="56" r="5" fill={P.roseMid}/></g></svg>,
  sp:()=><svg viewBox="0 0 140 80" width="140" height="80"><style>{`@keyframes dp{0%,100%{transform:translateY(0)}50%{transform:translateY(14px)}}.sb{animation:dp 2s ease-in-out infinite}`}</style><g className="sb"><circle cx="110" cy="22" r="10" fill={P.roseHero}/><rect x="50" y="30" width="58" height="14" rx="6" fill={P.roseDark}/><rect x="22" y="40" width="36" height="12" rx="5" fill={P.rosePrimary}/><line x1="22" y1="50" x2="8" y2="60" stroke={P.rosePrimary} strokeWidth="8" strokeLinecap="round"/></g><rect x="0" y="68" width="140" height="5" rx="2" fill={P.roseLite}/><rect x="8" y="58" width="14" height="10" rx="4" fill={P.roseDark}/></svg>,
  vac:()=><svg viewBox="0 0 100 110" width="100" height="110"><style>{`@keyframes vs{0%,100%{transform:scaleX(1)}50%{transform:scaleX(0.82)}}.vb{transform-origin:50px 66px;animation:vs 2.5s ease-in-out infinite}`}</style><rect x="40" y="85" width="12" height="22" rx="5" fill={P.rosePrimary}/><rect x="54" y="85" width="12" height="22" rx="5" fill={P.rosePrimary}/><rect x="38" y="52" width="8" height="36" rx="4" fill={P.rosePrimary}/><rect x="54" y="52" width="8" height="36" rx="4" fill={P.rosePrimary}/><g className="vb"><rect x="38" y="48" width="24" height="36" rx="8" fill={P.roseDark}/></g><circle cx="50" cy="32" r="14" fill={P.roseHero}/></svg>,
  be:()=><svg viewBox="0 0 140 100" width="140" height="100"><style>{`@keyframes ex{0%,100%{transform:rotate(30deg)}55%{transform:rotate(-10deg)}}.eb{transform-origin:55px 60px;animation:ex 2s ease-in-out infinite}`}</style><rect x="40" y="50" width="20" height="40" rx="6" fill={P.roseLite}/><rect x="38" y="88" width="24" height="8" rx="3" fill={P.roseMid}/><g className="eb"><rect x="42" y="36" width="16" height="28" rx="6" fill={P.roseDark}/><circle cx="50" cy="26" r="10" fill={P.roseHero}/><rect x="44" y="62" width="12" height="22" rx="5" fill={P.rosePrimary}/><line x1="50" y1="42" x2="30" y2="38" stroke={P.rosePrimary} strokeWidth="6" strokeLinecap="round"/><line x1="50" y1="42" x2="70" y2="38" stroke={P.rosePrimary} strokeWidth="6" strokeLinecap="round"/></g></svg>,
  aw:()=><svg viewBox="0 0 140 90" width="140" height="90"><style>{`@keyframes rll{0%,100%{transform:translateX(0) rotate(0deg)}50%{transform:translateX(28px) rotate(30deg)}}.arb{animation:rll 2s ease-in-out infinite}`}</style><rect x="0" y="80" width="140" height="5" rx="2" fill={P.roseLite}/><g className="arb"><circle cx="50" cy="72" r="10" fill={P.roseMid}/><rect x="44" y="56" width="12" height="18" rx="5" fill={P.rosePrimary}/><rect x="36" y="54" width="28" height="6" rx="3" fill={P.roseDark}/><rect x="38" y="38" width="24" height="20" rx="6" fill={P.roseDark}/><circle cx="50" cy="28" r="10" fill={P.roseHero}/><line x1="50" y1="44" x2="30" y2="50" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/><line x1="50" y1="44" x2="70" y2="50" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/></g></svg>,
  bc:()=><svg viewBox="0 0 140 90" width="140" height="90"><style>{`@keyframes cl{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-60deg)}}@keyframes cr2{0%,100%{transform:rotate(-60deg)}50%{transform:rotate(0deg)}}.ll{transform-origin:65px 65px;animation:cl 1.2s ease-in-out infinite}.rl{transform-origin:75px 65px;animation:cr2 1.2s ease-in-out infinite}`}</style><rect x="0" y="82" width="140" height="5" rx="2" fill={P.roseLite}/><ellipse cx="70" cy="56" rx="22" ry="10" fill={P.roseDark}/><circle cx="70" cy="36" r="12" fill={P.roseHero}/><line x1="60" y1="40" x2="44" y2="34" stroke={P.rosePrimary} strokeWidth="6" strokeLinecap="round"/><line x1="80" y1="40" x2="96" y2="34" stroke={P.rosePrimary} strokeWidth="6" strokeLinecap="round"/><g className="ll"><rect x="58" y="65" width="12" height="20" rx="5" fill={P.rosePrimary}/></g><g className="rl"><rect x="70" y="65" width="12" height="20" rx="5" fill={P.rosePrimary}/></g></svg>,
  cd:()=><svg viewBox="0 0 140 100" width="140" height="100"><style>{`@keyframes wk{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}@keyframes sl{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(22deg)}}@keyframes sr{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-22deg)}}.wlk{animation:wk 0.85s ease-in-out infinite}.sll{transform-origin:68px 68px;animation:sl 0.85s ease-in-out infinite}.slr{transform-origin:74px 68px;animation:sr 0.85s ease-in-out infinite}`}</style><rect x="0" y="85" width="140" height="10" rx="3" fill={P.roseLite}/><g className="wlk"><circle cx="71" cy="28" r="12" fill={P.roseHero}/><rect x="63" y="40" width="16" height="28" rx="6" fill={P.roseDark}/><g className="sll"><rect x="62" y="68" width="11" height="20" rx="5" fill={P.rosePrimary}/></g><g className="slr"><rect x="67" y="68" width="11" height="20" rx="5" fill={P.rosePrimary}/></g><line x1="63" y1="50" x2="45" y2="62" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/><line x1="79" y1="50" x2="97" y2="42" stroke={P.rosePrimary} strokeWidth="7" strokeLinecap="round"/></g></svg>,
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS=`
@import url('${FONT}');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;overflow:hidden;background:${P.white};}
::-webkit-scrollbar{width:0;}
.app{font-family:'DM Sans',sans-serif;background:${P.white};height:100dvh;max-width:430px;margin:0 auto;display:flex;flex-direction:column;overflow:hidden;position:relative;}
.screen{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;}
.screen-full{flex:1;overflow:hidden;display:flex;flex-direction:column;}
.serif{font-family:'Playfair Display',serif;}
.mono{font-family:'Tenor Sans',sans-serif;}
.card{background:${P.white};border-radius:16px;box-shadow:0 2px 12px rgba(212,120,138,0.09);padding:14px 16px;}
.hero{border-radius:16px;padding:16px;position:relative;overflow:hidden;}
.tag{font-size:8px;letter-spacing:0.2em;text-transform:uppercase;padding:3px 10px;border-radius:20px;display:inline-block;font-weight:500;}
.btnP{background:${P.roseDark};color:white;border:none;border-radius:40px;padding:14px 28px;font-size:13px;font-weight:500;letter-spacing:0.08em;cursor:pointer;font-family:'DM Sans',sans-serif;width:100%;transition:opacity 0.15s;-webkit-appearance:none;}
.btnP:active{opacity:0.82;}
.btnG{background:none;border:1.5px solid ${P.rosePrimary};color:${P.roseDark};border-radius:40px;padding:9px 18px;font-size:12px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;-webkit-appearance:none;}
.nav{flex-shrink:0;background:white;border-top:1px solid ${P.roseLite};display:flex;flex-direction:column;z-index:100;padding-bottom:env(safe-area-inset-bottom,0px);}
.nav-icons{display:flex;align-items:center;justify-content:space-around;height:56px;width:100%;padding:0 4px;}
.nav-safe{display:none;}
.nb{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;padding:0 10px;font-family:'DM Sans',sans-serif;-webkit-appearance:none;flex:1;}
.mo{position:fixed;inset:0;background:rgba(61,32,40,0.65);z-index:200;display:flex;align-items:flex-end;backdrop-filter:blur(6px);}
.ms{background:${P.white};border-radius:24px 24px 0 0;padding:20px 20px calc(24px + env(safe-area-inset-bottom,0px));width:100%;max-width:430px;margin:0 auto;max-height:85dvh;overflow-y:auto;}
@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fu 0.2s ease both;}
@keyframes sl{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.sl{animation:sl 0.28s ease both;}
@keyframes drw{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.drw{animation:drw 0.18s ease both;}
`;

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const[tab,setTab]=useState("today");
  const[data,setData]=useState(()=>{
    const loaded={sessions:[],bodyLog:[],profile:{...DEFAULT_PROFILE},nutritionLog:[],...ld()};
    if(!loaded.profile)loaded.profile={...DEFAULT_PROFILE};
    if(!loaded.nutritionLog)loaded.nutritionLog=[];
    return loaded;
  });
  const[active,setActive]=useState(null);
  const[sess,setSess]=useState(null);
  const[modal,setModal]=useState(null);
  const[summary,setSummary]=useState(null);
  const[rest,setRest]=useState(null);
  const[swapModal,setSwapModal]=useState(null);
  const[swapSelected,setSwapSelected]=useState(null);
  const[logModal,setLogModal]=useState(false);
  const[progressModal,setProgressModal]=useState(null); // "chart"|"week"|"strength"|"milestones"
  const[meModal,setMeModal]=useState(null); // "goals"|"resetWeights"|"clearData"
  const[planModal,setPlanModal]=useState(null); // session plan preview modal
  const[elapsed,setElapsed]=useState(0);
  const startTimeRef=useRef(null);
  const rafRef=useRef(null);
  const lastSecRef=useRef(-1);
  const restStartRef=useRef(null);
  const restTotalRef=useRef(null);
  const restRafRef=useRef(null);
  const lastRestSecRef=useRef(-1);
  const finishingRef=useRef(false);

  // PWA / native meta injection
  useEffect(()=>{
    const setMeta=(n,c)=>{let m=document.querySelector(`meta[name="${n}"]`);if(!m){m=document.createElement("meta");m.name=n;document.head.appendChild(m);}m.content=c;};
    const setMetaP=(p,c)=>{let m=document.querySelector(`meta[property="${p}"]`);if(!m){m=document.createElement("meta");m.setAttribute("property",p);document.head.appendChild(m);}m.content=c;};
    setMeta("viewport","width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover");
    setMeta("apple-mobile-web-app-capable","yes");
    setMeta("apple-mobile-web-app-status-bar-style","black-translucent");
    setMeta("theme-color",P.roseDeep);
    document.documentElement.style.height="100%";
    document.documentElement.style.overflow="hidden";
    document.body.style.height="100%";
    document.body.style.overflow="hidden";
  },[]);

  const tick=useCallback(()=>{
    const sec=Math.floor((Date.now()-startTimeRef.current)/1000);
    if(sec!==lastSecRef.current){lastSecRef.current=sec;setElapsed(sec);}
    rafRef.current=requestAnimationFrame(tick);
  },[]);
  const startTimer=useCallback(()=>{
    if(rafRef.current)return;
    if(!startTimeRef.current)startTimeRef.current=Date.now();
    lastSecRef.current=-1;
    rafRef.current=requestAnimationFrame(tick);
  },[tick]);
  const stopTimer=useCallback(()=>{
    if(rafRef.current){cancelAnimationFrame(rafRef.current);rafRef.current=null;}
  },[]);
  useEffect(()=>{if(sess&&!summary)startTimer();else stopTimer();return stopTimer;},[!!sess,!!summary]);

  const restTick=useCallback(()=>{
    const gone=Math.floor((Date.now()-restStartRef.current)/1000);
    const remaining=Math.max(0,restTotalRef.current-gone);
    if(remaining!==lastRestSecRef.current){
      lastRestSecRef.current=remaining;
      setRest(remaining===0?null:remaining);
      if(remaining===0){
        restRafRef.current=null;
        setSess(prev=>{
          if(!prev)return prev;
          const nextIdx=prev.nextExIdx??prev.currentExIdx;
          const exLen=prev._exLen??999;
          if(nextIdx>=exLen)return{...prev,phase:"done"};
          return{...prev,phase:"active",currentSet:prev.nextSet??0,currentExIdx:nextIdx};
        });
        return;
      }
    }
    if(remaining>0)restRafRef.current=requestAnimationFrame(restTick);
    else restRafRef.current=null;
  },[]);
  const startRest=useCallback((secs)=>{
    if(restRafRef.current){cancelAnimationFrame(restRafRef.current);restRafRef.current=null;}
    restStartRef.current=Date.now();restTotalRef.current=secs;lastRestSecRef.current=-1;
    restRafRef.current=requestAnimationFrame(restTick);
  },[restTick]);
  useEffect(()=>()=>{if(restRafRef.current)cancelAnimationFrame(restRafRef.current);},[]);

  const persist=d=>{setData(d);sv(d);};
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const logBodyEntry=entry=>{
    const today=new Date().toISOString().slice(0,10);
    const newLog=[...data.bodyLog.filter(e=>e.date.slice(0,10)!==today),{date:new Date().toISOString(),...entry}];
    let profile={...data.profile};
    // Lock startWeight/startWaist — capture whenever still null, from any early entry
    if(entry.weight&&!profile.startWeight)profile.startWeight=entry.weight;
    if(entry.waist&&!profile.startWaist)profile.startWaist=entry.waist;
    persist({...data,bodyLog:newLog,profile});
  };

  const startSession=pl=>{
    const initWeights={};
    pl.exercises.forEach(ex=>{if(!ex.bw)initWeights[ex.id]=getWeight(ex,data.sessions,pl.id);});
    startTimeRef.current=null;finishingRef.current=false;
    setActive(pl);setElapsed(0);lastSecRef.current=-1;
    setSess({comp:{},weights:initWeights,csets:{},currentExIdx:0,phase:"active",currentSet:0,swapped:{},_exLen:pl.exercises.length});
    setSummary(null);setRest(null);setTab("today");
  };

  const completeCurrentSet=(ex,ei)=>{
    setSess(prev=>{
      const si=prev.currentSet;const k=`${ex.id}-${si}`;
      const comp={...prev.comp,[k]:true};
      const cnt=Object.keys(comp).filter(x=>x.startsWith(`${ex.id}-`)&&comp[x]).length;
      // Use the weight Lynn has set (pre-populated or manually adjusted) — never recalculate mid-session
      const weights={...prev.weights};
      if(!ex.bw&&weights[ex.id]==null){
        weights[ex.id]=getWeight(ex,data.sessions,active?.id);
      }
      const csets={...prev.csets,[ex.id]:cnt};
      const allDone=cnt>=ex.sets;
      if(ex.rest>0&&!allDone){startRest(ex.rest);return{...prev,comp,weights,csets,phase:"rest",nextSet:si+1,nextExIdx:ei};}
      if(allDone){
        const nextEx=ei+1;
        if(nextEx<active.exercises.length){
          if(ex.rest>0){startRest(ex.rest);return{...prev,comp,weights,csets,phase:"rest",nextSet:0,nextExIdx:nextEx};}
          return{...prev,comp,weights,csets,phase:"active",currentSet:0,currentExIdx:nextEx};
        }
        return{...prev,comp,weights,csets,phase:"done"};
      }
      return{...prev,comp,weights,csets};
    });
  };

  const advanceAfterRest=()=>{
    setRest(null);
    if(restRafRef.current){cancelAnimationFrame(restRafRef.current);restRafRef.current=null;}
    setSess(prev=>{
      if(!prev)return prev;
      const nextIdx=prev.nextExIdx??prev.currentExIdx;
      const exLen=prev._exLen??999;
      if(nextIdx>=exLen)return{...prev,phase:"done"};
      return{...prev,phase:"active",currentSet:prev.nextSet??0,currentExIdx:nextIdx};
    });
  };

  const saveSession=()=>{
    if(!active||!sess)return;
    const trueElapsed=startTimeRef.current?Math.floor((Date.now()-startTimeRef.current)/1000):elapsed;
    const mins=Math.max(1,Math.round(trueElapsed/60));
    const cal=kcal(active.met,mins);
    const numericWeights={};
    active.exercises.forEach(ex=>{
      if(!ex.bw){const used=sess.weights?.[ex.id];if(used!=null)numericWeights[ex.id]=used;}
    });
    const rec={date:new Date().toISOString(),sessionId:active.id,tag:active.tag,duration:trueElapsed,calories:cal,weights:numericWeights,comp:sess.csets,swapped:sess.swapped||{}};
    persist({...data,sessions:[...data.sessions,rec]});
  };

  const finishSession=()=>{
    if(finishingRef.current)return;
    finishingRef.current=true;
    const trueElapsed=startTimeRef.current?Math.floor((Date.now()-startTimeRef.current)/1000):elapsed;
    const mins=Math.max(1,Math.round(trueElapsed/60));
    const cal=kcal(active.met,mins);
    const numericWeights={};
    active.exercises.forEach(ex=>{
      if(!ex.bw){const used=sess.weights?.[ex.id];if(used!=null)numericWeights[ex.id]=used;}
    });
    const prs=active.exercises.filter(ex=>!ex.bw&&numericWeights[ex.id]).filter(ex=>{const pr=getPR(ex,data.sessions);return!pr||numericWeights[ex.id]>pr;}).map(ex=>ex.name);
    const rec={date:new Date().toISOString(),sessionId:active.id,tag:active.tag,duration:trueElapsed,calories:cal,weights:numericWeights,comp:sess.csets,swapped:sess.swapped||{}};
    persist({...data,sessions:[...data.sessions,rec]});
    setSummary({...rec,prs,csets:sess.csets});
    stopTimer();setRest(null);
  };

  const totSets=active?active.exercises.reduce((a,e)=>a+e.sets,0):0;
  const doneSets=sess?Object.values(sess.comp).filter(Boolean).length:0;
  const liveCal=active?kcal(active.met,Math.max(1,Math.round(elapsed/60))):0;
  const weekAgo=Date.now()-7*86400000;
  const thisWeekSess=data.sessions.filter(s=>new Date(s.date)>weekAgo);

  // ── TODAY ─────────────────────────────────────────────────────────────────
  const Today=()=>{
    if(active||summary)return<Workout/>;
    const[expanded,setExpanded]=useState(null);
    const lastSess=data.sessions[data.sessions.length-1];
    const daysSince=lastSess?Math.floor((Date.now()-new Date(lastSess.date))/86400000):null;
    const suggested=SESSIONS.reduce((a,s)=>{
      const lastA=data.sessions.filter(x=>x.sessionId===a.id).slice(-1)[0];
      const lastS=data.sessions.filter(x=>x.sessionId===s.id).slice(-1)[0];
      const tA=lastA?new Date(lastA.date).getTime():0;
      const tS=lastS?new Date(lastS.date).getTime():0;
      return tS<tA?s:a;
    },SESSIONS[0]);
    const weekCounts={glutes:0,core:0,shape:0};
    thisWeekSess.forEach(s=>{if(weekCounts[s.sessionId]!==undefined)weekCounts[s.sessionId]++;});
    const eta=getETA(data.sessions,data.profile,data.bodyLog);
    const todayProtein=getTodayProtein(data.nutritionLog);
    const logProtein=(hit)=>{
      const today=new Date().toISOString().slice(0,10);
      const newLog=(data.nutritionLog||[]).filter(e=>e.date!==today);
      if(hit!==null)newLog.push({date:today,hit});
      else newLog.push({date:today,hit:null,skipped:true}); // skipped: show collapsed state
      persist({...data,nutritionLog:newLog});
    };
    return(<div className="screen-full">
      {/* Header — identical to Me + Stats */}
      <div style={{background:P.roseDeep,padding:"100px 20px 40px",position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,background:"radial-gradient(circle,rgba(242,160,176,0.22),transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
        <p style={{fontSize:9,letterSpacing:"0.28em",color:P.roseMid,textTransform:"uppercase",marginBottom:8}}>{getGreeting()}</p>
        <h1 className="serif" style={{fontSize:30,color:"white",fontWeight:400,lineHeight:1.15}}>Ready, <em style={{color:P.roseHero}}>{data.profile.name}?</em></h1>
        {daysSince!==null&&<p style={{fontSize:10,color:P.roseMid,marginTop:8,fontStyle:"italic"}}>{daysSince===0?"You trained today":"Last session: "+daysSince+" day"+(daysSince!==1?"s":"")+" ago"}</p>}
      </div>

      {/* BODY — same padding discipline as Me/Stats */}
      <div style={{flex:1,display:"flex",flexDirection:"column",padding:"12px 14px 12px",gap:8,overflow:"hidden",minHeight:0,background:P.roseLite}}>

        {/* Banner — flexShrink:0 */}
        <div style={{background:P.white,borderLeft:`3px solid ${P.roseDark}`,borderRadius:"0 10px 10px 0",padding:"8px 14px",flexShrink:0,boxShadow:"0 1px 8px rgba(212,120,138,0.07)"}}>
          <p style={{fontSize:11,fontStyle:"italic",color:P.roseDeep,lineHeight:1.45}}>{getBanner(data.sessions,data.nutritionLog,data.bodyLog,data.profile)}</p>
        </div>

        {/* Stats row — flexShrink:0, compact 2-line chips */}
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          {(()=>{
            const last=data.bodyLog.length?data.bodyLog[data.bodyLog.length-1]:null;
            const first=data.bodyLog.length?data.bodyLog[0]:null;
            const wt=last?.weight??(data.profile.startWeight??50); const wtStart=data.profile.startWeight??(first?.weight??50);
            const ws=last?.waist??(data.profile.startWaist??69); const wsStart=data.profile.startWaist??(first?.waist??69);
            const wtDelta=last?(wt-wtStart).toFixed(1):null;
            const wsDelta=last?(ws-wsStart).toFixed(1):null;
            return[[IcWeight,`${wt} kg`,wtDelta?`${wtDelta>0?"+":""}${wtDelta}`:null,"Weight"],[IcWaist,`${ws} cm`,wsDelta?`${wsDelta>0?"+":""}${wsDelta}`:null,"Waist"],[IcSessions,`${data.sessions.length}`,null,"Sessions"]].map(([Ic,v,delta,l])=>(
              <div key={l} style={{flex:1,background:P.white,borderRadius:12,padding:"9px 10px",boxShadow:"0 1px 6px rgba(212,120,138,0.08)",cursor:l!=="Sessions"?"pointer":"default"}}
                onClick={()=>l!=="Sessions"&&setLogModal(true)}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                  <Ic c={P.roseDark} s={13}/>
                  <span className="mono" style={{fontSize:13,color:P.roseDeep,fontWeight:600,lineHeight:1}}>{v}</span>
                  {delta&&<span style={{fontSize:9,color:parseFloat(delta)<0?P.roseDark:P.roseMid,fontWeight:600}}>{delta}</span>}
                </div>
                <div style={{fontSize:9,color:P.roseMid,letterSpacing:"0.07em",textTransform:"uppercase"}}>{l}</div>
              </div>
            ));
          })()}
        </div>

        {/* Done today — flexShrink:0, conditional */}
        {daysSince===0&&(
          <div style={{background:P.white,border:`1.5px solid ${P.roseLite}`,borderRadius:12,padding:"10px 14px",flexShrink:0,display:"flex",alignItems:"center",gap:10,boxShadow:"0 1px 6px rgba(212,120,138,0.07)"}}>
            <div style={{width:26,height:26,borderRadius:8,background:P.roseLite,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IcCheck c={P.roseDark} s={12}/></div>
            <div>
              <p style={{fontSize:12,color:P.roseDeep,fontWeight:500}}>You trained today — well done.</p>
              <p style={{fontSize:10,color:P.roseMid,marginTop:1}}>Sessions below for a second look or extra work.</p>
            </div>
          </div>
        )}

        {/* Session label — flexShrink:0 */}
        <p style={{fontSize:9,letterSpacing:"0.2em",color:P.roseMid,textTransform:"uppercase",fontWeight:500,flexShrink:0}}>Choose your session</p>

        {/* Session cards — flex:1 fills remaining space, no scroll */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,minHeight:0,overflow:"hidden"}}>
          {SESSIONS.map(pl=>{
            const SIcon=SessIcon[pl.id];
            const isSuggested=pl.id===suggested.id;
            const doneThisWeek=weekCounts[pl.id]||0;
            const lastDone=data.sessions.filter(s=>s.sessionId===pl.id).slice(-1)[0];
            const daysSinceLast=lastDone?Math.floor((Date.now()-new Date(lastDone.date))/86400000):null;
            return(<div key={pl.id} style={{flexShrink:0}}>
              <div onClick={()=>setPlanModal(pl)} style={{background:`linear-gradient(135deg,${pl.color}33,${pl.color}18)`,border:`1.5px solid ${isSuggested?pl.color:pl.color+"33"}`,borderRadius:"12px",padding:"10px 14px",boxShadow:isSuggested?`0 3px 14px ${pl.color}30`:"none",cursor:"pointer"}}>
                {isSuggested&&<span style={{background:pl.color,color:"white",fontSize:7,letterSpacing:"0.15em",textTransform:"uppercase",padding:"2px 8px",borderRadius:20,display:"inline-block",marginBottom:6,fontFamily:"'DM Sans'",fontWeight:500}}>Suggested today</span>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                    <div style={{width:34,height:34,borderRadius:9,background:`${pl.color}22`,border:`1px solid ${pl.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <SIcon c={pl.color} s={17}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <h2 className="serif" style={{fontSize:16,color:P.roseDeep,fontWeight:500,lineHeight:1.2}}>{pl.name}</h2>
                      <p style={{fontSize:10,color:P.roseMid,marginTop:1}}>{pl.exercises.length} ex · ~{pl.duration} min · ~{kcal(pl.met,pl.duration)} kcal</p>
                      {daysSinceLast!==null&&<p style={{fontSize:9,color:pl.color,marginTop:1,fontWeight:500}}>{daysSinceLast===0?"Done today":daysSinceLast===1?"Done yesterday":`${daysSinceLast}d ago`}{doneThisWeek>0?` · ${doneThisWeek}× this week`:""}</p>}
                    </div>
                  </div>
                  <div style={{marginLeft:10,flexShrink:0}}>
                    <button onClick={(e)=>{e.stopPropagation();startSession(pl);}} style={{width:30,height:30,borderRadius:"50%",background:pl.color,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${pl.color}55`}}>
                      <IcPlay c="white" s={11}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>);
          })}
        </div>

        {/* Protein nudge — flexShrink:0, always visible */}
        <div style={{flexShrink:0}}>
          {!todayProtein&&(()=>{
            const currWt=data.bodyLog.length?data.bodyLog[data.bodyLog.length-1].weight:(data.profile.startWeight??50);
            const proteinTarget=Math.round(currWt*2);
            return(<div style={{background:P.white,border:`1.5px solid ${P.roseLite}`,borderRadius:12,padding:"10px 14px",boxShadow:"0 1px 6px rgba(212,120,138,0.07)"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                <IcProtein c={P.roseDark} s={14}/>
                <p style={{fontSize:12,color:P.roseDeep,fontWeight:500}}>Protein today? <span style={{color:P.roseMid,fontWeight:400}}>(~{proteinTarget}g)</span></p>
              </div>
              <div style={{display:"flex",gap:6}}>
                {([["Yes, hit it",true,"#e8f5e9","#2e7d32","#a5d6a7"],["Not today",false,P.roseLite,P.roseDark,P.rosePrimary],["Skip",null,"transparent",P.roseMid,"rgba(196,144,154,0.3)"]] as [string,boolean|null,string,string,string][]).map(([label,val,bg,col,border])=>(
                  <button key={label} onClick={()=>logProtein(val)} style={{flex:1,background:bg,border:`1.5px solid ${border}`,borderRadius:20,padding:"7px 4px",fontSize:10,color:col,cursor:"pointer",fontFamily:"'DM Sans'",fontWeight:500,transition:"all 0.14s"}}>{label}</button>
                ))}
              </div>
            </div>);
          })()}
          {todayProtein&&(
            <div style={{background:todayProtein.hit===true?"#f1f8f1":todayProtein.skipped?"rgba(252,232,236,0.3)":"rgba(252,232,236,0.6)",border:`1.5px solid ${todayProtein.hit===true?"#a5d6a7":P.roseLite}`,borderRadius:12,padding:"9px 14px",display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:todayProtein.hit===true?"#2e7d32":P.roseMid,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IcCheck c="white" s={10}/></div>
              <p style={{fontSize:11,color:todayProtein.hit===true?"#2e7d32":P.roseMid,fontStyle:"italic"}}>{todayProtein.hit===true?"Protein logged — great work today.":todayProtein.skipped?"Skipped for today — check back tomorrow.":"Logged — not today. Tomorrow is another chance."}</p>
            </div>
          )}
        </div>

      </div>
    </div>);
  };

  // ── WORKOUT ───────────────────────────────────────────────────────────────
  const Workout=()=>{
    if(summary)return<Summary/>;
    if(!active||!sess){
      const suggested=SESSIONS.reduce((a,s)=>{
        const lastA=data.sessions.filter(x=>x.sessionId===a.id).slice(-1)[0];
        const lastS=data.sessions.filter(x=>x.sessionId===s.id).slice(-1)[0];
        const tA=lastA?new Date(lastA.date).getTime():0;
        const tS=lastS?new Date(lastS.date).getTime():0;
        return tS<tA?s:a;
      },SESSIONS[0]);
      return(<div className="screen" style={{background:P.bg}}>
        <div style={{background:P.roseDeep,padding:"100px 20px 40px",flexShrink:0}}>
          <p style={{fontSize:9,letterSpacing:"0.28em",color:P.roseMid,textTransform:"uppercase",marginBottom:8}}>Train</p>
          <h1 className="serif" style={{fontSize:26,color:"white",fontWeight:400,lineHeight:1.15}}>Choose your <em style={{color:P.roseHero}}>session</em></h1>
        </div>
        <div style={{padding:"12px 14px 80px"}}>
          {SESSIONS.map(pl=>{
            const SIcon=SessIcon[pl.id];
            const isSuggested=pl.id===suggested.id;
            const lastDone=data.sessions.filter(s=>s.sessionId===pl.id).slice(-1)[0];
            const daysSinceLast=lastDone?Math.floor((Date.now()-new Date(lastDone.date))/86400000):null;
            return(<div key={pl.id} style={{marginBottom:8}}>
              <div className="hero" style={{background:`linear-gradient(135deg,${pl.color}44,${pl.color}22)`,border:`1.5px solid ${isSuggested?pl.color:P.roseLite}`,borderRadius:14,boxShadow:isSuggested?`0 3px 16px ${pl.color}38`:"none"}}>
                {isSuggested&&<span className="tag" style={{background:pl.color,color:"white",marginBottom:7,display:"block",width:"fit-content",fontSize:7}}>SUGGESTED</span>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                    <div style={{width:36,height:36,borderRadius:10,background:`${pl.color}22`,border:`1px solid ${pl.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <SIcon c={pl.color} s={18}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <h2 className="serif" style={{fontSize:17,color:P.roseDeep,fontWeight:500,lineHeight:1.2}}>{pl.name}</h2>
                      <p style={{fontSize:10,color:P.roseMid,marginTop:1}}>{pl.exercises.length} ex · ~{pl.duration} min · ~{kcal(pl.met,pl.duration)} kcal</p>
                      {daysSinceLast!==null&&<p style={{fontSize:9,color:pl.color,marginTop:1,fontWeight:500}}>{daysSinceLast===0?"Done today":daysSinceLast===1?"Done yesterday":`${daysSinceLast}d ago`}</p>}
                    </div>
                  </div>
                  <button onClick={()=>startSession(pl)} style={{width:32,height:32,borderRadius:"50%",background:pl.color,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${pl.color}55`,flexShrink:0,marginLeft:10}}>
                    <IcPlay c="white" s={12}/>
                  </button>
                </div>
              </div>
            </div>);
          })}
        </div>
      </div>);
    }

    const ei=sess.currentExIdx??0;
    const ex=active.exercises[ei];
    const currentSet=sess.currentSet??0;
    const phase=sess.phase??"active";
    const prog=totSets>0?doneSets/totSets:0;
    // cw = what Lynn will actually lift (from sess.weights, editable). Falls back to getWeight if not set.
    const cw=ex?(ex.bw?"BW":(sess.weights?.[ex.id]??getWeight(ex,data.sessions,active?.id))):0;
    const pr=ex?getPR(ex,data.sessions):null;
    const isUp=ex&&!ex.bw&&typeof cw==="number"&&(!pr||cw>pr);
    const setsCompletedForEx=ex?Object.keys(sess.comp).filter(k=>k.startsWith(`${ex.id}-`)&&sess.comp[k]).length:0;
    const SIcon=SessIcon[active.id];

    const ExDots=()=>(
      <div style={{display:"flex",gap:4,alignItems:"center",justifyContent:"center"}}>
        {active.exercises.map((exDot,i)=>{
          const done=Object.keys(sess.comp).filter(k=>k.startsWith(`${exDot.id}-`)&&sess.comp[k]).length>=exDot.sets;
          const cur=i===ei;
          return(<div key={i} style={{width:cur?24:6,height:6,borderRadius:3,background:done?P.roseDark:cur?P.rosePrimary:"rgba(255,255,255,0.18)",transition:"all 0.3s ease",flexShrink:0}}/>);
        })}
      </div>
    );

    const SetDots=()=>(
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        {Array.from({length:ex.sets},(_,s)=>{
          const done=sess.comp[`${ex.id}-${s}`];
          const cur=s===currentSet&&phase==="active";
          return(<div key={s} style={{width:38,height:38,borderRadius:"50%",border:`1.5px solid ${done?P.roseDark:cur?P.rosePrimary:"rgba(255,255,255,0.25)"}`,background:done?P.roseDark:cur?"rgba(242,160,176,0.12)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.22s ease",boxShadow:cur?`0 0 0 3px rgba(242,160,176,0.22)`:"none"}}>
            {done?<IcCheck c="white" s={14}/>:<span style={{fontSize:13,color:done?"white":cur?P.roseHero:"rgba(255,255,255,0.35)",fontFamily:"'Tenor Sans'"}}>{s+1}</span>}
          </div>);
        })}
      </div>
    );

    const clearSession=()=>{stopTimer();if(restRafRef.current){cancelAnimationFrame(restRafRef.current);restRafRef.current=null;}startTimeRef.current=null;finishingRef.current=false;setActive(null);setSess(null);setElapsed(0);setRest(null);setSummary(null);};
    const stopAndBack=()=>{
      if(doneSets>0){
        const choice=window.confirm(`You've done ${doneSets} set${doneSets!==1?"s":""} — save progress before leaving?`);
        if(choice){saveSession();clearSession();setTab("today");}
        else{clearSession();setTab("today");}
      } else {clearSession();setTab("today");}
    };

    // REST screen
    if(phase==="rest"&&rest>0){
      const r=50;const circ=2*Math.PI*r;const frac=rest/(restTotalRef.current||60);
      const nextEx=sess.nextExIdx!==undefined?active.exercises[sess.nextExIdx]:null;
      const nextIsNewEx=sess.nextExIdx!==ei;
      return(<div className="screen-full" style={{background:P.roseDeep}}>
        <div style={{padding:"52px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={stopAndBack} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcBack c={P.roseMid} s={20}/></button>
          <div style={{display:"flex",alignItems:"center",gap:6}}><SIcon c={P.roseMid} s={14}/><p style={{fontSize:9,letterSpacing:"0.2em",color:P.roseMid,textTransform:"uppercase"}}>{active.name}</p></div>
          <button className="btnG" style={{borderColor:"rgba(242,160,176,0.3)",color:P.roseHero,fontSize:9,padding:"5px 10px"}} onClick={finishSession}>FINISH</button>
        </div>
        <div style={{padding:"6px 20px 0"}}><ExDots/></div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px 24px"}}>
          <p style={{fontSize:9,letterSpacing:"0.3em",color:P.roseMid,textTransform:"uppercase",marginBottom:20}}>REST</p>
          <div style={{position:"relative",marginBottom:24}}>
            <svg width={r*2+20} height={r*2+20} style={{transform:"rotate(-90deg)"}}>
              <circle cx={r+10} cy={r+10} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4"/>
              <circle cx={r+10} cy={r+10} r={r} fill="none" stroke={P.rosePrimary} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={circ*(1-frac)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span className="mono" style={{fontSize:40,color:"white",fontVariantNumeric:"tabular-nums",lineHeight:1}}>{rest}</span>
              <span style={{fontSize:10,color:P.roseMid,marginTop:1}}>sec</span>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:"12px 20px",textAlign:"center",marginBottom:22,minWidth:220}}>
            <p style={{fontSize:8,letterSpacing:"0.18em",color:P.roseMid,textTransform:"uppercase",marginBottom:5}}>{nextIsNewEx?"NEXT EXERCISE":"NEXT SET"}</p>
            {nextIsNewEx&&nextEx?(<><p style={{fontSize:15,color:"white",fontWeight:600,marginBottom:2}}>{nextEx.name}</p><p style={{fontSize:10,color:P.roseMid}}>{nextEx.sets} × {nextEx.reps} · {nextEx.bw?"BW":`${sess.weights?.[nextEx.id]??getWeight(nextEx,data.sessions)} kg`}</p></>)
            :(<><p style={{fontSize:15,color:"white",fontWeight:600}}>Set {(sess.nextSet??0)+1} of {ex.sets}</p><p style={{fontSize:10,color:P.roseMid}}>{ex.bw?"Bodyweight":`${cw} kg`}</p></>)}
          </div>
          <button onClick={advanceAfterRest} style={{background:"none",border:`1.5px solid rgba(242,160,176,0.35)`,color:P.roseMid,borderRadius:40,padding:"9px 24px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans'",letterSpacing:"0.07em"}}>SKIP REST</button>
        </div>
        <div style={{padding:"0 24px calc(16px + env(safe-area-inset-bottom,0px))"}}>
          <div style={{height:2,background:"rgba(255,255,255,0.07)",borderRadius:2,marginBottom:7}}><div style={{height:"100%",width:`${prog*100}%`,background:P.rosePrimary,borderRadius:2,transition:"width 0.3s"}}/></div>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>{doneSets} of {totSets} sets complete</p>
        </div>
      </div>);
    }

    // DONE screen
    if(phase==="done"||doneSets>=totSets){
      return(<div className="screen-full" style={{background:P.roseDeep,alignItems:"center",justifyContent:"center",padding:"40px 28px",textAlign:"center"}}>
        <IcSparkle c={P.roseHero} s={36}/>
        <p style={{fontSize:8,letterSpacing:"0.3em",color:P.roseMid,textTransform:"uppercase",margin:"16px 0 6px"}}>All sets done</p>
        <h2 className="serif" style={{fontSize:30,color:"white",fontWeight:400,marginBottom:8}}>Incredible,<br/><em style={{color:P.roseHero}}>{data.profile.name}</em></h2>
        <p style={{fontSize:12,color:P.roseMid,marginBottom:28,lineHeight:1.7}}>Every set complete.</p>
        <button className="btnP" style={{marginBottom:12}} onClick={finishSession}>FINISH SESSION</button>
        <button onClick={()=>{finishingRef.current=false;setSess(prev=>({...prev,phase:"active",currentExIdx:0,currentSet:0,comp:{},csets:{}}));}} style={{background:"none",border:"none",color:P.roseMid,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans'"}}>← Back to exercises</button>
      </div>);
    }

    // ACTIVE SET
    if(!ex)return null;
    return(<div className="screen-full" style={{background:P.roseDeep}}>
      {/* Top bar */}
      <div style={{padding:"52px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <button onClick={stopAndBack} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcBack c={P.roseMid} s={20}/></button>
        <div style={{display:"flex",alignItems:"center",gap:6}}><SIcon c={P.roseMid} s={14}/><p style={{fontSize:9,letterSpacing:"0.18em",color:P.roseMid,textTransform:"uppercase"}}>{active.name}</p></div>
        <button className="btnG" style={{borderColor:"rgba(242,160,176,0.3)",color:P.roseHero,fontSize:9,padding:"5px 10px"}} onClick={finishSession}>FINISH</button>
      </div>
      {/* Progress strip */}
      <div style={{padding:"8px 20px 0",flexShrink:0}}>
        <ExDots/>
        <div style={{height:2,background:"rgba(255,255,255,0.07)",borderRadius:2,marginTop:7}}><div style={{height:"100%",width:`${prog*100}%`,background:P.rosePrimary,borderRadius:2,transition:"width 0.3s"}}/></div>
      </div>
      {/* Main content — flex fills remaining space */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"12px 24px"}}>
        {/* Exercise identity */}
        <div style={{textAlign:"center",marginBottom:16}}>
          {isUp&&<div style={{marginBottom:7}}><span style={{display:"inline-flex",alignItems:"center",gap:4,background:P.rosePrimary,color:"white",fontSize:8,letterSpacing:"0.14em",padding:"3px 11px",borderRadius:20,textTransform:"uppercase"}}><IcArrowUp c="white" s={9}/>Weight up today</span></div>}
          {sess?.swapped?.[ex.id]&&<div style={{marginBottom:7}}><span style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.1)",color:P.roseHero,fontSize:8,letterSpacing:"0.14em",padding:"3px 11px",borderRadius:20,textTransform:"uppercase"}}><IcSwap c={P.roseHero} s={9}/>swapped</span></div>}
          <h2 className="serif" style={{fontSize:24,color:"white",fontWeight:500,lineHeight:1.2,marginBottom:4}}>{sess?.swapped?.[ex.id]||ex.name}</h2>
          <p style={{fontSize:10,color:P.roseMid,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>{ex.muscle}</p>
          {/* Weight adjuster */}
          {ex.bw?(
            <div style={{display:"inline-flex",alignItems:"center",background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"10px 22px",marginBottom:10}}>
              <span className="mono" style={{fontSize:38,color:"white",lineHeight:1}}>BW</span>
            </div>
          ):(
            <div style={{display:"inline-flex",alignItems:"center",gap:0,background:"rgba(255,255,255,0.07)",borderRadius:14,marginBottom:10,overflow:"hidden"}}>
              <button
                onClick={()=>setSess(p=>({...p,weights:{...p.weights,[ex.id]:Math.max(0,Math.round(((p.weights?.[ex.id]??cw)-ex.step)*4)/4)}}))}
                style={{background:"none",border:"none",color:P.roseMid,fontSize:22,cursor:"pointer",padding:"10px 16px",fontFamily:"'DM Sans'",lineHeight:1,WebkitAppearance:"none"}}>−</button>
              <div style={{display:"inline-flex",alignItems:"baseline",gap:5,padding:"10px 4px"}}>
                <span className="mono" style={{fontSize:38,color:isUp?P.roseHero:"white",lineHeight:1,fontVariantNumeric:"tabular-nums"}}>{cw}</span>
                <span style={{fontSize:15,color:P.roseMid}}>kg</span>
                {isUp&&<span style={{marginLeft:2}}><IcArrowUp c={P.roseHero} s={14}/></span>}
              </div>
              <button
                onClick={()=>setSess(p=>({...p,weights:{...p.weights,[ex.id]:Math.round(((p.weights?.[ex.id]??cw)+ex.step)*4)/4}}))}
                style={{background:"none",border:"none",color:P.roseMid,fontSize:22,cursor:"pointer",padding:"10px 16px",fontFamily:"'DM Sans'",lineHeight:1,WebkitAppearance:"none"}}>+</button>
            </div>
          )}
          <p style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginBottom:6,letterSpacing:"0.06em"}}>tap − + to adjust</p>
          <p className="mono" style={{fontSize:14,color:P.rosePrimary}}>{ex.sets} sets × {ex.reps}</p>
        </div>
        {/* Set tracker */}
        <div style={{textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:10,color:P.roseMid,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>{setsCompletedForEx<ex.sets?`Set ${currentSet+1} of ${ex.sets}`:`All ${ex.sets} sets done`}</p>
          <SetDots/>
        </div>
        {/* Tip */}
        <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"10px 14px",marginBottom:14,borderLeft:`2px solid ${P.rosePrimary}`}}>
          <p style={{fontSize:9,color:P.roseMid,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>Tip</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.7)",lineHeight:1.6,fontStyle:"italic"}}>{ex.tip}</p>
        </div>
        {/* CTA */}
        {setsCompletedForEx<ex.sets?(
          <button onClick={()=>completeCurrentSet(ex,ei)} style={{background:P.roseDark,color:"white",border:"none",borderRadius:40,padding:"16px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans'",letterSpacing:"0.05em",boxShadow:`0 4px 18px rgba(212,120,138,0.38)`,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <IcCheck c="white" s={15}/> Done — Set {currentSet+1} of {ex.sets}
          </button>
        ):(
          <button onClick={()=>{const n=ei+1;if(n<active.exercises.length)setSess(p=>({...p,phase:"active",currentSet:0,currentExIdx:n}));else setSess(p=>({...p,phase:"done"}));}} style={{background:P.roseDark,color:"white",border:"none",borderRadius:40,padding:"16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans'",letterSpacing:"0.05em",boxShadow:`0 4px 18px rgba(212,120,138,0.38)`,marginBottom:10}}>
            {ei+1<active.exercises.length?`Next: ${active.exercises[ei+1].name} →`:"Finish Session"}
          </button>
        )}
        {/* Secondary actions */}
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setModal(ex)} style={{flex:1,background:"none",border:`1.5px solid rgba(242,160,176,0.25)`,color:P.roseMid,borderRadius:40,padding:"9px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans'",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <IcInfo c={P.roseMid} s={13}/> How to
          </button>
          {ex.swaps?.length>0&&(<button onClick={()=>{setSwapSelected(null);setSwapModal(ex);}} style={{flex:1,background:"none",border:`1.5px solid rgba(242,160,176,0.25)`,color:P.roseMid,borderRadius:40,padding:"9px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans'",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <IcSwap c={P.roseMid} s={13}/> Swap
          </button>)}
        </div>
      </div>
      {/* Bottom time/kcal — only after 1min */}
      {elapsed>=60&&(<div style={{padding:"0 24px calc(12px + env(safe-area-inset-bottom,0px))",display:"flex",justifyContent:"center",gap:24,flexShrink:0}}>
        <div style={{textAlign:"center",display:"flex",alignItems:"center",gap:5}}>
          <IcClock c="rgba(255,255,255,0.25)" s={12}/>
          <span className="mono" style={{fontSize:13,color:"rgba(255,255,255,0.3)",fontVariantNumeric:"tabular-nums"}}>{fmt(elapsed)}</span>
        </div>
        <div style={{width:1,background:"rgba(255,255,255,0.08)"}}/>
        <div style={{textAlign:"center",display:"flex",alignItems:"center",gap:5}}>
          <IcFire c="rgba(255,255,255,0.25)" s={12}/>
          <span className="mono" style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>{liveCal} kcal</span>
        </div>
      </div>)}
    </div>);
  };

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  const Summary=()=>{
    const pr=getProteinHitRate(data.nutritionLog);
    const lowProtein=pr&&pr.total>=3&&pr.rate<3/7;
    return(<div className="screen">
    <div style={{background:P.roseDeep,padding:"52px 20px 28px",textAlign:"center"}}>
      <IcSparkle c={P.roseHero} s={32}/>
      <p style={{fontSize:8,letterSpacing:"0.3em",color:P.roseMid,textTransform:"uppercase",margin:"12px 0 6px"}}>Session Complete</p>
      <h2 className="serif" style={{fontSize:28,color:"white",fontWeight:400}}>Well done,<br/><em style={{color:P.roseHero}}>{data.profile.name}</em></h2>
    </div>
    <div style={{padding:"16px 14px 80px"}}>
      <div style={{display:"flex",gap:7,marginBottom:12}}>
        {[[IcClock,fmt(summary.duration),"Time"],[IcFire,`~${summary.calories}`,"kcal"],[IcTrain,`${doneSets}/${totSets}`,"Sets"]].map(([Ic,v,l])=>(
          <div key={l} className="card" style={{flex:1,textAlign:"center",padding:"12px 4px"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:3}}><Ic c={P.roseDark} s={15}/></div>
            <div className="mono" style={{fontSize:15,color:P.roseDark}}>{v}</div>
            <div style={{fontSize:8,color:P.roseMid,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:1}}>{l}</div>
          </div>
        ))}
      </div>
      {summary.prs?.length>0&&(<div style={{background:P.roseLite,border:`1.5px solid ${P.rosePrimary}`,borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"flex-start",gap:8}}>
        <IcTrophy c={P.roseDark} s={14}/>
        <div>
          <p style={{fontSize:8,letterSpacing:"0.18em",color:P.roseDark,textTransform:"uppercase",marginBottom:3}}>New Personal Record</p>
          {summary.prs.map(n=><p key={n} style={{fontSize:12,color:P.roseDeep,fontWeight:500}}>{n}</p>)}
        </div>
      </div>)}
      <div className="card" style={{marginBottom:10}}>
        <p style={{fontSize:8,letterSpacing:"0.18em",color:P.roseMid,textTransform:"uppercase",marginBottom:8}}>Session Recap</p>
        {active?.exercises.map(ex=>{
          const d=summary.csets?.[ex.id]||0;
          return(<div key={ex.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${P.roseLite}`}}>
            <span style={{fontSize:11,color:d>=ex.sets?P.roseDeep:P.roseMid}}>{ex.name}</span>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:10,color:P.roseMid,fontFamily:"'Tenor Sans'"}}>{d}/{ex.sets}</span>
              {d>=ex.sets&&<IcCheck c={P.roseDark} s={11}/>}
            </div>
          </div>);
        })}
      </div>
      <div style={{background:P.roseLite,borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",gap:8,alignItems:"flex-start"}}>
        <IcProtein c={P.roseDark} s={15}/>
        <div>
          <p style={{fontSize:10,color:P.roseDark,fontWeight:500,marginBottom:2}}>Nutrition reminder</p>
          <p style={{fontSize:11,color:P.roseMid,fontStyle:"italic",lineHeight:1.55}}>
            {lowProtein?"Most days this week protein was low. A shake right now = easy 30g. Your muscles need it after this session.":"Aim for ~30g protein within the next hour."}
          </p>
        </div>
      </div>
      <div style={{background:P.white,border:`1px solid ${P.roseLite}`,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <IcWeight c={P.roseMid} s={14}/>
          <p style={{fontSize:11,color:P.roseMid,fontStyle:"italic"}}>
            {data.bodyLog.length?`Last logged ${Math.floor((Date.now()-new Date(data.bodyLog[data.bodyLog.length-1].date))/86400000)||0}d ago`:"No stats logged yet"}
          </p>
        </div>
        <button onClick={()=>setLogModal(true)} style={{background:"none",border:`1px solid ${P.roseDark}`,borderRadius:20,padding:"4px 12px",fontSize:10,color:P.roseDark,cursor:"pointer",fontFamily:"'DM Sans'",fontWeight:500,letterSpacing:"0.05em"}}>Log stats</button>
      </div>
      <button className="btnP" onClick={()=>{setSummary(null);setActive(null);setSess(null);setElapsed(0);startTimeRef.current=null;finishingRef.current=false;lastSecRef.current=-1;setTab("today");}}>BACK TO HOME</button>
    </div>
  </div>);
  };

  // ── DEMO MODAL ────────────────────────────────────────────────────────────
  const Modal=()=>{
    if(!modal)return null;
    const Anim=A[modal.anim]||A.cd;
    return(<div className="mo" onClick={()=>setModal(null)}>
      <div className="ms sl" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 className="serif" style={{fontSize:18,color:P.roseDeep,fontWeight:600,flex:1}}>{modal.name}</h3>
          <button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
        </div>
        <div style={{background:P.bg,borderRadius:14,padding:"16px",display:"flex",justifyContent:"center",alignItems:"center",marginBottom:12,minHeight:100}}><Anim/></div>
        <span className="tag" style={{background:P.roseLite,color:P.roseDark,marginBottom:12,display:"block",width:"fit-content"}}>{modal.muscle}</span>
        {[["START POSITION",modal.start,IcPin,"none"],["THE MOVE",modal.cue,IcMove,"none"],["LYNN'S TIP",modal.tip,IcStar,"tip"],["DON'T",modal.dont,IcDont,"none"]].map(([lb,ct,Ic,t])=>(
          <div key={lb} style={{marginBottom:8,padding:"9px 11px",background:t==="tip"?P.roseLite:P.bg,borderRadius:9,borderLeft:t==="tip"?`2.5px solid ${P.roseDark}`:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <Ic c={P.roseDark} s={12}/>
              <p style={{fontSize:7,letterSpacing:"0.17em",color:P.roseDark,textTransform:"uppercase",fontWeight:600}}>{lb}</p>
            </div>
            <p style={{fontSize:11,color:P.roseDeep,lineHeight:1.6,paddingLeft:18}}>{ct}</p>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button className="btnG" style={{flex:1}} onClick={()=>setModal(null)}>CLOSE</button>
          <button className="btnP" style={{flex:2}} onClick={()=>setModal(null)}>GOT IT</button>
        </div>
      </div>
    </div>);
  };

  // ── SWAP MODAL ────────────────────────────────────────────────────────────
  const SwapModal=()=>{
    if(!swapModal)return null;
    const doSwap=()=>{if(!swapSelected)return;setSess(prev=>({...prev,swapped:{...prev.swapped,[swapModal.id]:swapSelected}}));setSwapModal(null);setSwapSelected(null);};
    const close=()=>{setSwapModal(null);setSwapSelected(null);};
    return(<div className="mo" onClick={close}>
      <div className="ms sl" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><IcSwap c={P.roseMid} s={14}/><span style={{fontSize:9,letterSpacing:"0.18em",color:P.roseMid,textTransform:"uppercase"}}>Equipment taken?</span></div>
          <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={16}/></button>
        </div>
        <h3 className="serif" style={{fontSize:19,color:P.roseDeep,marginBottom:4}}>{swapModal.name}</h3>
        <p style={{fontSize:11,color:P.roseMid,marginBottom:14,lineHeight:1.5}}>Session-only swap — resets automatically next time.</p>
        {swapModal.swaps.map((sw,i)=>(
          <div key={i} onClick={()=>setSwapSelected(sw.name)} style={{border:`1.5px solid ${swapSelected===sw.name?P.roseDark:P.roseLite}`,borderRadius:12,padding:"11px 13px",marginBottom:7,cursor:"pointer",background:swapSelected===sw.name?P.roseLite:P.white,transition:"all 0.14s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${swapSelected===sw.name?P.roseDark:P.roseMid}`,background:swapSelected===sw.name?P.roseDark:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {swapSelected===sw.name&&<div style={{width:6,height:6,borderRadius:"50%",background:"white"}}/>}
              </div>
              <div>
                <p style={{fontSize:13,color:P.roseDeep,fontWeight:500}}>{sw.name}</p>
                <p style={{fontSize:10,color:P.roseMid,marginTop:1}}>{sw.note}</p>
              </div>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button className="btnG" style={{flex:1}} onClick={close}>CANCEL</button>
          <button className="btnP" style={{flex:2,opacity:swapSelected?1:0.4}} onClick={doSwap}>SWAP</button>
        </div>
      </div>
    </div>);
  };

  // ── ENGINES — PROGRESS ────────────────────────────────────────────────────
  const getCoach=(sessions,bodyLog)=>{
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
  };
  const getMilestones=(sessions,bodyLog,profile={})=>{
    const ms=[];
    const first=bodyLog[0];
    bodyLog.forEach(e=>{
      if(first&&e.weight<first.weight-0.9&&!ms.find(m=>m.id==="w1"))ms.push({id:"w1",icon:"weight",title:"First kilogram gone",sub:`${first.weight} → ${e.weight} kg — the first one is the hardest.`});
      if(first&&e.waist&&first.waist&&e.waist<first.waist-0.9&&!ms.find(m=>m.id==="ws1"))ms.push({id:"ws1",icon:"waist",title:"First centimetre off the waist",sub:`${first.waist} → ${e.waist} cm — the core work is showing.`});
      if(first&&e.weight!=null&&e.weight<=(profile?.goalWeight??45)&&!ms.find(m=>m.id==="goalW"))ms.push({id:"goalW",icon:"trophy",title:`Goal weight reached — ${e.weight} kg`,sub:"You hit your target. Now set a new one and keep going."});
      if(first&&e.waist!=null&&e.waist<=(profile?.goalWaist??63)&&!ms.find(m=>m.id==="goalWs"))ms.push({id:"goalWs",icon:"trophy",title:`Goal waist reached — ${e.waist} cm`,sub:"63 cm. You earned it. There's always a next level."});
      if(e.bodyFat&&e.bodyFat<23&&!ms.find(m=>m.id==="bf23"))ms.push({id:"bf23",icon:"fire",title:"Under 23% body fat",sub:"Visible toning territory. You're in it."});
    });
    const allExIds=SESSIONS.flatMap(s=>s.exercises.map(e=>e.id));
    allExIds.forEach(id=>{
      const pr=sessions.filter(s=>s.weights&&s.weights[id]!=null);
      if(pr.length>1){const ex=SESSIONS.flatMap(s=>s.exercises).find(e=>e.id===id);if(ex&&!ex.bw&&!ms.find(m=>m.id==="pr_"+id)){const maxW=Math.max(...pr.map(s=>s.weights[id]));const startW=pr[0].weights[id];if(maxW>startW+4)ms.push({id:"pr_"+id,icon:"trophy",title:`${ex.name} PR`,sub:`${startW} → ${maxW} kg — up ${(maxW-startW).toFixed(1)} kg from start.`});}}
    });
    if(sessions.length>=10)ms.push({id:"s10",icon:"sessions",title:"10 sessions complete",sub:"You showed up 10 times. That's the whole game."});
    if(sessions.length>=25)ms.push({id:"s25",icon:"sessions",title:"25 sessions complete",sub:"25 sessions. You're not trying it anymore — you're doing it."});
    const types=new Set(sessions.filter(s=>new Date(s.date)>Date.now()-7*86400000).map(s=>s.sessionId));
    if(types.size===3)ms.push({id:"full3",icon:"star",title:"Full week — all 3 sessions",sub:"Glutes, Core, and Shape all covered in one week. Balanced."});
    return ms.reverse();
  };

  // ── PROGRESS SCREEN ────────────────────────────────────────────────────────
  const Progress=()=>{
    const last=data.bodyLog.length?data.bodyLog[data.bodyLog.length-1]:null;
    const first=data.bodyLog.length?data.bodyLog[0]:null;
    const wt=last?.weight??null;
    const wtStart=data.profile.startWeight??(first?.weight??50);
    const ws=last?.waist??null;
    const wsStart=data.profile.startWaist??(first?.waist??69);
    const bf=last?.bodyFat??null;
    const goalW=data.profile.goalWeight??45;
    const goalWs=data.profile.goalWaist??63;
    const wtPct=wt?Math.min(100,Math.max(0,((wtStart-wt)/(wtStart-goalW||1))*100)):0;
    const wsPct=ws?Math.min(100,Math.max(0,((wsStart-ws)/(wsStart-goalWs||1))*100)):0;
    const weekAgo=Date.now()-7*86400000;
    const weekSess=data.sessions.filter(s=>new Date(s.date)>weekAgo);
    const weekTypes=new Set(weekSess.map(s=>s.sessionId));
    const coach=getCoach(data.sessions,data.bodyLog);
    const milestones=getMilestones(data.sessions,data.bodyLog,data.profile);
    const eta=getETA(data.sessions,data.profile,data.bodyLog);
    const isEmpty=!data.bodyLog.length&&!data.sessions.length;

    if(isEmpty)return(<div className="screen-full" style={{background:P.roseDeep}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",textAlign:"center"}}>
        <IcSparkle c={P.roseHero} s={36}/>
        <p style={{fontSize:9,letterSpacing:"0.28em",color:P.roseMid,textTransform:"uppercase",margin:"16px 0 6px"}}>Your progress</p>
        <h2 className="serif" style={{fontSize:28,color:"white",fontWeight:400,lineHeight:1.2,marginBottom:10}}>Your journey<br/><em style={{color:P.roseHero}}>starts here.</em></h2>
        <p style={{fontSize:12,color:P.roseMid,lineHeight:1.7,marginBottom:28}}>Log your first body stats and complete your first session to unlock charts, milestones and your coach insights.</p>
        <button className="btnP" onClick={()=>setLogModal(true)}>+ Log today's stats</button>
        <button onClick={()=>setTab("today")} style={{background:"none",border:"none",color:P.roseMid,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans'",marginTop:12}}>Choose a session →</button>
      </div>
    </div>);

    // ── Build coach sentence with highlighted segments (matches mockup style) ──
    const coachParts:(string|{hi:string})[]=[];
    (()=>{
      // Split coach string into plain + highlighted segments
      // Highlight numbers and key phrases (anything in quotes or metric patterns)
      const raw=coach;
      // Highlight patterns: numbers with units, and short metric phrases
      const re=/(\d+\.?\d*\s*(kg|cm|%|sessions?|wk|days?|x))/gi;
      let last=0;raw.replace(re,(m,_,__,offset)=>{
        if(offset>last)coachParts.push(raw.slice(last,offset));
        coachParts.push({hi:m});last=offset+m.length;
      });
      if(last<raw.length)coachParts.push(raw.slice(last));
      if(coachParts.length===0)coachParts.push(raw);
    })();

    return(<div className="screen-full" style={{background:P.roseDeep}}>

      {/* ── HEADER — matches Today tab: 100px top / 20px sides / 40px bottom ── */}
      <div style={{padding:"100px 20px 40px",position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,background:"radial-gradient(circle,rgba(242,160,176,0.22),transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
        <p style={{fontSize:9,letterSpacing:"0.28em",color:P.roseMid,textTransform:"uppercase",marginBottom:8}}>Your progress</p>
        <h1 className="serif" style={{fontSize:26,color:"white",fontWeight:400,lineHeight:1.2}}>
          {coachParts.map((p,i)=>typeof p==="string"
            ?<span key={i}>{p}</span>
            :<em key={i} style={{color:P.roseHero,fontStyle:"italic"}}>{p.hi}</em>
          )}
        </h1>
      </div>

      {/* ── PANELS ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",padding:"20px 14px 20px",gap:10,overflowY:"auto",overflowX:"hidden",minHeight:0,background:P.roseLite}}>

        {/* PANEL 1 — Goal pace: flexShrink:0, content drives height */}
        <div onClick={()=>setProgressModal("chart")} style={{background:P.white,borderRadius:14,padding:"14px 20px",cursor:"pointer",boxShadow:"0 2px 12px rgba(212,120,138,0.09)",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:9,borderBottom:`1px solid ${P.roseLite}`,marginBottom:12}}>
            <p style={{fontSize:10,letterSpacing:"0.2em",color:P.roseMid,textTransform:"uppercase",fontWeight:500}}>Goal pace</p>
            <span style={{fontSize:10,color:P.roseMid}}>tap for chart</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
            <span style={{fontSize:13,color:P.roseDeep,fontWeight:500}}>Weight <span style={{fontSize:11,fontWeight:400,color:P.roseMid}}>{wtStart} → {goalW} kg</span></span>
            <span style={{fontSize:13,color:P.roseDark,fontWeight:600}}>{eta?typeof eta.weeksToGoalWeight==="number"?`~${eta.weeksToGoalWeight} wk`:eta.weeksToGoalWeight:"—"}</span>
          </div>
          <div style={{height:6,background:P.roseLite,borderRadius:3,marginBottom:12}}><div style={{height:"100%",width:`${wtPct}%`,background:`linear-gradient(to right,${P.rosePrimary},${P.roseDark})`,borderRadius:3,transition:"width 0.5s ease"}}/></div>
          {wt!=null&&wt<=goalW&&<p style={{fontSize:10,color:P.roseDark,fontWeight:500,marginBottom:8,textAlign:"center"}}>✦ Goal reached — tap Goals in Me to set your next target</p>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
            <span style={{fontSize:13,color:P.roseDeep,fontWeight:500}}>Waist <span style={{fontSize:11,fontWeight:400,color:P.roseMid}}>{wsStart} → {goalWs} cm</span></span>
            <span style={{fontSize:13,color:P.roseDark,fontWeight:600}}>{eta?typeof eta.weeksToGoalWaist==="number"?`~${eta.weeksToGoalWaist} wk`:eta.weeksToGoalWaist:"—"}</span>
          </div>
          <div style={{height:6,background:P.roseLite,borderRadius:3}}><div style={{height:"100%",width:`${wsPct}%`,background:`linear-gradient(to right,${P.rosePrimary},${P.roseDark})`,borderRadius:3,transition:"width 0.5s ease"}}/></div>
          {ws!=null&&ws<=goalWs&&<p style={{fontSize:10,color:P.roseDark,fontWeight:500,marginTop:8,textAlign:"center"}}>✦ Goal reached — tap Goals in Me to set your next target</p>}
        </div>

        {/* PANEL 2 — This week: flexShrink:0 */}
        <div onClick={()=>setProgressModal("week")} style={{background:P.white,borderRadius:14,padding:"12px 20px",cursor:"pointer",boxShadow:"0 2px 12px rgba(212,120,138,0.09)",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:9,borderBottom:`1px solid ${P.roseLite}`,marginBottom:9}}>
            <p style={{fontSize:10,letterSpacing:"0.2em",color:P.roseMid,textTransform:"uppercase",fontWeight:500}}>This week</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(212,120,138,0.1)",borderRadius:14,padding:"3px 10px"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:P.roseDark}}/>
              <span style={{fontSize:11,color:P.roseDark,fontWeight:500}}>
                {weekSess.length} of 3{weekSess.length<3?" · "+[["glutes","Glutes"],["core","Core"],["shape","Shape"]].filter(([id])=>!weekTypes.has(id)).map(([,n])=>n).join(", "):""}
              </span>
            </div>
          </div>
          <div style={{display:"flex",gap:8,height:52}}>
            {([["glutes","Glutes",IcGlutes,P.rosePrimary],["core","Core",IcCore,P.roseDark],["shape","Shape",IcShape,P.accent]] as [string,string,any,string][]).map(([id,label,Ic,col])=>{
              const done=weekTypes.has(id);
              return(<div key={id} style={{flex:1,borderRadius:10,padding:"7px 4px",textAlign:"center",border:`1.5px solid ${done?col:col+"22"}`,background:done?col+"18":col+"0d",transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
                <Ic c={done?col:col+"88"} s={16}/>
                <p style={{fontSize:9,color:done?col:P.roseMid,fontWeight:done?600:500,letterSpacing:"0.04em"}}>{label.toUpperCase()}{done?" ✓":""}</p>
              </div>);
            })}
          </div>
        </div>

        {/* PANEL 3 — Strength PRs: flexShrink:0, fixed row padding, no overflow */}
        <div onClick={()=>setProgressModal("strength")} style={{background:P.white,borderRadius:14,padding:"14px 20px",cursor:"pointer",boxShadow:"0 2px 12px rgba(212,120,138,0.09)",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:9,borderBottom:`1px solid ${P.roseLite}`,marginBottom:4}}>
            <p style={{fontSize:10,letterSpacing:"0.2em",color:P.roseMid,textTransform:"uppercase",fontWeight:500}}>Strength PRs</p>
            <span style={{fontSize:10,color:P.roseMid}}>tap for all</span>
          </div>
          {[{id:"ht",name:"Hip Thrust"},{id:"cc",name:"Cable Crunch"},{id:"sm",name:"Smith Thrust"}].map((ex)=>{
            const allEx=SESSIONS.flatMap(s=>s.exercises).find(e=>e.id===ex.id);
            const pr=allEx?getPR(allEx,data.sessions):null;
            const cur=allEx?getWeight(allEx,data.sessions):null;
            const startKg=allEx?.kg||0;
            const pct=pr&&startKg?Math.min(100,((pr-startKg)/startKg)*100):0;
            const isPR=cur&&pr&&cur>=pr;
            return(<div key={ex.id} style={{display:"flex",alignItems:"center",gap:12,padding:"7px 0"}}>
              <span style={{flex:1,fontSize:13,color:P.roseDeep,fontWeight:500,lineHeight:1}}>{ex.name}</span>
              <div style={{width:48,height:4,background:P.roseLite,borderRadius:2,flexShrink:0}}>
                <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(to right,${P.rosePrimary},${P.roseDark})`,borderRadius:2}}/>
              </div>
              <span className="mono" style={{fontSize:13,color:P.roseDark,minWidth:52,textAlign:"right",flexShrink:0}}>
                {cur&&cur!=="BW"?`${cur} kg`:cur||"—"}
              </span>
            </div>);
          })}
        </div>

        {/* PANEL 4 — Log + Milestone */}
        <div style={{display:"flex",gap:8,flexShrink:0,minHeight:52,alignItems:"stretch"}}>
          <button onClick={()=>setLogModal(true)} style={{flex:"1.4 1 0",minWidth:0,flexShrink:0,fontSize:13,letterSpacing:"0.05em",background:P.roseDark,color:"white",border:"none",borderRadius:40,fontWeight:500,fontFamily:"'DM Sans'",cursor:"pointer",transition:"opacity 0.15s"}}
            onTouchStart={e=>(e.currentTarget.style.opacity="0.82")} onTouchEnd={e=>(e.currentTarget.style.opacity="1")} onTouchCancel={e=>(e.currentTarget.style.opacity="1")}>
            + Log today's stats
          </button>
          <div onClick={()=>setProgressModal("milestones")} style={{flex:1,minWidth:0,background:milestones.length>0?`linear-gradient(135deg,${P.roseLite},${P.white})`:P.roseLite,border:milestones.length>0?`1.5px solid ${P.rosePrimary}`:`1px dashed ${P.rosePrimary}`,borderRadius:12,padding:"7px 12px",cursor:"pointer",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            {milestones.length>0?(
              <><span style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:P.roseMid,fontWeight:500}}>Milestone</span>
              <p style={{fontSize:13,color:P.roseDeep,fontWeight:500,lineHeight:1.25,marginTop:2}}>{milestones[0].title}</p></>
            ):(
              <p style={{fontSize:13,color:P.roseDeep,fontWeight:500,textAlign:"center",lineHeight:1.3}}>Milestones unlock with progress</p>
            )}
          </div>
        </div>

      </div>
    </div>);
  };

  // ── LOG MODAL ─────────────────────────────────────────────────────────────
  const LogModal=()=>{
    const last=data.bodyLog.length?data.bodyLog[data.bodyLog.length-1]:null;
    const[wt,setWt]=useState(last?.weight?.toString()||"");
    const[ws,setWs]=useState(last?.waist?.toString()||"");
    const[bf,setBf]=useState(last?.bodyFat?.toString()||"");
    const[mm,setMm]=useState(last?.muscleMass?.toString()||"");
    const[ma,setMa]=useState(last?.metabolicAge?.toString()||"");
    const[showMore,setShowMore]=useState(false);
    const[activeField,setActiveField]=useState(null);
    const daysSince=last?Math.floor((Date.now()-new Date(last.date))/86400000):null;
    const wtDelta=wt&&last?.weight?(parseFloat(wt)-last.weight).toFixed(1):null;
    const wsDelta=ws&&last?.waist?(parseFloat(ws)-last.waist).toFixed(1):null;
    const bfDelta=bf&&last?.bodyFat?(parseFloat(bf)-last.bodyFat).toFixed(1):null;
    const canSave=!!(wt||ws||bf);
    const save=()=>{
      if(!canSave)return;
      logBodyEntry({...(wt&&{weight:parseFloat(wt)}),...(ws&&{waist:parseFloat(ws)}),...(bf&&{bodyFat:parseFloat(bf)}),...(mm&&{muscleMass:parseFloat(mm)}),...(ma&&{metabolicAge:parseFloat(ma)})});
      setLogModal(false);
    };
    return(<div className="mo" onClick={()=>setLogModal(false)}>
      <div className="ms sl" onClick={e=>e.stopPropagation()}>
        <div style={{width:32,height:3,background:P.roseLite,borderRadius:2,margin:"0 auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <h3 className="serif" style={{fontSize:20,color:P.roseDeep,fontWeight:400}}>Today's numbers</h3>
          <button onClick={()=>setLogModal(false)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
        </div>
        <p style={{fontSize:10,color:P.roseMid,fontStyle:"italic",marginBottom:16}}>
          {daysSince===0?"Logged today — update if things changed":daysSince===1?"Last logged yesterday":daysSince?`Last logged ${daysSince} days ago`:"First entry — set your baseline"}
        </p>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <LogField label="Weight" val={wt} setVal={setWt} unit="kg" delta={wtDelta} activeField={activeField} setActiveField={setActiveField}/>
          <LogField label="Waist" val={ws} setVal={setWs} unit="cm" delta={wsDelta} activeField={activeField} setActiveField={setActiveField}/>
          <LogField label="Body fat" val={bf} setVal={setBf} unit="%" delta={bfDelta} activeField={activeField} setActiveField={setActiveField}/>
        </div>
        <button onClick={()=>setShowMore(s=>!s)} style={{background:"none",border:"none",cursor:"pointer",color:P.roseMid,fontSize:10,fontFamily:"'DM Sans'",letterSpacing:"0.06em",padding:"4px 0",display:"flex",alignItems:"center",gap:4,marginBottom:showMore?10:14}}>
          <span style={{display:"inline-block",transition:"transform 0.2s",transform:showMore?"rotate(180deg)":"none"}}>▾</span>
          {showMore?"Hide":"More measurements"}
        </button>
        {showMore&&(<div style={{display:"flex",gap:8,marginBottom:14}}>
          <LogField label="Muscle" val={mm} setVal={setMm} unit="kg" activeField={activeField} setActiveField={setActiveField}/>
          <LogField label="Met. age" val={ma} setVal={setMa} unit="yrs" activeField={activeField} setActiveField={setActiveField}/>
        </div>)}
        <button onClick={save} style={{background:canSave?P.roseDark:"rgba(212,120,138,0.3)",color:"white",border:"none",borderRadius:40,padding:"14px",fontSize:13,fontWeight:500,letterSpacing:"0.08em",cursor:canSave?"pointer":"not-allowed",fontFamily:"'DM Sans'",width:"100%",transition:"opacity 0.15s"}}>SAVE READING</button>
      </div>
    </div>);
  };

  // ── PROGRESS DETAIL MODALS ─────────────────────────────────────────────────
  // Field defined outside modal to prevent remount on every keystroke
  const LogField=({label,val,setVal,unit,delta,activeField,setActiveField})=>{
    const isActive=activeField===label;
    const neg=delta&&parseFloat(delta)<0;
    return(<div onClick={()=>setActiveField(label)} style={{flex:1,background:isActive?P.white:"rgba(255,255,255,0.06)",border:`1.5px solid ${isActive?P.roseDark:"rgba(255,255,255,0.12)"}`,borderRadius:14,padding:"10px 8px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}>
      <p style={{fontSize:8,letterSpacing:"0.14em",color:isActive?P.roseDark:P.roseMid,textTransform:"uppercase",marginBottom:4}}>{label}</p>
      {isActive
        ?<input autoFocus type="number" step="0.1" value={val} onChange={e=>setVal(e.target.value)} style={{width:"100%",border:"none",background:"transparent",textAlign:"center",fontSize:24,fontFamily:"'Tenor Sans',sans-serif",color:P.roseDeep,outline:"none",fontVariantNumeric:"tabular-nums"}}/>
        :<p className="mono" style={{fontSize:24,color:val?P.roseDeep:"rgba(255,255,255,0.25)",lineHeight:1}}>{val||"—"}</p>
      }
      <p style={{fontSize:9,color:isActive?P.roseMid:"rgba(255,255,255,0.4)",marginTop:2}}>{unit}</p>
      {delta&&<p style={{fontSize:8,color:neg?P.roseDark:P.roseMid,fontWeight:neg?600:400,marginTop:2}}>{neg?"↓":"↑"} {Math.abs(parseFloat(delta))}</p>}
    </div>);
  };

  // ChartPanel extracted to avoid conditional useState
  const ChartPanel=({close})=>{
    const[metric,setMetric]=useState("weight");
    const entries=data.bodyLog.filter(e=>metric==="weight"?e.weight!=null:metric==="waist"?e.waist!=null:e.bodyFat!=null);
    const vals=entries.map(e=>metric==="weight"?e.weight:metric==="waist"?e.waist:e.bodyFat);
    const goal=metric==="weight"?(data.profile.goalWeight??45):metric==="waist"?(data.profile.goalWaist??63):20;
    const unit=metric==="weight"?"kg":metric==="waist"?"cm":"%";
    const safeVals=vals.length>0?vals:[goal];
    const minV=Math.min(...safeVals,goal)-1;
    const maxV=Math.max(...safeVals)+1;
    const W=320;const H=100;const pad=24;
    const xOf=(i)=>safeVals.length>1?pad+(i/(safeVals.length-1))*(W-pad*2):W/2;
    const yOf=(v)=>H-pad-((v-minV)/(maxV-minV||1))*(H-pad*2);
    const goalY=yOf(goal);
    const coreLine=metric==="waist"&&data.sessions.filter(s=>s.sessionId==="core").length>0&&data.bodyLog.length>1&&(data.bodyLog[data.bodyLog.length-1].waist||0)<(data.bodyLog[0].waist||0)
      ?"Core sessions are shrinking your waist. Keep them in rotation.":null;
    return(<div className="mo" onClick={close}><div className="ms sl" onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h3 className="serif" style={{fontSize:18,color:P.roseDeep}}>Body trend</h3>
        <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
      </div>
      <div style={{display:"flex",gap:4,background:P.roseLite,borderRadius:10,padding:"3px",marginBottom:14}}>
        {[["weight","Weight"],["waist","Waist"],["bodyFat","Body fat"]].map(([m,lbl])=>(
          <button key={m} onClick={()=>setMetric(m)} style={{flex:1,border:"none",borderRadius:8,padding:"6px",fontSize:10,cursor:"pointer",fontFamily:"'DM Sans'",fontWeight:500,background:metric===m?P.roseDark:"transparent",color:metric===m?"white":P.roseDark,transition:"all 0.15s"}}>{lbl}</button>
        ))}
      </div>
      {vals.length<1?(<div style={{height:H,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}><p style={{color:P.roseMid,fontSize:12,fontStyle:"italic"}}>No data yet — log your stats to see your trend.</p></div>):(
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible",marginBottom:8}}>
          <line x1={pad} y1={goalY} x2={W-pad} y2={goalY} stroke={P.roseLite} strokeWidth="1" strokeDasharray="4 3"/>
          <text x={W-pad+2} y={goalY+4} fontSize="8" fill={P.roseMid} fontFamily="DM Sans">goal</text>
          {vals.length>1&&<path d={`M${xOf(0)},${yOf(vals[0])} ${vals.slice(1).map((v,i)=>`L${xOf(i+1)},${yOf(v)}`).join(" ")} L${xOf(vals.length-1)},${H-4} L${xOf(0)},${H-4} Z`} fill={`${P.rosePrimary}18`}/>}
          {vals.length>1&&<polyline points={vals.map((v,i)=>`${xOf(i)},${yOf(v)}`).join(" ")} fill="none" stroke={P.roseDark} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>}
          {vals.map((v,i)=><circle key={i} cx={xOf(i)} cy={yOf(v)} r={i===vals.length-1?4:2.5} fill={i===vals.length-1?P.roseDeep:P.roseDark} stroke={P.roseDark} strokeWidth="1.5"/>)}
          <text x={xOf(0)} y={H} fontSize="7" fill={P.roseMid} fontFamily="DM Sans" textAnchor="middle">{vals.length===1?"only entry":"start"}</text>
          {vals.length>1&&<text x={xOf(vals.length-1)} y={H} fontSize="7" fill={P.roseMid} fontFamily="DM Sans" textAnchor="middle">now</text>}
        </svg>
      )}
      {vals.length>0&&<div style={{display:"flex",gap:8,marginBottom:10}}>
        {[["Start",vals[0]],["Now",vals[vals.length-1]],["Change",(vals[vals.length-1]-vals[0])]].map(([lbl,v],i)=>(
          <div key={lbl} style={{flex:1,background:P.roseLite,borderRadius:10,padding:"8px 10px"}}>
            <p style={{fontSize:8,color:P.roseMid,textTransform:"uppercase",letterSpacing:"0.1em"}}>{lbl}</p>
            <p className="mono" style={{fontSize:16,color:i===2&&v<0?P.roseDark:P.roseDeep}}>{i===2?(v>0?"+":"")+v.toFixed(1):v} <span style={{fontSize:10,color:P.roseMid}}>{unit}</span></p>
          </div>
        ))}
      </div>}
      {coreLine&&<div style={{background:P.roseLite,borderLeft:`2.5px solid ${P.roseDark}`,borderRadius:"0 8px 8px 0",padding:"8px 12px",marginBottom:8}}><p style={{fontSize:10,color:P.roseDeep,fontStyle:"italic",lineHeight:1.6}}>{coreLine}</p></div>}
      <button className="btnP" style={{marginTop:4}} onClick={()=>{close();setLogModal(true);}}>+ Log today's stats</button>
    </div></div>);
  };

  const ProgressModal=()=>{
    if(!progressModal)return null;
    const close=()=>setProgressModal(null);
    if(progressModal==="chart")return<ChartPanel close={close}/>;
    const milestones=getMilestones(data.sessions,data.bodyLog,data.profile);
    const weekAgo=Date.now()-7*86400000;
    const weekSess=data.sessions.filter(s=>new Date(s.date)>weekAgo);
    const totalSets=weekSess.reduce((a,s)=>a+Object.values(s.comp||{}).reduce((b,v)=>b+(v||0),0),0);
    const totalCal=weekSess.reduce((a,s)=>a+(s.calories||0),0);

    if(progressModal==="week"){
      const daysStr=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      return(<div className="mo" onClick={close}><div className="ms sl" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 className="serif" style={{fontSize:18,color:P.roseDeep}}>Last 7 days</h3>
          <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
        </div>
        <div style={{display:"flex",gap:7,marginBottom:14}}>
          {[[IcSessions,weekSess.length,"sessions"],[IcFire,`~${totalCal}`,"kcal"],[IcTrain,totalSets,"sets"]].map(([Ic,v,l])=>(
            <div key={l} style={{flex:1,background:P.roseLite,borderRadius:12,padding:"10px 4px",textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:2}}><Ic c={P.roseDark} s={14}/></div>
              <div className="mono" style={{fontSize:16,color:P.roseDark}}>{v}</div>
              <div style={{fontSize:8,color:P.roseMid,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>
        {weekSess.length>0?(<div style={{marginBottom:14}}>{weekSess.map((s,i)=>{
          const pl=SESSIONS.find(x=>x.id===s.sessionId);const d=new Date(s.date);const SIc=pl?SessIcon[pl.id]:null;
          return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${P.roseLite}`}}>
            <div style={{width:28,height:28,borderRadius:8,background:pl?pl.color+"22":P.roseLite,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{SIc&&<SIc c={pl.color} s={14}/>}</div>
            <div style={{flex:1}}>
              <p style={{fontSize:12,color:P.roseDeep,fontWeight:500}}>{pl?.name||s.tag}</p>
              <p style={{fontSize:9,color:P.roseMid}}>{daysStr[d.getDay()]} · {Math.round((s.duration||0)/60)} min · ~{s.calories} kcal</p>
            </div>
            <IcCheck c={P.roseDark} s={12}/>
          </div>);
        })}</div>):<p style={{fontSize:12,color:P.roseMid,fontStyle:"italic",marginBottom:14,lineHeight:1.6}}>No sessions in the last 7 days. Head to Today and pick one.</p>}
        {(()=>{const pr=getProteinHitRate(data.nutritionLog);return pr&&pr.total>0?(
          <div style={{background:pr.rate>=3/7?"#f1f8f1":P.roseLite,border:`1.5px solid ${pr.rate>=3/7?"#a5d6a7":P.rosePrimary}`,borderRadius:10,padding:"8px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <IcProtein c={pr.rate>=3/7?"#2e7d32":P.roseDark} s={13}/>
            <p style={{fontSize:10,color:pr.rate>=3/7?"#2e7d32":P.roseDeep,fontWeight:500}}>Protein hit <span className="mono" style={{fontWeight:600}}>{pr.hits}/{pr.total}</span> days this week{pr.rate>=3/7?" ✓":""}</p>
          </div>
        ):null;})()}
        <div style={{background:P.roseLite,borderLeft:`2.5px solid ${P.roseDark}`,borderRadius:"0 10px 10px 0",padding:"10px 12px"}}>
          <p style={{fontSize:10,color:P.roseDeep,fontStyle:"italic",lineHeight:1.6}}>{weekSess.length===3?"All 3 session types covered in 7 days. This is exactly the pace.":weekSess.length===2?"Two sessions done. One more for full coverage.":weekSess.length===1?"Good start. Two more sessions to go.":"Nothing logged yet in the last 7 days. No pressure — just show up once."}</p>
        </div>
      </div></div>);
    }

    if(progressModal==="strength"){
      const groups=[{name:"Glutes",color:P.rosePrimary,ids:["ht","rdl","kb","sm_w"]},{name:"Core & Waist",color:P.roseDark,ids:["cc","wc","hk","pp"]},{name:"Shape & Cardio",color:P.accent,ids:["sm","dk","iw"]}];
      return(<div className="mo" onClick={close}><div className="ms sl" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 className="serif" style={{fontSize:18,color:P.roseDeep}}>Strength progress</h3>
          <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
        </div>
        {groups.map(g=>(<div key={g.name} style={{marginBottom:14}}>
          <p style={{fontSize:8,letterSpacing:"0.18em",color:g.color,textTransform:"uppercase",fontWeight:500,marginBottom:6}}>{g.name}</p>
          {g.ids.map(id=>{
            const allEx=SESSIONS.flatMap(s=>s.exercises).find(e=>e.id===id);
            if(!allEx||allEx.bw)return null;
            const pr=getPR(allEx,data.sessions);
            const cur=getWeight(allEx,data.sessions);
            const hist=data.sessions.filter(s=>s.weights&&s.weights[id]!=null);
            if(!hist.length)return null;
            const isPR=typeof cur==="number"&&pr!=null&&cur>=pr;
            return(<div key={id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid ${P.roseLite}`}}>
              <div style={{flex:1}}><p style={{fontSize:11,color:P.roseDeep,fontWeight:500}}>{allEx.name}</p><p style={{fontSize:8,color:P.roseMid}}>{allEx.muscle}</p></div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <p className="mono" style={{fontSize:12,color:g.color}}>{typeof cur==="number"?`${cur} kg`:cur}{isPR?" ✦":""}</p>
                {pr&&<p style={{fontSize:8,color:P.roseMid}}>PR {pr} kg</p>}
              </div>
            </div>);
          })}
        </div>))}
        {!groups.flatMap(g=>g.ids).some(id=>data.sessions.some(s=>s.weights&&s.weights[id]!=null))&&
          <p style={{fontSize:12,color:P.roseMid,fontStyle:"italic",lineHeight:1.6,textAlign:"center",padding:"20px 0"}}>Complete your first session to see strength data here.</p>}
      </div></div>);
    }

    if(progressModal==="milestones"){
      const iconMap={weight:IcWeight,waist:IcWaist,fire:IcFire,trophy:IcTrophy,sessions:IcSessions,star:IcStar};
      return(<div className="mo" onClick={close}><div className="ms sl" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 className="serif" style={{fontSize:18,color:P.roseDeep}}>Milestones</h3>
          <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
        </div>
        {milestones.length>0?milestones.map(m=>{const Ic=iconMap[m.icon]||IcStar;return(
          <div key={m.id} style={{background:`linear-gradient(135deg,${P.roseLite},${P.white})`,border:`1.5px solid ${P.rosePrimary}`,borderRadius:12,padding:"10px 12px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{width:28,height:28,borderRadius:8,background:P.rosePrimary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic c="white" s={13}/></div>
            <div><p style={{fontSize:12,color:P.roseDeep,fontWeight:600,marginBottom:2}}>{m.title}</p><p style={{fontSize:10,color:P.roseMid,lineHeight:1.5}}>{m.sub}</p></div>
          </div>);})
        :<div style={{textAlign:"center",padding:"32px 20px"}}><IcSparkle c={P.rosePrimary} s={28}/>
          <p style={{fontSize:12,color:P.roseMid,lineHeight:1.65,marginTop:12}}>Milestones appear here as you train and log stats — every PR, every kg dropped, every cm off the waist.</p>
        </div>}
      </div></div>);
    }
    return null;
  };

  // ── ME MODALS — defined at App level so they never remount on data change ──
  const ProfileModal=()=>{
    const profile=data.profile||DEFAULT_PROFILE;
    const[nm,setNm]=useState(profile.name||"");
    const[sw,setSw]=useState((profile.startWeight??data.bodyLog[0]?.weight??"").toString());
    const[ss,setSs]=useState((profile.startWaist??data.bodyLog[0]?.waist??"").toString());
    const[af,setAf]=useState(null);
    const canSave=!!nm.trim();
    const save=()=>{
      if(!canSave)return;
      persist({...data,profile:{...profile,name:nm.trim(),...(sw&&{startWeight:parseFloat(sw)}),...(ss&&{startWaist:parseFloat(ss)})}});
      setMeModal(null);
    };
    return(<div className="mo" onClick={()=>setMeModal(null)}><div className="ms sl" onClick={e=>e.stopPropagation()}>
      <div style={{width:32,height:3,background:P.roseLite,borderRadius:2,margin:"0 auto 16px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <h3 className="serif" style={{fontSize:20,color:P.roseDeep,fontWeight:400}}>Edit profile</h3>
        <button onClick={()=>setMeModal(null)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
      </div>
      <p style={{fontSize:10,color:P.roseMid,fontStyle:"italic",marginBottom:18,lineHeight:1.5}}>Starting stats set your baseline for all progress calculations.</p>
      {/* Name field */}
      <div onClick={()=>setAf("name")} style={{background:af==="name"?P.white:P.bg,border:`1.5px solid ${af==="name"?P.roseDark:P.roseLite}`,borderRadius:14,padding:"12px 14px",marginBottom:10,cursor:"pointer",transition:"all 0.15s"}}>
        <p style={{fontSize:8,letterSpacing:"0.14em",color:af==="name"?P.roseDark:P.roseMid,textTransform:"uppercase",marginBottom:4}}>Name</p>
        {af==="name"
          ?<input autoFocus type="text" value={nm} onChange={e=>setNm(e.target.value)} style={{width:"100%",border:"none",background:"transparent",fontSize:20,fontFamily:"'Playfair Display',serif",color:P.roseDeep,outline:"none"}}/>
          :<p style={{fontSize:20,fontFamily:"'Playfair Display',serif",color:nm?P.roseDeep:P.roseMid}}>{nm||"—"}</p>}
      </div>
      {/* Starting stats */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["Start weight","kg",sw,setSw],["Start waist","cm",ss,setSs]].map(([label,unit,val,setVal])=>{
          const isAf=af===label;
          return(<div key={label} onClick={()=>setAf(label)} style={{flex:1,background:isAf?P.white:P.bg,border:`1.5px solid ${isAf?P.roseDark:P.roseLite}`,borderRadius:14,padding:"12px 8px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}>
            <p style={{fontSize:8,letterSpacing:"0.14em",color:isAf?P.roseDark:P.roseMid,textTransform:"uppercase",marginBottom:6}}>{label}</p>
            {isAf?<input autoFocus type="number" step="0.1" value={val} onChange={e=>setVal(e.target.value)} style={{width:"100%",border:"none",background:"transparent",textAlign:"center",fontSize:28,fontFamily:"'Tenor Sans',sans-serif",color:P.roseDeep,outline:"none"}}/>
              :<p className="mono" style={{fontSize:28,color:val?P.roseDeep:P.roseMid,lineHeight:1}}>{val||"—"}</p>}
            <p style={{fontSize:9,color:P.roseMid,marginTop:4}}>{unit}</p>
          </div>);
        })}
      </div>
      <button onClick={save} className="btnP" style={{opacity:canSave?1:0.4,cursor:canSave?"pointer":"not-allowed"}}>SAVE PROFILE</button>
    </div></div>);
  };

  const GoalModal=()=>{
    const profile=data.profile||DEFAULT_PROFILE;
    const[gw,setGw]=useState((profile.goalWeight??45).toString());
    const[gs,setGs]=useState((profile.goalWaist??63).toString());
    const[af,setAf]=useState(null);
    const inputRef=useRef(null);
    useEffect(()=>{if(inputRef.current)inputRef.current.focus();},[af]);
    const canSaveGoals=!!(gw&&parseFloat(gw)>0&&gs&&parseFloat(gs)>0);
    const save=()=>{if(!canSaveGoals)return;persist({...data,profile:{...profile,goalWeight:parseFloat(gw),goalWaist:parseFloat(gs)}});setMeModal(null);};
    return(<div className="mo" onClick={()=>setMeModal(null)}><div className="ms sl" onClick={e=>e.stopPropagation()}>
      <div style={{width:32,height:3,background:P.roseLite,borderRadius:2,margin:"0 auto 16px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <h3 className="serif" style={{fontSize:20,color:P.roseDeep,fontWeight:400}}>Edit goals</h3>
        <button onClick={()=>setMeModal(null)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
      </div>
      <p style={{fontSize:10,color:P.roseMid,fontStyle:"italic",marginBottom:18,lineHeight:1.5}}>Changes update your goal bars and ETA everywhere.</p>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["Goal weight","kg",gw,setGw],["Goal waist","cm",gs,setGs]].map(([label,unit,val,setVal])=>{
          const isAf=af===label;
          return(<div key={label} onClick={()=>setAf(label)} style={{flex:1,background:isAf?P.white:P.bg,border:`1.5px solid ${isAf?P.roseDark:P.roseLite}`,borderRadius:14,padding:"12px 8px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}>
            <p style={{fontSize:8,letterSpacing:"0.14em",color:isAf?P.roseDark:P.roseMid,textTransform:"uppercase",marginBottom:6}}>{label}</p>
            {isAf?<input ref={inputRef} type="number" step="0.5" value={val} onChange={e=>setVal(e.target.value)} style={{width:"100%",border:"none",background:"transparent",textAlign:"center",fontSize:28,fontFamily:"'Tenor Sans',sans-serif",color:P.roseDeep,outline:"none"}}/>
              :<p className="mono" style={{fontSize:28,color:val?P.roseDeep:P.roseMid,lineHeight:1}}>{val||"—"}</p>}
            <p style={{fontSize:9,color:P.roseMid,marginTop:4}}>{unit}</p>
          </div>);
        })}
      </div>
      <button onClick={save} className="btnP" style={{opacity:canSaveGoals?1:0.4,cursor:canSaveGoals?"pointer":"not-allowed"}}>SAVE GOALS</button>
    </div></div>);
  };

  const ResetModal=()=>(<div className="mo" onClick={()=>setMeModal(null)}><div className="ms sl" onClick={e=>e.stopPropagation()}>
    <div style={{width:32,height:3,background:P.roseLite,borderRadius:2,margin:"0 auto 16px"}}/>
    <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><div style={{width:44,height:44,borderRadius:14,background:P.roseLite,display:"flex",alignItems:"center",justifyContent:"center"}}><IcRefresh c={P.roseDark} s={20}/></div></div>
    <h3 className="serif" style={{fontSize:20,color:P.roseDeep,fontWeight:400,textAlign:"center",marginBottom:6}}>Reset weights?</h3>
    <p style={{fontSize:11,color:P.roseMid,lineHeight:1.65,textAlign:"center",marginBottom:22}}>Resets all exercise weights to starting values. Session history, body stats and milestones are kept.</p>
    <button onClick={()=>{persist({...data,sessions:data.sessions.map(s=>({...s,weights:{},comp:{}}))});setMeModal(null);}} style={{background:P.roseDark,color:"white",border:"none",borderRadius:40,padding:"14px",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans'",width:"100%",marginBottom:10,letterSpacing:"0.06em"}}>YES, RESET WEIGHTS</button>
    <button onClick={()=>setMeModal(null)} className="btnG" style={{width:"100%"}}>CANCEL</button>
  </div></div>);

  const ClearModal=()=>{
    const[step,setStep]=useState(1);
    return(<div className="mo" onClick={()=>setMeModal(null)}><div className="ms sl" onClick={e=>e.stopPropagation()}>
      <div style={{width:32,height:3,background:P.roseLite,borderRadius:2,margin:"0 auto 16px"}}/>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><div style={{width:44,height:44,borderRadius:14,background:"#fff0f2",border:"1.5px solid #ffc8cd",display:"flex",alignItems:"center",justifyContent:"center"}}><IcTrash c="#c0392b" s={20}/></div></div>
      <h3 className="serif" style={{fontSize:20,color:P.roseDeep,fontWeight:400,textAlign:"center",marginBottom:6}}>{step===1?"Clear all data?":"Are you sure?"}</h3>
      <p style={{fontSize:11,color:P.roseMid,lineHeight:1.65,textAlign:"center",marginBottom:22}}>{step===1?"Permanently deletes all sessions, body logs and progress. Cannot be undone.":"This is your final confirmation. Everything will be erased."}</p>
      {step===1
        ?<button onClick={()=>setStep(2)} style={{background:"#c0392b",color:"white",border:"none",borderRadius:40,padding:"14px",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans'",width:"100%",marginBottom:10,letterSpacing:"0.06em"}}>I UNDERSTAND — CLEAR DATA</button>
        :<button onClick={()=>{persist({sessions:[],bodyLog:[],profile:{...DEFAULT_PROFILE},nutritionLog:[]});setMeModal(null);}} style={{background:"#c0392b",color:"white",border:"none",borderRadius:40,padding:"14px",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans'",width:"100%",marginBottom:10,letterSpacing:"0.06em"}}>YES, DELETE EVERYTHING</button>}
      <button onClick={()=>setMeModal(null)} className="btnG" style={{width:"100%"}}>CANCEL</button>
    </div></div>);
  };

  // ── ME SCREEN ─────────────────────────────────────────────────────────────
  const Me=()=>{
    const profile=data.profile||DEFAULT_PROFILE;
    const last=data.bodyLog.length?data.bodyLog[data.bodyLog.length-1]:null;
    const bf=last?.bodyFat??null;

    return(<>
      <div className="screen-full" style={{background:P.roseDeep}}>

        {/* HEADER — identical dimensions to Today + Stats */}
        <div style={{padding:"100px 20px 40px",position:"relative",overflow:"hidden",flexShrink:0}}>
          <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,background:"radial-gradient(circle,rgba(242,160,176,0.22),transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
          <p style={{fontSize:9,letterSpacing:"0.28em",color:P.roseMid,textTransform:"uppercase",marginBottom:8}}>Your profile</p>
          <div onClick={()=>setMeModal("profile")} style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,cursor:"pointer"}}>
            <h1 className="serif" style={{fontSize:26,color:"white",fontWeight:400,lineHeight:1.2}}>{profile.name}</h1>
            <IcEdit c={P.roseMid} s={14}/>
          </div>
          <div style={{display:"flex",gap:7}}>
            {[["Sessions",`${data.sessions.length}`],["Last 7 days",`${thisWeekSess.length}/3`],(()=>{const pr=getProteinHitRate(data.nutritionLog);return["Protein",pr?`${pr.hits}/${pr.total}`:"—"];})()].map(([l,v])=>(
              <div key={l} style={{flex:1,background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <span className="mono" style={{fontSize:14,color:"white",lineHeight:1.1}}>{v}</span>
                <span style={{fontSize:9,color:P.roseMid,letterSpacing:"0.04em"}}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANELS — same system as Stats: flexShrink:0 per panel, 20px breathing top/bottom */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:10,padding:"20px 14px 20px",overflow:"hidden",minHeight:0,background:P.roseLite}}>

          {/* PANEL 1 — Goals */}
          <div onClick={()=>setMeModal("goals")} style={{background:P.white,borderRadius:14,padding:"14px 20px",cursor:"pointer",boxShadow:"0 2px 12px rgba(212,120,138,0.09)",flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:9,borderBottom:`1px solid ${P.roseLite}`,marginBottom:12}}>
              <p style={{fontSize:10,letterSpacing:"0.2em",color:P.roseMid,textTransform:"uppercase",fontWeight:500}}>Goals</p>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <IcEdit c={P.roseMid} s={12}/>
                <span style={{fontSize:10,color:P.roseMid}}>tap to edit</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[["Goal weight",`${profile.goalWeight??45} kg`,IcWeight],["Goal waist",`${profile.goalWaist??63} cm`,IcWaist],["Body fat",bf?`${bf}%`:"—",IcFire]].map(([label,val,Ic])=>(
                <div key={label} style={{flex:1,textAlign:"center",background:P.bg,borderRadius:10,padding:"10px 4px"}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><Ic c={P.roseDark} s={15}/></div>
                  <p className="mono" style={{fontSize:17,color:P.roseDark,lineHeight:1}}>{val}</p>
                  <p style={{fontSize:9,color:P.roseMid,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:3}}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL 2 — Programme */}
          <div style={{background:P.white,borderRadius:14,padding:"14px 20px",boxShadow:"0 2px 12px rgba(212,120,138,0.09)",flexShrink:0}}>
            <div style={{paddingBottom:9,borderBottom:`1px solid ${P.roseLite}`,marginBottom:12}}>
              <p style={{fontSize:10,letterSpacing:"0.2em",color:P.roseMid,textTransform:"uppercase",fontWeight:500}}>Programme</p>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {SESSIONS.map(s=>{const Ic=SessIcon[s.id];return(
                <div key={s.id} style={{flex:1,borderRadius:10,padding:"9px 4px",textAlign:"center",border:`1.5px solid ${s.color}22`,background:`${s.color}11`}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:3}}><Ic c={s.color} s={16}/></div>
                  <p style={{fontSize:9,color:s.color,fontWeight:500}}>{s.tag}</p>
                </div>
              );})}
            </div>
            <div style={{display:"flex",gap:8}}>
              {[[`${SESSIONS.flatMap(s=>s.exercises).length} exercises`,"auto-progression"],["No fixed days","train when ready"],[`${SESSIONS.length} sessions`,"full coverage"]].map(([val,sub])=>(
                <div key={val} style={{flex:1}}>
                  <p style={{fontSize:13,color:P.roseDeep,fontWeight:500,lineHeight:1.2}}>{val}</p>
                  <p style={{fontSize:11,color:P.roseMid,lineHeight:1.4,marginTop:2}}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL 3 — Data */}
          <div style={{background:P.white,borderRadius:14,padding:"14px 20px",boxShadow:"0 2px 12px rgba(212,120,138,0.09)",flexShrink:0}}>
            <div style={{paddingBottom:9,borderBottom:`1px solid ${P.roseLite}`,marginBottom:12}}>
              <p style={{fontSize:10,letterSpacing:"0.2em",color:P.roseMid,textTransform:"uppercase",fontWeight:500}}>Data</p>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setMeModal("resetWeights")} style={{flex:1,background:P.roseLite,border:`1px solid ${P.rosePrimary}`,borderRadius:12,padding:"12px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <IcRefresh c={P.roseDark} s={16}/>
                <p style={{fontSize:12,color:P.roseDeep,fontWeight:500,textAlign:"center",lineHeight:1.3}}>Reset weights</p>
                <p style={{fontSize:11,color:P.roseMid,textAlign:"center",lineHeight:1.3}}>after a long break</p>
              </button>
              <button onClick={()=>setMeModal("clearData")} style={{flex:1,background:"#f0f7f4",border:"1px solid #a8d4c2",borderRadius:12,padding:"12px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <IcTrash c="#1e6b50" s={16}/>
                <p style={{fontSize:12,color:"#1e6b50",fontWeight:500,textAlign:"center",lineHeight:1.3}}>Clear all data</p>
                <p style={{fontSize:11,color:"#2d9970",textAlign:"center",lineHeight:1.3}}>start fresh</p>
              </button>
            </div>
          </div>

          {/* PANEL 4 — App info */}
          <div style={{background:P.white,borderRadius:14,padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 12px rgba(212,120,138,0.09)",flexShrink:0}}>
            <p style={{fontSize:10,color:P.roseMid,letterSpacing:"0.04em"}}>v1.0 · May 2026</p>
            <p style={{fontSize:10,color:P.roseMid,fontStyle:"italic"}}>Built with care for {profile.name}</p>
          </div>

        </div>
      </div>
    </>);
  };

  // ── PLAN MODAL ────────────────────────────────────────────────────────────
  const PlanModal=()=>{
    if(!planModal)return null;
    const pl=planModal;
    const SIcon=SessIcon[pl.id];
    const lastDone=data.sessions.filter(s=>s.sessionId===pl.id).slice(-1)[0];
    const ds=lastDone?Math.floor((Date.now()-new Date(lastDone.date))/86400000):0;
    return(<div className="mo" onClick={()=>setPlanModal(null)}>
      <div className="ms sl" onClick={e=>e.stopPropagation()} style={{maxHeight:"88dvh"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:`${pl.color}22`,border:`1px solid ${pl.color}44`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <SIcon c={pl.color} s={15}/>
            </div>
            <h3 className="serif" style={{fontSize:18,color:P.roseDeep,fontWeight:600}}>{pl.name}</h3>
          </div>
          <button onClick={()=>setPlanModal(null)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><IcClose c={P.roseMid} s={18}/></button>
        </div>
        <p style={{fontSize:10,color:P.roseMid,marginBottom:14}}>{pl.exercises.length} ex · ~{pl.duration} min · ~{kcal(pl.met,pl.duration)} kcal</p>
        {/* Exercise list */}
        {ds>14&&<div style={{background:"#fff8ec",border:"1.5px solid #f5d08a",borderRadius:10,padding:"9px 13px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13}}>⚠️</span>
          <p style={{fontSize:11,color:"#7a5c00",lineHeight:1.5}}>You were away {ds} days — weights reduced 10% to ease you back in. They'll climb again from here.</p>
        </div>}
        <div style={{background:P.bg,borderRadius:12,overflow:"hidden",marginBottom:14}}>
          {pl.exercises.map((ex,i)=>{
            const cw=getWeight(ex,data.sessions,pl.id);
            const pr=getPR(ex,data.sessions);
            const isUp=!ex.bw&&typeof cw==="number"&&(!pr||cw>pr);
            // isDown: detect if this specific exercise had a 14+ day gap (getWeight handles reduction internally)
            const exLastDone=data.sessions.filter(s=>s.weights&&s.weights[ex.id]!==undefined).slice(-1)[0];
            const exDaysSince=exLastDone?Math.floor((Date.now()-new Date(exLastDone.date))/86400000):0;
            const isDown=exDaysSince>14&&!ex.bw&&typeof cw==="number";
            return(<div key={ex.id} style={{display:"flex",alignItems:"center",padding:"9px 14px",borderBottom:i<pl.exercises.length-1?`1px solid ${P.roseLite}`:"none",gap:8}}>
              <span style={{fontSize:10,color:P.roseMid,fontFamily:"'Tenor Sans'",minWidth:14,textAlign:"right"}}>{i+1}</span>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:12,color:P.roseDeep,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ex.name}</p>
                <p style={{fontSize:9,color:P.roseMid}}>{ex.muscle}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <p className="mono" style={{fontSize:11,color:P.roseDark}}>{ex.sets}×{ex.reps}</p>
                <p style={{fontSize:10,color:isUp?P.roseDark:isDown?"#b07d00":P.roseMid,fontWeight:isUp||isDown?600:400}}>{ex.bw?"BW":`${cw}kg`}{isUp?" ↑":isDown?" ↓":""}</p>
              </div>
            </div>);
          })}
        </div>
        <button onClick={()=>{setPlanModal(null);startSession(pl);}} className="btnP" style={{fontSize:12,padding:"12px"}}>START {pl.name.toUpperCase()} →</button>
      </div>
    </div>);
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return(<>
    <style>{CSS}</style>
    <div className="app">
      {tab==="today"&&<Today/>}
      {tab==="progress"&&<Progress/>}
      {tab==="me"&&<Me/>}
      {modal&&<Modal/>}
      {swapModal&&<SwapModal/>}
      {logModal&&<LogModal/>}
      {progressModal&&<ProgressModal/>}
      {meModal==="profile"&&<ProfileModal/>}
      {meModal==="goals"&&<GoalModal/>}
      {meModal==="resetWeights"&&<ResetModal/>}
      {meModal==="clearData"&&<ClearModal/>}
      {planModal&&<PlanModal/>}
      <nav className="nav">
        <div className="nav-icons">
        {[["today",IcHome,"Today"],["progress",IcStats,"Stats"],["me",IcMe,"Me"]].map(([t,Ic,lb])=>(
          <button key={t} className="nb" onClick={()=>{
            // If session active and navigating away — protect data
            if(active&&sess&&t!=="today"){
              if(doneSets>0){
                const choice=window.confirm(`You've done ${doneSets} set${doneSets!==1?"s":""} — save progress before leaving?`);
                if(choice){
                  saveSession();
                  stopTimer();if(restRafRef.current){cancelAnimationFrame(restRafRef.current);restRafRef.current=null;}
                  startTimeRef.current=null;finishingRef.current=false;setActive(null);setSess(null);setElapsed(0);setRest(null);setSummary(null);
                } else {
                  stopTimer();if(restRafRef.current){cancelAnimationFrame(restRafRef.current);restRafRef.current=null;}
                  startTimeRef.current=null;finishingRef.current=false;setActive(null);setSess(null);setElapsed(0);setRest(null);
                }
              } else {
                stopTimer();if(restRafRef.current){cancelAnimationFrame(restRafRef.current);restRafRef.current=null;}
                startTimeRef.current=null;finishingRef.current=false;setActive(null);setSess(null);setElapsed(0);setRest(null);
              }
            }
            setTab(t);setLogModal(false);setProgressModal(null);setMeModal(null);
          }}>
            <div style={{width:32,height:32,borderRadius:9,background:tab===t?P.roseLite:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.18s"}}>
              <Ic c={tab===t?P.roseDark:P.roseMid} s={20}/>
            </div>
            <span style={{fontSize:8,letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:tab===t?600:400,color:tab===t?P.roseDark:P.roseMid,fontFamily:"'DM Sans'"}}>{lb}</span>
          </button>
        ))}
        </div>
        <div className="nav-safe"/>
      </nav>
    </div>
  </>);
}
