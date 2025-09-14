-- links

drop table if exists links_insert_buffer cascade;
drop table if exists links_update_buffer cascade;
drop table if exists links_delete_buffer cascade;

create table links_insert_buffer as (
    select id, created_at, url, category, user_id from links
    where false
);

create table links_update_buffer as (
    select id, created_at, url, category, user_id from links
    where false
);

create table links_delete_buffer as (
    select id, created_at, url, category from links
    where false
);

-- contents

drop table if exists contents_insert_buffer cascade;

create table contents_insert_buffer as (
  select
    id, created_at, link_id, status, '0afe' as hex_content, '0afe' as hex_error, user_id
  from
    contents
  where
    false
);

-- summaries

drop table if exists summaries_insert_buffer cascade;

create table summaries_insert_buffer as (
  select
    id, created_at, content_id, '0afe' as hex_summary, user_id
  from
    summaries
  where
    false
);

-- questions

drop table if exists questions_insert_buffer cascade;

create table questions_insert_buffer as (
  select id, created_at, '0afe' as hex_question, user_id from questions
  where false
);

drop table if exists questions_update_buffer cascade;

create table questions_update_buffer as (
  select id, created_at, '0afe' as hex_question, user_id from questions
  where false
);

drop table if exists questions_delete_buffer cascade;

create table questions_delete_buffer as (
  select id, created_at, '0afe' as hex_question, user_id from questions
  where false
);

-- fragments

drop table if exists fragments_insert_buffer cascade;

create table fragments_insert_buffer as (
  select id, created_at, source_table, source_column, source_id, user_id from fragments
  where false
);

-- chunks

drop table if exists chunks_insert_buffer cascade;

create table chunks_insert_buffer as (
  select id, created_at, fragment_id, '0afe' as hex_chunk, start_, end_, length_, user_id from chunks
  where false
);

-- vectors

drop table if exists vectors_insert_buffer cascade;

create table vectors_insert_buffer as (
  select id, created_at, chunk_id, embeddings, user_id from vectors
  where false
);

-- matches

drop table if exists matches_insert_buffer cascade;

create table matches_insert_buffer as (
  select id, created_at, question_id, user_id from matches
  where false
);

-- questions_matching_chunks

drop table if exists questions_matching_chunks_insert_buffer cascade;

create table questions_matching_chunks_insert_buffer as (
  select id, created_at, match_id, chunk_id, user_id from questions_matching_chunks
  where false
);

-- modified_questions

drop table if exists modified_questions_insert_buffer cascade;

create table modified_questions_insert_buffer as (
  select id, created_at, match_id, '0afe' as hex_modified_question, user_id from modified_questions
  where false
);

-- answers

drop table if exists answers_insert_buffer cascade;

create table answers_insert_buffer as (
  select id, created_at, modified_question_id, '0afe' as hex_answer, user_id from answers
  where false
);

drop table if exists questions_to_answer_with_chunks_buffer;

create table questions_to_answer_with_chunks_buffer as (
  select id, created_at, chunk_id, chunk, user_id from questions_to_answer_with_chunks
  where false
);
