-- Links

-- Contents
drop view if exists latest_links_contents;

create view latest_links_contents with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    link_id,
    link_created_at,
    status,
    content,
    error,
    url,
    category,
    user_id,
    rank() over (partition by link_id order by created_at desc) as rn
    from denormalized_contents)
    where rn = 1
);

-- Summaries

drop view if exists latest_links_summaries;

create view latest_links_summaries with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    content_id,
    content_created_at,
    link_id,
    link_created_at,
    status,
    content,
    error,
    url,
    category,
    user_id,
    rank() over (partition by link_id order by content_created_at, created_at desc) as rn
    from denormalized_summaries)
    where rn = 1
);
-- Questions

-- Fragments


drop view if exists latest_links_fragments;

create view latest_links_fragments with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    content_id,
    content_created_at,
    link_id,
    link_created_at,
    status,
    content,
    error,
    url,
    category,
    user_id,
    rank() over (partition by link_id order by content_created_at, created_at desc) as rn
    from denormalized_contents_fragments)
    where rn = 1
);


drop view if exists latest_summaries_fragments;

create view latest_summaries_fragments with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    summary_id,
    summary_created_at,
    summary,
    user_id,
    rank() over (partition by summary_id order by created_at desc) as rn
    from denormalized_summaries_fragments)
    where rn = 1
);

drop view if exists latest_questions_fragments;

create view latest_questions_fragments with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    question_id,
    question_created_at,
    question,
    user_id,
    rank() over (partition by question_id order by created_at desc) as rn
    from denormalized_questions_fragments)
    where rn = 1
);

-- Chunks

drop view if exists latest_fragments_chunks;

create view latest_fragments_chunks with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    fragment_id,
    fragment_created_at,
    source_table,
    source_column,
    source_id,
    chunk,
    start_,
    end_,
    length_,
    user_id,
    rank() over (partition by fragment_id order by created_at desc) as rn
    from denormalized_chunks)
    where rn = 1
);

drop view if exists latest_links_chunks;

create view latest_links_chunks with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    fragment_id,
    fragment_created_at,
    content_id,
    content_created_at,
    link_id,
    link_created_at,
    chunk,
    start_,
    end_,
    length_,
    status,
    content,
    error,
    url,
    category,
    user_id,
    rank() over (partition by link_id order by content_created_at, fragment_created_at, created_at desc) as rn
    from denormalized_contents_chunks)
    where rn = 1
);

drop view if exists latest_summaries_chunks;

create view latest_summaries_chunks with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    fragment_id,
    fragment_created_at,
    summary_id,
    summary_created_at,
    content_id,
    content_created_at,
    chunk,
    start_,
    end_,
    length_,
    summary,
    status,
    content,
    error,
    url,
    category,
    user_id,
    rank() over (partition by link_id order by content_created_at, summary_created_at, fragment_created_at,created_at desc) as rn
    from denormalized_summaries_chunks)
    where rn = 1
);

drop view if exists latest_questions_chunks;

create view latest_questions_chunks with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    fragment_id,
    fragment_created_at,
    question_id,
    question_created_at,
    question,
    user_id,
    rank() over (partition by question_id order by fragment_created_at, created_at desc) as rn
    from denormalized_questions_chunks)
    where rn = 1
);

-- Vectors  

drop view if exists latest_fragments_vectors;

create view latest_fragments_vectors with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    chunk_id,
    chunk_created_at,
    fragment_id,
    fragment_created_at,
    source_table,
    source_column,
    source_id,
    embeddings,
    chunk,
    start_,
    end_,
    length_,
    user_id,
    rank() over (partition by fragment_id order by chunk_created_at, created_at desc) as rn
    from denormalized_vectors)
    where rn = 1
);

drop view if exists latest_links_vectors;

create view latest_links_vectors with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    chunk_id,
    chunk_created_at,
    fragment_id,
    fragment_created_at,
    content_id,
    content_created_at,
    link_id,
    link_created_at,
    embeddings,
    chunk,
    start_,
    end_,
    length_,
    status,
    content,
    error,
    url,
    category,
    user_id,
    rank() over (partition by link_id order by content_created_at, fragment_created_at, chunk_created_at,created_at desc) as rn
    from denormalized_contents_vectors)
    where rn = 1
);

drop view if exists latest_summaries_vectors;

create view latest_summaries_vectors with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    chunk_id,
    chunk_created_at,
    fragment_id,
    fragment_created_at,
    summary_id,
    summary_created_at,
    content_id,
    content_created_at,
    link_id,
    link_created_at,
    embeddings,
    chunk,
    start_,
    end_,
    length_,
    summary,
    status,
    content,
    error,
    url,
    category,
    user_id,
    rank() over (partition by link_id order by content_created_at, summary_created_at, fragment_created_at, chunk_created_at,created_at desc) as rn
    from denormalized_summaries_vectors)
    where rn = 1
);

drop view if exists latest_questions_vectors;

create view latest_questions_vectors with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    chunk_id,
    chunk_created_at,
    fragment_id,
    fragment_created_at,
    question_id,
    question_created_at,
    embeddings,
    chunk,
    start_,
    end_,
    length_,
    question,   
    user_id,
    rank() over (partition by question_id order by fragment_created_at, chunk_created_at,created_at desc) as rn
    from denormalized_questions_vectors)
    where rn = 1
);

-- Matches

drop view if exists latest_questions_matches;

create view latest_questions_matches with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    question_id,
    question_created_at,
    question,
    chunks,
    user_id,
    rank() over (partition by question_id order by created_at desc) as rn
    from denormalized_questions_matching_chunks_arrays)
    where rn = 1
);
-- Questions matching chunks

-- Modified questions

drop view if exists latest_questions_modified_questions;

create view latest_questions_modified_questions with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    match_id,
    match_created_at,
    question_id,
    question_created_at,
    question,
    user_id,
    rank() over (partition by question_id order by match_created_at, created_at desc) as rn
    from denormalized_modified_questions)
    where rn = 1
);

-- Answers

drop view if exists latest_questions_answers;

create view latest_questions_answers with (security_invoker = on) as
(select * from (
    select
    id,
    created_at,
    modified_question_id,
    modified_question_created_at,
    match_id,
    match_created_at,
    question_id,
    question_created_at,
    answer,
    modified_question,
    question,
    user_id,
    rank() over (partition by question_id order by match_created_at, modified_question_created_at, created_at desc) as rn
    from denormalized_answers)
    where rn = 1
);
