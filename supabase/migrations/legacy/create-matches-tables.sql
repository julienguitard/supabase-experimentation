drop function if exists insert_into_matches;

drop table if exists matches;

create table matches (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  question_id uuid null,
  user_id uuid null,
  constraint matches_pkey primary key (id),
  constraint matches_question_id_fkey foreign key (question_id) references questions (id),
  constraint matches_user_id_fkey foreign key (user_id) references auth.users (id)
) TABLESPACE pg_default;

drop table if exists tmp_matches_insert;

create table tmp_matches_insert as (
  select
    id, created_at, question_id, user_id
  from
    matches
  where
    false
);