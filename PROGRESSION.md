# PeachFit — weekly plan, starting weights & progression

## The week

| Day | Session | Type |
|---|---|---|
| Monday | Glutes C + Core + Back + Shoulders | optional gym |
| Wednesday | Glutes A + Core + Back | **fixed main day** |
| Friday | Glutes B + Core + Back | **fixed main day** |
| Tue or Thu (or Monday instead of the gym) | Home Workout | flexible |

If you went to the gym on Monday, do the home workout on Thursday, not Tuesday.

### What the app suggests (the "Suggested today" badge and the top message)

| Today | Suggested |
|---|---|
| Monday | Glutes C — unless you already did the home workout this week |
| Tuesday | Home — unless you went to the gym on Monday or already did home this week |
| Wednesday | Glutes A |
| Thursday | Home — unless already done this week |
| Friday | Glutes B |
| Saturday / Sunday | a Wednesday or Friday session you missed this week, otherwise rest |

Every session can always be started from its card — the badge is only a suggestion.

## Starting weights

Every gym day starts with the warm-up: **cross trainer** 10–15 min (level 4) and **back extension** 2 × 12–15 (bodyweight).
Barbell weights assume a 20 kg bar. Each day tracks its own weights.

### Monday — Glutes C + Core + Back + Shoulders (optional)

| Exercise | Sets × reps | Start | Step | Up after |
|---|---|---|---|---|
| 45° glute extension | 3 × 12–15 | 5 kg plate | +2.5 kg | 3 weeks |
| Single-leg hip thrust | 3 × 10–12/leg | 10 kg (1 dumbbell) | +2 kg | 3 weeks |
| Single-leg Romanian deadlift | 3 × 10/leg | 10 kg (one hand) | +2 kg | 3 weeks |
| Dumbbell Russian twist | 3 × 10–12/side | 4 kg (one dumbbell, both hands) | +1 kg | 3 weeks |
| Captain's chair knee raise | 3 × 10–12 | Bodyweight | — | — |
| One-arm dumbbell row | 3 × 10–12/arm | 10 kg/arm | +2 kg | 3 weeks |
| Seated reverse fly | 3 × 12–15 | 3 kg/hand | +1 kg | 4 weeks |
| Dumbbell lateral raise | 2 × 12–15 | 2 kg/hand | +1 kg | 4 weeks |

### Wednesday — Glutes A + Core + Back (main)

| Exercise | Sets × reps | Start | Step | Up after |
|---|---|---|---|---|
| Barbell hip thrust | 4 × 8–12 | 60 kg (20 kg/side) | +5 kg (+2.5/side) | 3 weeks |
| Dumbbell Romanian deadlift | 3 × 10–12 | 10 kg/hand | +2 kg/hand | 3 weeks |
| Bulgarian split squat | 3 × 8–10/leg | 10 kg/hand | +2 kg/hand | 3 weeks |
| Cable kickback | 3 × 12–15/leg | 7.5 kg | +2.5 kg | 4 weeks |
| Ab crunch machine | 3 × 12–15 | 20 kg | +2.5 kg | 3 weeks |
| Captain's chair knee raise | 3 × 10–12 | Bodyweight | — | — |
| Plank | 2 × 30–45 sec | Bodyweight | hold longer | — |
| Lat pulldown | 3 × 10–12 | 25 kg | +2.5 kg | 3 weeks |

### Friday — Glutes B + Core + Back (main)

| Exercise | Sets × reps | Start | Step | Up after |
|---|---|---|---|---|
| Barbell hip thrust | 3 × 10–12 | 50 kg (15 kg/side) | +5 kg (+2.5/side) | 3 weeks |
| 45° glute extension | 3 × 12–15 | 5 kg plate | +2.5 kg | 3 weeks |
| Cable kickback | 3 × 12–15/leg | 7.5 kg | +2.5 kg | 4 weeks |
| Hip abduction machine | 3 × 15–20 | 45 kg | +5 kg | 3 weeks |
| Ab crunch machine | 3 × 12–15 | 20 kg | +2.5 kg | 3 weeks |
| Dumbbell Russian twist | 3 × 10–12/side | 4 kg (one dumbbell, both hands) | +1 kg | 3 weeks |
| Plank | 2 × 30–45 sec | Bodyweight | hold longer | — |
| Seated row machine | 3 × 10–12 | 25 kg | +2.5 kg | 3 weeks |

### Home — flexible (rest 30–45 sec between sets; the app uses 40 sec)

| Exercise | Sets × reps | Equipment |
|---|---|---|
| Glute bridge, 2-second squeeze | 3 × 20 | Band above knees |
| Donkey kick | 3 × 15/leg | Band + ankle weights |
| Fire hydrant | 3 × 15/side | Band above knees |
| Reverse crunch | 3 × 12–15 | Mat |
| Side plank | 3 × 20–30 sec/side | Mat |
| Stomach vacuum | 3 × 20–30 sec | None |
| Bird dog, 3-second hold | 3 × 8/side | Mat |
| Prone Y-T-W raise | 2 × 8 each | Mat |

Home moves are bodyweight: make them harder with more reps, longer holds, slower tempo or a stronger band.

If a starting weight is too light or too heavy (you can't stay in the rep range), adjust with − / + in the
workout: the app continues from what you actually lift.

**Changing the plan:** open a day on Today → **EDIT**. Tap an exercise to change it (name, section, sets, reps,
start weight, step, sessions before it goes up, rest, barbell / per hand / one hand, equipment, tip),
↑ ↓ to reorder, ✕ to remove, **+ ADD EXERCISE** for a new one. Workouts already logged are kept.
**Me → Restore the default plan** goes back to the plan above. With sync on, the plan is the same on every
phone (see supabase/README.md).

## Progressive overload — how the app decides

1. **Reps first:** stay at a weight and work up through the rep range (e.g. hip thrust 8 → 12 reps).
   Tap a set as done when you reach at least the bottom of the range with good form.
2. **After the last set** of each weighted exercise the app asks **"Top of the range on every set?"**
   (for a timed move with weight: **"Full time on every set?"**). Answer on the rest screen,
   or on the end screen before saving.
3. **Weight goes up one step only when all of these are true:**
   - every set was finished in the last **3 sessions** at that weight (4 for kickback, reverse fly and
     lateral raise), spread over at least 2 weeks (3 for those)
   - you answered **Yes** in the **last 2** of those sessions
   - no 15+ day break in between
   Training a day twice in one week doesn't speed it up. After a step up, drop back to the bottom of the range.
4. **"Not yet" or a missed set** keeps you at the same weight. It never drops for that.
5. **Bodyweight moves** don't add weight: add reps, hold longer, or move slower.

Fastest possible pace: hip thrust +5 kg every 3 weeks. Usually slower — it waits until you own the top of the range.
The optional Monday session only progresses when you do it most weeks; done rarely, it simply restarts gently (below).

## Irregular training

| Time since that exercise was last done | Next session |
|---|---|
| up to 14 days | normal progression |
| 15–27 days | one step lighter (never below the starting weight) |
| 28+ days | **fresh start** — back to the starting weights above |

Sessions from before a break of 15+ days never count toward the next increase, so after a break you always
need 3 new complete weeks before the weight goes up again.
