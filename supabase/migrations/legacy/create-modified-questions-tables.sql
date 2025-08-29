drop function if exists insert_into_modified_questions;

drop table if exists modified_questions;

create table modified_questions (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  match_id uuid null,
  modified_question bytea null,
  user_id uuid null,
  constraint modified_questions_pkey primary key (id),
  constraint modified_questions_match_id_fkey foreign key (match_id) references matches (id),
  constraint modified_questions_user_id_fkey foreign key (user_id) references auth.users (id)
) TABLESPACE pg_default;

drop table if exists tmp_modified_questions_insert;

create table tmp_modified_questions_insert as (
  select
    id, created_at, match_id, '0afe' as hex_modified_question, user_id
  from
    modified_questions
  where
    false
);