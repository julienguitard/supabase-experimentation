drop table if exists tmp_vectors_insert cascade;

drop table if exists vectors cascade;

create table vectors (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone default current_timestamp,
    chunk_id uuid not null,
    embeddings vector(1536) not null,
    user_id uuid not null,
    constraint vectors_pkey primary key (id),
    constraint vectors_chunk_id_fkey foreign key (chunk_id) references chunks (id),
    constraint vectors_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

create table tmp_vectors_insert as (
    select
        *
    from vectors where false
);