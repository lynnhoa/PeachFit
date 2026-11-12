-- ═════════════════════════════════════════════════════════════════════════════
-- PeachFit — Supabase tables
-- Run once: Supabase dashboard → SQL Editor → New query → paste this file → Run.
-- Safe to run again: it only creates what is missing and resets the policies.
--
-- Every table is private: Row Level Security lets a signed-in account read and change
-- only its own rows. The app signs in with email + password (Authentication → Email).
-- ═════════════════════════════════════════════════════════════════════════════

set client_min_messages to warning;  -- quiet "already exists, skipping" notices on a re-run

-- updated_at follows every change
create or replace function public.peachfit_touch() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ── 1. PROFILE — name, goals, "Reset weights" date (one row per account) ────
create table if not exists public.profiles (
  user_id          uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  name             text not null default '',
  goal_weight      numeric,              -- kg
  goal_waist       numeric,              -- cm
  goal_body_fat    numeric,              -- %
  weights_reset_at timestamptz,          -- "Reset weights": progression restarts after this
  extra            jsonb not null default '{}'::jsonb,
  updated_at       timestamptz not null default now()
);

-- ── 2. PLAN — the training days (Mon C · Wed A · Fri B · Home) ──────────────
create table if not exists public.programme_sessions (
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id           text not null,            -- glutes_c · glutes · shape · home
  position     int  not null default 0,  -- order on the Today screen
  name         text not null,            -- "Glutes A + Core + Back"
  day_label    text,                     -- "Wednesday", "Monday · optional"
  short        text,                     -- "Wed"
  cell         text,                     -- calendar letter: C A B H
  tag          text,
  info         text,
  color        text,
  duration_min int,
  met          numeric,
  optional     boolean not null default false,
  flexible     boolean not null default false,
  extra        jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now(),
  primary key (user_id, id)
);

-- ── 3. PLAN — exercises of each day (add / edit / remove them in the app) ───
create table if not exists public.exercises (
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id           text not null,            -- ht_a, rdl_db … exercises added in the app: x_…
  session_id   text not null,            -- programme_sessions.id
  position     int  not null default 0,  -- order inside the day
  name         text not null,
  section      text,                     -- Warm-up · Glutes · Core · Back · Shoulders
  muscle       text,
  sets         int  not null default 3,
  reps         text not null default '10', -- "8–12", "12–15/leg", "30 sec/side"
  bodyweight   boolean not null default false,
  start_weight numeric not null default 0, -- kg (level for the cross trainer)
  unit         text,                     -- null = kg · 'level'
  bar_weight   numeric,                  -- barbell (20): per side = (weight − bar) / 2
  per          text,                     -- 'hand' / 'arm': the weight is per hand / arm
  hold_note    text,                     -- 'one hand', '1 dumbbell'
  equipment    text,                     -- bodyweight moves: 'Band above knees', 'Mat' …
  step         numeric not null default 0, -- kg added at each increase
  sessions_to_increase int not null default 0, -- complete sessions needed at a weight (0 = never)
  rest_sec     int  not null default 60,
  anim         text,
  tip          text,
  cue          text,
  start_position text,
  avoid        text,
  swaps        jsonb not null default '[]'::jsonb,  -- [{name, note}]
  extra        jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now(),
  primary key (user_id, id),
  foreign key (user_id, session_id) references public.programme_sessions (user_id, id) on delete cascade
);

-- ── 4. WORKOUTS — every finished session ───────────────────────────────────
create table if not exists public.workouts (
  id           uuid primary key,
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  session_id   text not null,            -- which day (kept even when the plan changes)
  session_tag  text,
  performed_at timestamptz not null,
  duration_sec int not null default 0,
  calories     int not null default 0,
  skipped      jsonb not null default '[]'::jsonb,  -- exercises skipped that day
  extra        jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now()
);

-- ── 5. WEIGHT PROGRESS — what you did per exercise in each workout ─────────
create table if not exists public.workout_exercises (
  workout_id   uuid not null references public.workouts (id) on delete cascade,
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  exercise_id  text not null,            -- exercises.id
  weight       numeric,                  -- kg lifted (level for the cross trainer); empty = bodyweight / swapped
  sets_done    int  not null default 0,
  top_of_range boolean,                  -- answer to "Top of the range on every set?"
  swapped_to   text,                     -- the swap you picked, if any
  primary key (workout_id, exercise_id)
);

-- ── 6. BODY NUMBERS ────────────────────────────────────────────────────────
create table if not exists public.body_log (
  id            uuid primary key,
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  logged_at     timestamptz not null,
  weight        numeric,                 -- kg
  waist         numeric,                 -- cm
  body_fat      numeric,                 -- %
  muscle_mass   numeric,                 -- kg
  metabolic_age numeric,                 -- years
  extra         jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

-- ── 7. PROTEIN — one answer per day ────────────────────────────────────────
create table if not exists public.nutrition_log (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day        date not null,
  hit        boolean,                    -- protein goal hit? empty = skipped
  skipped    boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create index if not exists workouts_user_time       on public.workouts (user_id, performed_at);
create index if not exists workout_exercises_user   on public.workout_exercises (user_id, exercise_id);
create index if not exists body_log_user_time       on public.body_log (user_id, logged_at);

-- ── updated_at triggers ────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['profiles','programme_sessions','exercises','workouts','body_log','nutrition_log'] loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.peachfit_touch()', t);
  end loop;
end $$;

-- ── Privacy: each account only sees its own rows ──────────────────────────
do $$
declare t text;
begin
  foreach t in array array['profiles','programme_sessions','exercises','workouts','workout_exercises','body_log','nutrition_log'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format('create policy "own rows" on public.%I for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- ── Handy view: weight progress per exercise (Table Editor → weight_progress) ─
create or replace view public.weight_progress with (security_invoker = true) as
select w.performed_at,
       coalesce(d.name, w.session_id)   as day,
       coalesce(e.name, we.exercise_id) as exercise,
       we.weight,
       we.sets_done,
       we.top_of_range,
       we.swapped_to,
       we.exercise_id,
       w.session_id,
       w.user_id
from public.workout_exercises we
join public.workouts w on w.id = we.workout_id
left join public.exercises e on e.user_id = w.user_id and e.id = we.exercise_id
left join public.programme_sessions d on d.user_id = w.user_id and d.id = w.session_id;

revoke all on public.weight_progress from anon;
grant select on public.weight_progress to authenticated;
