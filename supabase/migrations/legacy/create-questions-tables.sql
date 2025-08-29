drop function if exists insert_into_questions;

drop table if exists questions;

create table questions (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  question bytea null,
  user_id uuid null,
  constraint questions_pkey primary key (id),
  constraint questions_user_id_fkey foreign key (user_id) references auth.users (id)
) TABLESPACE pg_default;

drop table if exists tmp_questions_insert;

create table tmp_questions_insert as (
  select
    id, created_at, '0afe' as hex_question, user_id
  from
    questions
  where
    false
);