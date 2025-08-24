drop function if exists insert_into_questions_matching_chunks;

drop table if exists questions_matching_chunks;

create table questions_matching_chunks (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  modified_question_id uuid null,
  chunk_id uuid null,
  user_id uuid null,
  constraint questions_matching_chunks_pkey primary key (id),
  constraint questions_matching_chunks_modified_question_id_fkey foreign key (modified_question_id) references modified_questions (id),
  constraint questions_matching_chunks_chunk_id_fkey foreign key (chunk_id) references chunks (id),
  constraint questions_matching_chunks_user_id_fkey foreign key (user_id) references auth.users (id)
) TABLESPACE pg_default;

drop table if exists tmp_questions_matching_chunks_insert;

create table tmp_questions_matching_chunks_insert as (
  select
    id, created_at, modified_question_id, chunk_id, user_id
  from
    questions_matching_chunks
  where
    false
);