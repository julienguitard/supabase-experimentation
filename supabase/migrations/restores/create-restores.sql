-- links

create table if not exists links_backup as (
    select id, created_at, url, category, user_id from links
    where false
);

insert into links select id, created_at, url, category, user_id from links_backup;

-- contents

create table if not exists contents_backup as (
    select id, created_at, link_id, status, content, error, user_id from contents
    where false
);

insert into contents select id, created_at, link_id, status, content, error, user_id from contents_backup;

-- summaries

create table if not exists summaries_backup as (
    select id, created_at, content_id, summary, user_id from summaries
    where false
);

insert into summaries select id, created_at, content_id, summary, user_id from summaries_backup;

-- questions

create table if not exists questions_backup as (
    select id, created_at, question, user_id from questions
    where false
);

insert into questions select id, created_at, question, user_id from questions_backup;

-- fragments

create table if not exists fragments_backup as (
    select id, created_at, source_table, source_column, source_id, user_id from fragments
    where false
);

insert into fragments select * from fragments_backup;

-- chunks

create table if not exists chunks_backup as (
    select id, created_at, fragment_id, chunk, start_, end_, length_, user_id from chunks
    where false
);

insert into chunks select id, created_at, fragment_id, chunk, start_, end_, length_, user_id from chunks_backup;

-- vectors

create table if not exists vectors_backup as (
    select id, created_at, chunk_id, embeddings, user_id from vectors
    where false
);

insert into vectors select id, created_at, chunk_id, embeddings, user_id from vectors_backup;

-- matches

create table if not exists matches_backup as (
    select id, created_at, question_id, user_id from matches
    where false
);

insert into matches select id, created_at, question_id, user_id from matches_backup;

-- questions_matching_chunks

create table if not exists questions_matching_chunks_backup as (
    select id, created_at, match_id, chunk_id, user_id from questions_matching_chunks
    where false
);

insert into questions_matching_chunks select id, created_at, match_id, chunk_id, user_id from questions_matching_chunks_backup;

-- modified_questions

create table if not exists modified_questions_backup as (
    select id, created_at, match_id, modified_question, user_id from modified_questions
    where false
);

insert into modified_questions select id, created_at, match_id, modified_question, user_id from modified_questions_backup;

-- answers

create table if not exists answers_backup as (
    select id, created_at, modified_question_id, answer, user_id from answers
    where false
);

insert into answers select id, created_at, modified_question_id, answer, user_id from answers_backup;
