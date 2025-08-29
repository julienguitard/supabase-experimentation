-- links

drop policy if exists "authenticated_all" on links;

alter table links disable row level security;

drop table if exists links_backup cascade;

create table links_backup as (
  select * from links
);

enable row level security on links;

create policy "authenticated_all"
on "public"."links"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- contents

drop policy if exists "authenticated_all" on contents;

alter table contents disable row level security;

drop table if exists contents_backup cascade;

create table contents_backup as (
  select * from contents
);

enable row level security on contents;

create policy "authenticated_all"
on "public"."contents"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- summaries

drop policy if exists "authenticated_all" on summaries;

alter table summaries disable row level security;

drop table if exists summaries_backup cascade;

create table summaries_backup as (
  select * from summaries
);

enable row level security on summaries;

create policy "authenticated_all"
on "public"."summaries"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- questions

drop policy if exists "authenticated_all" on questions;

alter table questions disable row level security;

drop table if exists questions_backup cascade;

create table questions_backup as (
  select * from questions
);

enable row level security on questions;

create policy "authenticated_all"
on "public"."questions"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- fragments

drop policy if exists "authenticated_all" on fragments;

alter table fragments disable row level security;

drop table if exists fragments_backup cascade;

create table fragments_backup as (
  select * from fragments
);

enable row level security on fragments;

create policy "authenticated_all"
on "public"."fragments"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- chunks

drop policy if exists "authenticated_all" on chunks;

alter table chunks disable row level security;

drop table if exists chunks_backup cascade;

create table chunks_backup as (
  select * from chunks
);

enable row level security on chunks;

create policy "authenticated_all"
on "public"."chunks"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- vectors

drop policy if exists "authenticated_all" on vectors;

alter table vectors disable row level security;

drop table if exists vectors_backup cascade;

create table vectors_backup as (
  select * from vectors
);

enable row level security on vectors;

create policy "authenticated_all"
on "public"."vectors"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- matches

drop policy if exists "authenticated_all" on matches;

alter table matches disable row level security;

drop table if exists matches_backup cascade;

create table matches_backup as (
  select * from matches
);

enable row level security on matches;

create policy "authenticated_all"
on "public"."matches"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- questions_matching_chunks

drop policy if exists "authenticated_all" on questions_matching_chunks;

alter table questions_matching_chunks disable row level security;

drop table if exists questions_matching_chunks_backup cascade;

create table questions_matching_chunks_backup as (
  select * from questions_matching_chunks
);

enable row level security on questions_matching_chunks;

create policy "authenticated_all"
on "public"."questions_matching_chunks"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- modified_questions

drop policy if exists "authenticated_all" on modified_questions;

alter table modified_questions disable row level security;

drop table if exists modified_questions_backup cascade;

create table modified_questions_backup as (
  select * from modified_questions
);

enable row level security on modified_questions;

create policy "authenticated_all"
on "public"."modified_questions"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

-- answers

drop policy if exists "authenticated_all" on answers;

alter table answers disable row level security;

drop table if exists answers_backup cascade;

create table answers_backup as (
  select * from answers
);

enable row level security on answers;

create policy "authenticated_all"
on "public"."answers"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);