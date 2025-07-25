drop function if exists insert_into_summaries;

drop table if exists public.summaries;

create table public.summaries (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  content_id uuid null,
  summary bytea null,
  constraint summaries_pkey primary key (id),
  constraint summaries_content_id_fkey foreign KEY (content_id) references contents (id)
) TABLESPACE pg_default;

drop table if exists public.tmp_summaries_insert;

create table tmp_summaries_insert as (
  select
    id, created_at, content_id, '0afe' as hex_summary
  from
    summaries
  where
    false
);