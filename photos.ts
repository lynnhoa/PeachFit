// ── EXERCISE PHOTOS ──────────────────────────────────────────────────────────
// A photo at the top of the How-to sheet instead of the drawing.
// Add one: put a picture in photos/ named after the movement (e.g. photos/plank.jpg — landscape 3:2,
// about 1200×800) and it shows on every day that has that exercise. No code change needed.
// Exercises without a photo keep their drawing. Photos are bundled with the app (work offline).

// every photo file in photos/ → its URL in the build (none yet = all drawings)
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
  sc_b:"suitcase-carry",sc_c:"suitcase-carry",
  lp:"lat-pulldown",row:"seated-row",dbr:"one-arm-row",rf:"reverse-fly",lr:"lateral-raise",
  h_gb:"glute-bridge",h_dk:"donkey-kick",h_fh:"fire-hydrant",h_rc:"reverse-crunch",
  h_sp:"side-plank",h_vac:"stomach-vacuum",h_bd:"bird-dog",h_ytw:"prone-ytw",
};

// Photographer credit shown under a photo (free stock photos don't require it, but it's kind)
const CREDIT:Record<string,string>={};

export function photoFor(ex:any):{src:string,credit?:string}|null{
  const key=ex&&(ex.photo||MOVEMENT[ex.id]);
  const src=key&&BY_NAME[key];
  return src?{src,credit:CREDIT[key]}:null;
}
