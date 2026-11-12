# PeachFit — Supabase sync

Use PeachFit on several phones: the plan (days + exercises), workouts and weights, body numbers,
protein days, goals and "Reset weights" are stored in your Supabase project and shared by every
phone that signs in with the same email + password. Each phone keeps working offline and catches up
when it's back online.

## Setup (once)

1. **Create the tables** — Supabase dashboard → **SQL Editor** → **New query** → paste
   [`schema.sql`](schema.sql) → **Run**. Running it again is safe.
2. **Create your account (only yours)** — **Authentication → Users → Add user → Create new user**:
   your email + a password, tick **Auto Confirm User**, **Create user**.
3. **Nobody else can sign up** — **Authentication → Sign In / Providers**: switch off
   **Allow new users to sign up**, **Save**. Keep the **Email** provider on (that's how you sign in).
   The app has no "create account" button: the only account is the one from step 2.
4. **In the app** — **Me → Sync · all your phones** → sign in on your main phone first
   (it uploads everything that phone has), then on the others with the same email + password.

The project URL and publishable key are in [`cloud.ts`](../cloud.ts). The publishable key is designed to
be in the app: it can only do what the Row Level Security policies allow — each account reads and
changes only its own rows. To use another project, set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel (Settings → Environment Variables) and redeploy.

## What goes where

| In the app | Supabase table | One row per |
|---|---|---|
| Name, goals (weight / waist / body fat), "Reset weights" date | `profiles` | account |
| Training days: Mon C, Wed A, Fri B, Home (name, day, order, colour …) | `programme_sessions` | day |
| Exercises of each day — added, edited, reordered or removed in the app (sets, reps, start weight, step, how many sessions before it goes up, rest, barbell / per hand / one hand, equipment, tips, swaps) | `exercises` | exercise |
| A finished workout (day, date, time, kcal, skipped exercises) | `workouts` | workout |
| What you did per exercise in that workout: **weight**, sets done, "Top of the range?" answer, swap | `workout_exercises` | exercise in a workout |
| Body numbers (weight, waist, body fat, muscle, metabolic age) | `body_log` | entry |
| Protein: hit / not / skipped | `nutrition_log` | day |
| — | `weight_progress` (view) | readable progress: date, day, exercise, weight, sets, top of range |

The weight the app suggests next time isn't stored: it's worked out from `workout_exercises`
(see PROGRESSION.md), so every phone suggests the same weight.

Not synced: a workout that is still running (it's saved on that phone until you finish it).

## How syncing works

- Every change is saved on the phone first, then queued and sent to Supabase (straight away when
  online, otherwise as soon as the phone is back online).
- Opening the app — or switching back to it — fetches everything from Supabase and re-applies the
  changes that phone hasn't sent yet. If two phones change the same thing, the last one sent wins.
- First sign-in on a phone: workouts, body numbers and protein days that are only on that phone are
  uploaded. If the account already has a plan, the phone switches to that plan.
- **Clear all data** on one phone clears the history on all phones (the plan is kept).
- **Sign out** keeps everything on the phone; it just stops syncing.
