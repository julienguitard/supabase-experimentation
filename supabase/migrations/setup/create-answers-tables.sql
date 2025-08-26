drop table if exists answers;

create table answers (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  modified_question_id uuid null,
  answer text null,
  user_id uuid null,
  constraint answers_pkey primary key (id),
  constraint answers_modified_question_id_fkey foreign key (modified_question_id) references modified_questions (id),
  constraint answers_user_id_fkey foreign key (user_id) references auth.users (id)
) TABLESPACE pg_default;

drop table if exists tmp_answers_insert;

create table tmp_answers_insert as (
  select
    id, created_at, modified_question_id, '0afe' as hex_answer, user_id
  from
    answers
  where
    false
);

-- Check if the user is the owner of the modified question
create policy "authenticated_all" on answers
for all
to public
using ((select auth.uid() as user_id) = user_id)
with check ((select auth.uid() as user_id) = user_id);

alter table tmp_answers_insert enable row level security;

-- Check if the user is authenticated to insert a modified question
create policy "authenticated_all" on tmp_answers_insert
for all
to public
using ((select auth.uid() as user_id) is not null)
with check ((select auth.uid() as user_id) is not null);