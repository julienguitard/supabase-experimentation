-- links

create table if not exists links (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    url text not null,
    category text not null,
    user_id uuid not null,
    constraint links_pkey primary key (id),
    constraint links_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- contents

create table if not exists contents (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    link_id uuid not null,
    status text not null,
    content bytea not null,
    error bytea not null,
    user_id uuid not null,
    constraint contents_pkey primary key (id),
    constraint contents_link_id_fkey foreign key (link_id) references links (id),
    constraint contents_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- summaries

create table if not exists summaries (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    content_id uuid not null,
    summary bytea not null,
    user_id uuid not null,
    constraint summaries_pkey primary key (id),
    constraint summaries_content_id_fkey foreign key (content_id) references contents (id),
    constraint summaries_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- questions

create table if not exists questions (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    question bytea not null,
    user_id uuid not null,
    constraint questions_pkey primary key (id),
    constraint questions_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- fragments

create table if not exists fragments (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    source_table text not null,
    source_column text not null,
    source_id uuid not null,
    user_id uuid not null,
    constraint fragments_pkey primary key (id),
    constraint fragments_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- chunks

create table if not exists chunks (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    fragment_id uuid not null,
    chunk bytea not null,
    start_ int8 not null,
    end_ int8 not null,
    length_ int8 not null,
    user_id uuid not null,
    constraint chunks_pkey primary key (id),
    constraint chunks_fragment_id_fkey foreign key (fragment_id) references fragments (id),
    constraint chunks_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- vectors

create table if not exists vectors (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    chunk_id uuid not null,
    embedding vector(1536) not null,
    user_id uuid not null,
    constraint vectors_pkey primary key (id),
    constraint vectors_chunk_id_fkey foreign key (chunk_id) references chunks (id),
    constraint vectors_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- matches

create table if not exists matches (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    question_id uuid not null,
    user_id uuid not null,
    constraint matches_pkey primary key (id),
    constraint matches_question_id_fkey foreign key (question_id) references questions (id),
    constraint matches_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- questions_matching_chunks

create table if not exists questions_matching_chunks (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    match_id uuid not null,
    chunk_id uuid not null,
    user_id uuid not null,
    constraint questions_matching_chunks_pkey primary key (id),
    constraint questions_matching_chunks_match_id_fkey foreign key (match_id) references matches (id),
    constraint questions_matching_chunks_chunk_id_fkey foreign key (chunk_id) references chunks (id),
    constraint questions_matching_chunks_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- modified_questions

create table if not exists modified_questions (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    match_id uuid not null,
    modified_question bytea not null,
    user_id uuid not null,
    constraint modified_questions_pkey primary key (id),
    constraint modified_questions_match_id_fkey foreign key (match_id) references matches (id),
    constraint modified_questions_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;

-- answers

create table if not exists answers (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    modified_question_id uuid not null,
    answer bytea not null,
    user_id uuid not null,
    constraint answers_pkey primary key (id),
    constraint answers_modified_question_id_fkey foreign key (modified_question_id) references modified_questions (id),
    constraint answers_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;