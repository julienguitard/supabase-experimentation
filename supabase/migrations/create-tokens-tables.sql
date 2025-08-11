create table tokens (
    id int8 not null default 0,
    created_at timestamp with time zone default current_timestamp,
    fragment_id uuid not null,
    constraint tokens_pkey primary key (id)
) tablespace pg_default;

create table tmp_tokens_insert as (
    select
        *
    from tokens where false
);