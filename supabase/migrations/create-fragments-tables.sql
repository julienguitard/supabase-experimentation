create table fragments (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone default current_timestamp,
    source_table text not null,
    source_column text not null,
    source_id uuid not null,
    user_id uuid not null,
    constraint fragments_pkey primary key (id),
    -- Todo: constraint fragments_source_table_fkey foreign key (source_table) references information_schema.columns (table_name),
    -- Todo: constraint fragments_source_column_fkey foreign key (source_column) references information_schema.columns (column_name),
    constraint fragments_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

create table tmp_fragments_insert as (
  select
    *
  from
    fragments
  where
    false
);