create table chunks (
    id int8 not null default 0,
    created_at timestamp with time zone default current_timestamp,
    fragment_id uuid not null,
    content bytea not null,
    start_ int8 not null,
    end_ int8 not null,
    constraint chunks_pkey primary key (id)
) tablespace pg_default;

create table tmp_chunks_insert as (
    select
        *
    from chunks where false
);