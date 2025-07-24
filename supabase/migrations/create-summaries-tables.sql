create table public.summaries (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  content_id uuid null,
  summary bytea null,
  constraint summaries_pkey primary key (id),
  constraint summaries_content_id_fkey foreign KEY (content_id) references contents (id)
) TABLESPACE pg_default;

create table tmp_summaries_insert as (
  select
    id, created_at, content_id, summary::bytea as summary
  from
    summaries
  where
    false
);