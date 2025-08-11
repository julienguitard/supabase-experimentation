create table fragments (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone default current_timestamp,
    source_table text not null,
    source_column text not null,
    source_id uuid not null,
    constraint fragments_pkey primary key (id)
) tablespace pg_default;

create table tmp_fragments_insert as (
  select
    *
  from
    fragments
  where
    false
);