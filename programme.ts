import { P } from "./theme";

// ── PROGRAMME ─────────────────────────────────────────────────────────────────
// Week: Wednesday Glutes A + Friday Glutes B are the fixed main days.
//       Monday Glutes C is an optional gym day. Home is flexible: instead of the Monday gym, or Tue/Thu
//       (after a Monday gym session → Thursday). Which one is suggested when: engine.suggestSession.
// Starting weights + progression rules: PROGRESSION.md · Editing the plan in the app: PlanModal/ExerciseForm in App.tsx
//
// Exercise fields
//   group      section in the plan: Warm-up, Glutes, Core, Back, Shoulders
//   kg         starting weight · bar: barbell (kg) → per-side plate load shown next to the total
//   per        "hand"/"arm" → weight is per hand/arm · note: how a single weight is held ("one hand")
//   equip      equipment for bodyweight moves (shown instead of "BW")
//   step/freq  progression step and sessions needed at a weight (engine.getWeight)
// Each session has its own exercise ids, so every day progresses on its own.

// ── SHARED EXERCISES (the same movement in more than one session) ───────────
const T={
  crossTrainer:{name:"Cross Trainer",group:"Warm-up",muscle:"Warm-up",sets:1,reps:"10–15 min",kg:4,step:1,freq:0,bw:false,rest:0,anim:"cd",unit:"level",
    tip:"Warm-up, not cardio — you should be able to talk. Raise the level yourself only if it feels too easy.",cue:"Push and pull the handles. Steady pace, upright posture.",start:"Level 4. Feet flat on the pedals, hands on the moving handles.",dont:"Don't turn this into a workout — save your energy for the glute work.",
    swaps:[{name:"Incline Treadmill Walk",note:"6% incline, easy pace"},{name:"Bike",note:"Easy resistance, 10 min"},{name:"Stairmaster (easy)",note:"Low level, 8–10 min"}]},
  backExtWarmup:{name:"Back Extension (warm-up)",group:"Warm-up",muscle:"Lower Back + Glutes — Warm-up",sets:2,reps:"12–15",kg:0,step:0,freq:0,bw:true,equip:"Bodyweight",rest:45,anim:"be",
    tip:"Easy and controlled — wakes up glutes and lower back before the heavy work.",cue:"Lower slowly. Come up squeezing glutes to a straight line.",start:"Hips on 45° pad, feet locked, arms crossed on chest.",dont:"Don't hyperextend at the top — straight line is enough.",
    swaps:[{name:"Glute Bridge (BW)",note:"Floor, same warm-up purpose"},{name:"Bird Dog",note:"All fours, gentle"},{name:"Good Morning (BW)",note:"Standing hip hinge"}]},
  gluteExt:{name:"Glute Extension (45°)",group:"Glutes",muscle:"Glutes + Hamstrings",sets:3,reps:"12–15",kg:5,step:2.5,freq:3,bw:false,rest:60,anim:"be",
    tip:"Round your upper back and point toes out — the glutes do the lifting, not the lower back.",cue:"Hug the plate. Lower slowly. Drive hips into the pad and squeeze glutes to come up.",start:"Hips just above the 45° pad edge, feet locked, plate held to chest.",dont:"Don't hyperextend at the top — stop when body is in a straight line.",
    swaps:[{name:"Back Extension (BW)",note:"Same bench, no plate"},{name:"Reverse Hyper",note:"Legs move instead of torso"},{name:"Single-Leg Glute Bridge",note:"Floor, no equipment"}]},
  kickback:{name:"Cable Kickback",group:"Glutes",muscle:"Glute Peak",sets:3,reps:"12–15/leg",kg:7.5,step:2.5,freq:4,bw:false,rest:60,anim:"kb",
    tip:"Lean slightly forward on the machine — isolates the glute peak perfectly.",cue:"Leg straight. Kick back and up. Squeeze hard 1 second at the top.",start:"Face cable machine, ankle cuff attached, slight lean forward on handles.",dont:"Don't swing or use momentum. Slow and controlled gets the burn.",
    swaps:[{name:"Resistance Band Kickback",note:"Band around ankle — no machine needed"},{name:"Donkey Kick on Mat",note:"Bodyweight, same movement pattern"},{name:"Machine Glute Kickback",note:"If gym has dedicated machine"}]},
  abCrunch:{name:"Abdominal Crunch Machine",group:"Core",muscle:"Upper Abs",sets:3,reps:"12–15",kg:20,step:2.5,freq:3,bw:false,rest:60,anim:"cc",
    tip:"Curl your ribs toward your hips — round the spine, don't just bend at the hips.",cue:"Exhale and crunch. Squeeze 1 sec. Control the way back.",start:"Seat set so the pads sit on your chest/shoulders, feet hooked.",dont:"Don't pull with your arms or use momentum.",
    swaps:[{name:"Cable Crunch (Kneeling)",note:"Rope on cable"},{name:"Crunch on Mat",note:"No machine"},{name:"Decline Crunch",note:"Bench set to decline"}]},
  captainsChair:{name:"Captain's Chair Knee Raise",group:"Core",muscle:"Lower Abs",sets:3,reps:"10–12",kg:0,step:0,freq:0,bw:true,equip:"Bodyweight",rest:60,anim:"hk",
    tip:"Curl your PELVIS up at the top — that's what works the lower belly.",cue:"Press forearms into the pads. Bring knees to chest curling the pelvis. Lower slowly.",start:"Forearms on the pads, back against the backrest, legs hanging.",dont:"Don't swing the legs — the pelvic curl at the top is the key movement.",
    swaps:[{name:"Hanging Knee Raise",note:"From a bar — harder grip"},{name:"Lying Leg Raise",note:"On mat — no machine"},{name:"Reverse Crunch",note:"Floor, same lower-belly focus"}]},
  russianTwist:{name:"Dumbbell Russian Twist",group:"Core",muscle:"Obliques — Waist",sets:3,reps:"10–12/side",kg:4,note:"both hands",step:1,freq:3,bw:false,rest:45,anim:"wc",
    tip:"Turn from your ribs, not just your arms — the dumbbell follows your chest.",cue:"Lean back to about 45°, chest up. Turn the dumbbell to one hip, then the other. Each side counts as one rep.",start:"Sit on the mat, knees bent, heels on the floor (lift them for harder). Hold one dumbbell with both hands at your chest.",dont:"Don't round your lower back or swing the weight — slow and controlled.",
    swaps:[{name:"Russian Twist (bodyweight)",note:"No weight, hands together"},{name:"Cable Woodchop",note:"Standing rotation on the cable"},{name:"Bicycle Crunch",note:"On the mat, no equipment"}]},
  plank:{name:"Plank",group:"Core",muscle:"Full Core",sets:2,reps:"30–45 sec",kg:0,step:0,freq:0,bw:true,equip:"Bodyweight",rest:45,anim:"pl",
    tip:"Start at 30 seconds. When 2 × 45 sec feels solid, hold longer or lift one foot.",cue:"Squeeze glutes, pull belly button in, push the floor away.",start:"Forearms under shoulders, body in one straight line from head to heels.",dont:"Don't let the hips sag or pike up. Quality over time.",
    swaps:[{name:"Knee Plank",note:"Easier — knees down"},{name:"Dead Bug",note:"Floor, lower-back friendly"},{name:"Bear Hold",note:"Knees just off the floor"}]},
};
const ex=(id,base,extra={})=>({id,...base,...extra});
const warmUp=sfx=>[ex(`ct_${sfx}`,T.crossTrainer),ex(`bx_${sfx}`,T.backExtWarmup)];

// Home: rest 30–45 sec between sets
const HOME_REST=40;
const home=(id,o)=>({id,kg:0,step:0,freq:0,bw:true,rest:HOME_REST,...o});

// The built-in plan. The plan in use (SESSIONS below) is the saved copy, which can be edited in the app
// and is synced to Supabase; "Restore default plan" goes back to this one.
export const DEFAULT_SESSIONS=[
  // ── MONDAY · optional gym ──────────────────────────────────────────────────
  {id:"glutes_c",day:"Monday · optional",short:"Mon",cell:"C",optional:true,name:"Glutes C + Core + Back + Shoulders",tag:"MON · OPTIONAL",info:"Optional gym day. No time? Do the home workout instead.",color:P.roseDark,duration:60,met:4.0,
   exercises:[
    ...warmUp("c"),
    ex("ge_c",T.gluteExt),
    {id:"slht",name:"Single-Leg Hip Thrust",group:"Glutes",muscle:"Glutes — One Side at a Time",sets:3,reps:"10–12/leg",kg:10,note:"1 dumbbell",step:2,freq:3,bw:false,rest:75,anim:"ht",
     tip:"Start with your weaker side and match its reps on the other — evens out your shape.",cue:"Drive through the heel of the working leg. Hips stay level. Squeeze 1 second at the top.",start:"Upper back on the bench, dumbbell on the working hip, other knee pulled in or foot hovering.",dont:"Don't let the free side of the hip drop or twist.",
     swaps:[{name:"Single-Leg Glute Bridge",note:"Floor, no bench"},{name:"B-Stance Hip Thrust",note:"Other foot lightly supports"},{name:"Barbell Hip Thrust",note:"Both legs"}]},
    {id:"slrdl",name:"Single-Leg Romanian Deadlift",group:"Glutes",muscle:"Glutes + Hamstrings — Balance",sets:3,reps:"10/leg",kg:10,note:"one hand",step:2,freq:3,bw:false,rest:75,anim:"rdl",
     tip:"Hold the dumbbell in the hand opposite the standing leg — more glute, better balance.",cue:"Hinge forward while the free leg reaches back. Hips square to the floor. Drive the hip forward to stand.",start:"Stand on one leg, soft knee, dumbbell in the opposite hand. Touch a bench or rack lightly for balance if needed.",dont:"Don't open the hip toward the ceiling or round your back to get lower.",
     swaps:[{name:"Kickstand RDL",note:"Back toes touch the floor for balance"},{name:"Dumbbell RDL",note:"Both legs"},{name:"Single-Leg RDL (BW)",note:"No weight, balance first"}]},
    ex("rt_c",T.russianTwist),
    ex("kr_c",T.captainsChair),
    {id:"dbr",name:"One-Arm Dumbbell Row",group:"Back",muscle:"Back — Lats + Mid-Back",sets:3,reps:"10–12/arm",kg:10,per:"arm",step:2,freq:3,bw:false,rest:60,anim:"row",
     tip:"Pull the elbow toward your hip, not straight up — that's where the lats work.",cue:"Flat back. Row the dumbbell to your hip. Pause 1 second. Lower all the way.",start:"One knee and hand on a bench, other foot on the floor, dumbbell hanging under the shoulder.",dont:"Don't twist your torso open to lift the weight.",
     swaps:[{name:"Seated Row Machine",note:"Both arms, machine"},{name:"Single-Arm Cable Row",note:"Cable, constant tension"},{name:"Chest-Supported Dumbbell Row",note:"Incline bench, no lower-back load"}]},
    {id:"rf",name:"Seated Reverse Fly",group:"Back",muscle:"Rear Shoulders + Upper Back",sets:3,reps:"12–15",kg:3,per:"hand",step:1,freq:4,bw:false,rest:45,anim:"lr",
     tip:"Light and slow — this is posture work for the upper back and rear shoulders.",cue:"Chest toward thighs. Open the arms wide like wings, slight elbow bend. Squeeze shoulder blades. Lower slowly.",start:"Sit at the end of a bench, lean forward with chest toward thighs, dumbbells hanging under you.",dont:"Don't swing up or shrug — if you need momentum, go lighter.",
     swaps:[{name:"Reverse Pec Deck",note:"Machine version"},{name:"Cable Reverse Fly",note:"Cables crossed, constant tension"},{name:"Band Pull-Apart",note:"Band, standing"}]},
    {id:"lr",name:"Dumbbell Lateral Raise",group:"Shoulders",muscle:"Shoulders — Side",sets:2,reps:"12–15",kg:2,per:"hand",step:1,freq:4,bw:false,rest:45,anim:"lr",
     tip:"Light weight, strict form — rounder shoulders make the waist look smaller.",cue:"Slight bend in elbows. Raise to shoulder height. Lower in 2 seconds.",start:"Stand tall, a dumbbell in each hand at your sides, palms in.",dont:"Don't swing or shrug — if you have to, the weight is too heavy.",
     swaps:[{name:"Cable Lateral Raise",note:"One arm, constant tension"},{name:"Machine Lateral Raise",note:"If available"},{name:"Band Lateral Raise",note:"Stand on the band"}]},
  ]},

  // ── WEDNESDAY · main ───────────────────────────────────────────────────────
  {id:"glutes",day:"Wednesday",short:"Wed",cell:"A",name:"Glutes A + Core + Back",tag:"WED · MAIN",info:"Fixed main day — the heaviest hip thrusts of the week.",color:P.rosePrimary,duration:65,met:4.5,
   exercises:[
    ...warmUp("a"),
    {id:"ht_a",name:"Barbell Hip Thrust",group:"Glutes",muscle:"Glutes — Primary",sets:4,reps:"8–12",kg:60,bar:20,step:5,freq:3,bw:false,rest:120,anim:"ht",
     tip:"Lean upper back into bench — keeps tension on glutes, not lower back.",cue:"Drive heels into floor. Thrust hips to ceiling. Squeeze 1 full second at top.",start:"Upper back on bench, barbell above hip crease, feet flat shoulder-width.",dont:"Don't hyperextend lower back at the top. Stop just before full extension.",
     swaps:[{name:"Smith Machine Hip Thrust",note:"Bar is guided — go heavier safely"},{name:"Dumbbell Hip Thrust",note:"Lighter load, same glute pattern"},{name:"Glute Bridge (BW + Band)",note:"No equipment — band above knees"}]},
    {id:"rdl_db",name:"Dumbbell Romanian Deadlift",group:"Glutes",muscle:"Glutes + Hamstrings",sets:3,reps:"10–12",kg:10,per:"hand",step:2,freq:3,bw:false,rest:90,anim:"rdl",
     tip:"Push hips BACK — this is a hinge, not a squat. Feel the glute stretch.",cue:"Soft knees, hinge at hips, dumbbells close to legs. Drive hips forward to stand.",start:"Stand hip-width, a dumbbell in each hand in front of thighs, slight knee bend.",dont:"Don't round your lower back. Keep chest up throughout.",
     swaps:[{name:"Barbell RDL",note:"Same hinge, one bar"},{name:"Single-Leg RDL",note:"One dumbbell, balance focus"},{name:"Cable Pull-Through",note:"Cable machine, great glute stretch"}]},
    {id:"bss",name:"Bulgarian Split Squat",group:"Glutes",muscle:"Glutes + Quads",sets:3,reps:"8–10/leg",kg:10,per:"hand",step:2,freq:3,bw:false,rest:90,anim:"cd",
     tip:"Lean your torso slightly forward — shifts the work from quads to glutes.",cue:"Lower straight down until back knee nearly touches. Drive up through the front heel.",start:"Back foot laces-down on a bench, front foot a long step ahead, a dumbbell in each hand.",dont:"Don't let the front knee cave inward. Keep it tracking over the toes.",
     swaps:[{name:"Reverse Lunge",note:"Dumbbells, easier balance"},{name:"Step-Up",note:"Bench or box, glute-focused"},{name:"Split Squat (BW)",note:"Both feet on floor, no load"}]},
    ex("kb_a",T.kickback),
    ex("abm",T.abCrunch),
    ex("kr_a",T.captainsChair),
    ex("pl_a",T.plank),
    {id:"lp",name:"Lat Pulldown",group:"Back",muscle:"Back — Width",sets:3,reps:"10–12",kg:25,step:2.5,freq:3,bw:false,rest:75,anim:"lp",
     tip:"Think elbows down to your back pockets — that's the lats, not the arms.",cue:"Chest up, slight lean back. Pull bar to upper chest. Control it up.",start:"Thighs locked under the pad, hands just wider than shoulders.",dont:"Don't pull behind your neck or swing your body to move the weight.",
     swaps:[{name:"Assisted Pull-Up Machine",note:"Same movement, vertical pull"},{name:"Single-Arm Cable Pulldown",note:"One side at a time"},{name:"Band Pulldown",note:"Band anchored high"}]},
  ]},

  // ── FRIDAY · main ──────────────────────────────────────────────────────────
  {id:"shape",day:"Friday",short:"Fri",cell:"B",name:"Glutes B + Core + Back",tag:"FRI · MAIN",info:"Fixed main day.",color:P.accent,duration:60,met:4.4,
   exercises:[
    ...warmUp("b"),
    {id:"ht_b",name:"Barbell Hip Thrust",group:"Glutes",muscle:"Glutes — Primary",sets:3,reps:"10–12",kg:50,bar:20,step:5,freq:3,bw:false,rest:90,anim:"ht",
     tip:"Lighter than Wednesday — chase a harder squeeze, not more weight.",cue:"Full extension. 2-second squeeze at top every single rep.",start:"Upper back on bench, barbell above hip crease, feet flat shoulder-width.",dont:"Don't hyperextend lower back at the top. Stop just before full extension.",
     swaps:[{name:"Smith Machine Hip Thrust",note:"Bar is guided — same movement"},{name:"Dumbbell Hip Thrust",note:"Dumbbells each side of hips"},{name:"Single-Leg Hip Thrust",note:"Bodyweight, one leg at a time"}]},
    ex("ge",T.gluteExt),
    ex("kb_b",T.kickback),
    {id:"abd",name:"Hip Abduction Machine",group:"Glutes",muscle:"Upper / Side Glutes",sets:3,reps:"15–20",kg:45,step:5,freq:3,bw:false,rest:60,anim:"fp",
     tip:"Lean your torso forward slightly — hits the upper glute shelf more.",cue:"Push knees out. Pause 1 second at the widest point. Slow on the way back.",start:"Seated, pads on outside of knees, back against the seat or leaning forward.",dont:"Don't let the stack slam between reps — keep tension the whole set.",
     swaps:[{name:"Banded Hip Abduction",note:"Seated, band above knees"},{name:"Side-Lying Leg Raise",note:"Floor, bodyweight"},{name:"Lateral Band Walk",note:"Band above knees, side steps"}]},
    ex("abm_b",T.abCrunch),
    ex("rt_b",T.russianTwist),
    ex("pl_b",T.plank),
    {id:"row",name:"Seated Row Machine",group:"Back",muscle:"Back — Posture",sets:3,reps:"10–12",kg:25,step:2.5,freq:3,bw:false,rest:75,anim:"row",
     tip:"Squeeze your shoulder blades together at the back — better posture, better shape.",cue:"Sit tall. Pull handles to your belly. Pause 1 sec. Slow return.",start:"Chest against the pad (or tall seated), arms long, shoulders down.",dont:"Don't shrug or lean back to finish the rep.",
     swaps:[{name:"Seated Cable Row",note:"Same pull, cable"},{name:"Dumbbell Row",note:"One arm, bench support"},{name:"Band Row",note:"Band anchored at chest height"}]},
  ]},

  // ── HOME · flexible (instead of the Monday gym, or Tue/Thu) ────────────────
  {id:"home",day:"Flexible · Tue/Thu",short:"Home",cell:"H",flexible:true,name:"Home Workout",tag:"HOME · FLEXIBLE",info:"Instead of the Monday gym, or on Tuesday/Thursday — Thursday if you went to the gym on Monday. Rest 30–45 sec between sets.",color:P.roseDeep,duration:30,met:3.5,
   exercises:[
    home("h_gb",{name:"Glute Bridge (2-sec squeeze)",group:"Glutes",muscle:"Glutes",sets:3,reps:"20",equip:"Band above knees",anim:"fp",
     tip:"Push the knees out against the band the whole time — that's what lights up the side glutes.",cue:"Drive heels down, lift the hips, squeeze 2 full seconds at the top. Lower with control.",start:"Lie on your back, knees bent, feet flat hip-width, band just above the knees.",dont:"Don't arch your lower back to get higher — the lift comes from the glutes.",
     swaps:[{name:"Single-Leg Glute Bridge",note:"Harder, one side at a time"},{name:"Frog Pump",note:"Soles together, knees out"},{name:"Hip Thrust off the Sofa",note:"Upper back on the sofa, more range"}]}),
    home("h_dk",{name:"Donkey Kick",group:"Glutes",muscle:"Glute Peak",sets:3,reps:"15/leg",equip:"Band + ankle weights",anim:"kb",
     tip:"Keep the knee bent at 90° and push the sole of the foot toward the ceiling.",cue:"Kick up until the thigh is level with your back. Squeeze 1 second. Lower slowly.",start:"On all fours, hands under shoulders, knees under hips, band and ankle weights on.",dont:"Don't arch the lower back or swing the leg — the hips stay square.",
     swaps:[{name:"Straight-Leg Kickback",note:"Leg long, same squeeze"},{name:"Donkey Kick (BW)",note:"No band or weights"},{name:"Standing Band Kickback",note:"Hold a chair for balance"}]}),
    home("h_fh",{name:"Fire Hydrant",group:"Glutes",muscle:"Side Glutes",sets:3,reps:"15/side",equip:"Band above knees",anim:"kb",
     tip:"Small, controlled lifts beat big swinging ones — feel the side of the glute.",cue:"Lift the bent knee out to the side to hip height. Pause. Lower slowly.",start:"On all fours, band just above the knees, back flat.",dont:"Don't lean your body away to lift higher — the torso stays still.",
     swaps:[{name:"Side-Lying Leg Raise",note:"Lying on your side"},{name:"Clamshell (Band)",note:"Side lying, knees bent"},{name:"Lateral Band Walk",note:"Band above knees, side steps"}]}),
    home("h_rc",{name:"Reverse Crunch",group:"Core",muscle:"Lower Abs",sets:3,reps:"12–15",equip:"Mat",anim:"bc",
     tip:"Think 'roll the hips off the floor', not 'swing the legs'.",cue:"Knees to chest, curl the pelvis up off the mat. Lower slowly until the feet almost touch.",start:"Lie on your back, hands by your sides, knees bent 90° over the hips.",dont:"Don't use momentum or let the lower back arch on the way down.",
     swaps:[{name:"Dead Bug",note:"Slower, lower-back friendly"},{name:"Lying Leg Raise",note:"Legs straighter — harder"},{name:"Seated Knee Tuck",note:"Sitting on the edge of the mat"}]}),
    home("h_sp",{name:"Side Plank",group:"Core",muscle:"Obliques — Waist",sets:3,reps:"20–30 sec/side",equip:"Mat",anim:"sp",
     tip:"Hips high and stacked — one straight line from head to feet.",cue:"Push the floor away with the forearm, lift the hips, hold. Keep breathing.",start:"Forearm under the shoulder, legs straight and stacked (bottom knee down = easier).",dont:"Don't let the hips sag or roll forward.",
     swaps:[{name:"Knee Side Plank",note:"Easier — bottom knee down"},{name:"Side Plank Hip Lift",note:"Harder — dip and lift"},{name:"Standing Side Crunch",note:"No floor needed"}]}),
    home("h_vac",{name:"Stomach Vacuum",group:"Core",muscle:"Deep Core (TVA)",sets:3,reps:"20–30 sec",equip:"None",anim:"vac",
     tip:"Trains the deep 'corset' muscle that holds the belly in. Easiest on an empty stomach.",cue:"Breathe all the air out. Pull the belly button in toward the spine and up under the ribs. Hold with small breaths.",start:"Stand, kneel or go on all fours. Breathe in, then breathe out completely.",dont:"Don't strain or hold your breath hard — it's a steady pull in, not a push.",
     swaps:[{name:"Vacuum on All Fours",note:"Easier to feel"},{name:"Diaphragmatic Breathing",note:"Slow belly breathing"},{name:"Dead Bug",note:"Deep core, moving"}]}),
    home("h_bd",{name:"Bird Dog (3-sec hold)",group:"Back",muscle:"Lower Back + Core Stability",sets:3,reps:"8/side",equip:"Mat",anim:"pl",
     tip:"Move slowly — a glass of water on your lower back shouldn't spill.",cue:"Reach opposite arm and leg long. Hold 3 seconds. Return and switch.",start:"On all fours, hands under shoulders, knees under hips, back flat.",dont:"Don't lift the leg higher than the hip or let the back arch.",
     swaps:[{name:"Dead Bug",note:"On your back"},{name:"Superman Hold",note:"Face down, arms and legs up"},{name:"Glute Bridge March",note:"Bridge, lift one foot at a time"}]}),
    home("h_ytw",{name:"Prone Y-T-W Raise",group:"Back",muscle:"Upper Back + Rear Shoulders",sets:2,reps:"8 each",equip:"Mat",anim:"lr",
     tip:"Thumbs up, shoulders down and back — this is the posture fix.",cue:"Lift the arms in a Y, then a T, then a W. Squeeze the shoulder blades each rep. 8 of each letter.",start:"Lie face down, forehead on a small towel, arms in front.",dont:"Don't lift your chest high or shrug toward your ears.",
     swaps:[{name:"Band Pull-Apart",note:"Standing, band"},{name:"Superman Hold",note:"Face down, hold"},{name:"Reverse Fly (light dumbbells)",note:"Bent over or seated"}]}),
  ]},
];

export const clonePlan=(p:any)=>JSON.parse(JSON.stringify(p));
// The plan in use. Replaced in place (applyProgramme) so every module that imports it sees the current plan.
export const SESSIONS:any[]=clonePlan(DEFAULT_SESSIONS);
export function applyProgramme(list:any){
  const next=Array.isArray(list)&&list.length?list:clonePlan(DEFAULT_SESSIONS);
  if(next!==SESSIONS)SESSIONS.splice(0,SESSIONS.length,...next);
}
