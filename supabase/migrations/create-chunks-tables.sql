create table chunks (
    id int8 not null default 0,
    created_at timestamp with time zone default current_timestamp,
    fragment_id uuid not null,
    content bytea not null,
    start_ int8 not null,
    end_ int8 not null,
    user_id uuid not null,
    constraint chunks_pkey primary key (id),
    constraint chunks_fragment_id_fkey foreign key (fragment_id) references fragments (id),
    constraint chunks_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

create table tmp_chunks_insert as (
    select
        id, created_at, fragment_id, '0afe' as hex_content, start_, end_, user_id
    from chunks where false
);