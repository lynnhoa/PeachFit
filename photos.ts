// ── EXERCISE PHOTOS ──────────────────────────────────────────────────────────
// A photo at the top of the How-to sheet instead of the drawing.
// Add one: put a picture in photos/ named after the movement (e.g. photos/plank.jpg — portrait 4:5,
// 800×1000) and it shows on every day that has that exercise. No code change needed.
// Exercises without a photo keep their drawing. Photos are bundled with the app (work offline).

// every photo file in photos/ → its URL in the build
const FILES=import.meta.glob("./photos/*.{jpg,jpeg,png,webp}",{eager:true,query:"?url",import:"default"}) as Record<string,string>;
const BY_NAME:Record<string,string>={};
for(const [path,url] of Object.entries(FILES))BY_NAME[path.replace(/^.*\//,"").replace(/\.\w+$/,"")]=url;

// Exercise id → movement (= photo file name). The same movement on different days shares one photo.
export const MOVEMENT:Record<string,string>={
  ct_a:"cross-trainer",ct_b:"cross-trainer",ct_c:"cross-trainer",
  bx_a:"back-extension",bx_b:"back-extension",bx_c:"back-extension",
  ht_a:"hip-thrust",ht_b:"hip-thrust",
  rdl_db:"dumbbell-rdl",bss:"bulgarian-split-squat",
  kb_a:"cable-kickback",kb_b:"cable-kickback",
  ge:"glute-extension",ge_c:"glute-extension",
  abd:"hip-abduction",slht:"single-leg-hip-thrust",slrdl:"single-leg-rdl",
  abm:"ab-crunch-machine",abm_b:"ab-crunch-machine",
  kr_a:"captains-chair",kr_c:"captains-chair",
  pl_a:"plank",pl_b:"plank",
  rt_b:"russian-twist",rt_c:"russian-twist",
  lp:"lat-pulldown",row:"seated-row",dbr:"one-arm-row",rf:"reverse-fly",lr:"lateral-raise",
  h_gb:"glute-bridge",h_dk:"donkey-kick",h_fh:"fire-hydrant",h_rc:"reverse-crunch",
  h_sp:"side-plank",h_vac:"stomach-vacuum",h_bd:"bird-dog",h_swim:"swimming",h_ytw:"prone-ytw",
};

// Movements that use another movement's photo (none right now — every movement has its own)
const SAME_AS:Record<string,string>={};

// The How-to sheet shows a full-width 4:3 window of each 4:5 photo, cut just above her head:
// 0 = top of the photo, 100 = bottom.
const FOCUS:Record<string,number>={"ab-crunch-machine":54,"back-extension":10,"bird-dog":96,"bulgarian-split-squat":27,"cable-kickback":0,"captains-chair":22,"cross-trainer":0,"donkey-kick":85,"dumbbell-rdl":23,"fire-hydrant":100,"glute-bridge":100,"glute-extension":42,"hip-abduction":6,"hip-thrust":46,"lat-pulldown":0,"lateral-raise":8,"one-arm-row":44,"plank":100,"reverse-crunch":100,"reverse-fly":90,"russian-twist":89,"seated-row":41,"side-plank":100,"single-leg-hip-thrust":100,"single-leg-rdl":51,"stomach-vacuum":0,"swimming":100};

// Photographer credit shown under a photo (free stock photos don't require it, but it's kind)
const CREDIT:Record<string,string>={};

export function photoFor(ex:any):{src:string,credit?:string,pos:number}|null{
  const key=ex&&(ex.photo||MOVEMENT[ex.id]);
  const src=key&&(BY_NAME[key]||BY_NAME[SAME_AS[key]]);
  return src?{src,credit:CREDIT[key],pos:FOCUS[key]??FOCUS[SAME_AS[key]]??70}:null;
}
