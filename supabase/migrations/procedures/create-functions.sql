-- Links

drop function if exists insert_into_links;
drop function if exists update_into_links;
drop function if exists delete_into_links;

create or replace function insert_into_links() returns setof links 
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into links t
        using tmp_links_insert s
        on t.url = s.url
        when matched then do nothing
        when not matched by target then insert (id, created_at, url, category, user_id) values 
        (gen_random_uuid(), now(), s.url, s.category, auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_links_insert where true;
end;
$$ ;

create or replace function update_into_links() returns setof links
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into links t
        using tmp_links_update s
        on t.id = s.id 
        when matched then update set category = s.category
        when not matched then do nothing
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_links_update where true;
end;
$$;

create or replace function delete_into_links() returns setof links
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation and capture deleted rows
    return query
    with merged as (
        merge into links t
        using tmp_links_delete s
        on t.id = s.id 
        when matched then delete
        when not matched then do nothing
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_links_delete where true;
end;
$$;


-- Contents

drop function if exists insert_into_contents;

create  function insert_into_contents() returns setof contents
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into contents t
        using tmp_contents_insert s
        on t.link_id = s.link_id and t.created_at = now() -- A link can be scraped multiple times
        when matched then do nothing
        when not matched by target then insert (id, created_at, link_id, status, content, error, user_id) values 
        (gen_random_uuid(), now(), s.link_id, s.status, decode(s.hex_content, 'hex'), decode(s.hex_error, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_contents_insert where true;
end;
$$;

-- Summaries

drop function if exists insert_into_summaries;

create function insert_into_summaries () returns setof summaries language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into summaries t
        using tmp_summaries_insert s
        on t.content_id = s.content_id AND t.created_at = now()
        when matched then do nothing
        when not matched by target then insert (id, created_at, content_id, summary, user_id) values 
        (gen_random_uuid(), now(), s.content_id, decode(s.hex_summary, 'hex'),auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_summaries_insert where true;
end;
$$;

-- Questions

drop function if exists insert_into_fragments;

create function insert_into_fragments () returns setof fragments language plpgsql security invoker as $$
begin  return query with merged as (
    merge into fragments t
    using tmp_fragments_insert s
    on t.source_table = s.source_table
    and t.source_column = s.source_column
    and t.source_id = s.source_id
    when matched then do nothing
    when not matched by target then insert (id, created_at, source_table, source_column, source_id, user_id) values 
    (gen_random_uuid(), now(), s.source_table, s.source_column, s.source_id, auth.uid())
    returning t.*
)
    select * from merged;
    
    -- Clean up the tmp table
   
delete from tmp_fragments_insert where true;
end;
$$;


-- Fragments

drop function if exists insert_into_fragments;

create function insert_into_fragments () returns setof fragments language plpgsql security invoker as $$
begin  return query with merged as (
    merge into fragments t
    using tmp_fragments_insert s
    on t.source_table = s.source_table
    and t.source_column = s.source_column
    and t.source_id = s.source_id
    when matched then do nothing
    when not matched by target then insert (id, created_at, source_table, source_column, source_id, user_id) values 
    (gen_random_uuid(), now(), s.source_table, s.source_column, s.source_id, auth.uid())
    returning t.*
)
    select * from merged;
    
    -- Clean up the tmp table
   
delete from tmp_fragments_insert where true;
end;
$$;


-- Chunks

drop function if exists insert_into_chunks;

create function insert_into_chunks () returns setof chunks language plpgsql security invoker as $$
begin  return query with merged as (
    merge into chunks t
    using tmp_chunks_insert s
    on t.fragment_id = s.fragment_id -- We dont rechunk an existing fragment
    when matched then do nothing
    when not matched by target then insert (id, created_at, fragment_id, chunk, start_, end_, length_, user_id) values 
    (gen_random_uuid(), now(), s.fragment_id, decode(s.hex_chunk, 'hex'), s.start_, s.end_,s.length_, auth.uid())
    returning t.*
)

select * from merged;

delete from tmp_chunks_insert where true;
end;
$$;

-- Vectors

drop function if exists insert_into_vectors;

create function insert_into_vectors() returns setof vectors language plpgsql security invoker as $$
begin  return query with merged as (
    merge into vectors t
    using tmp_vectors_insert s
    on t.chunk_id = s.chunk_id --We dont revectorize an existing chunk
    when matched then do nothing
    when not matched by target then insert (id, created_at, chunk_id, embeddings, user_id) values 
    (gen_random_uuid(), now(), s.chunk_id, s.embeddings, auth.uid())
    returning t.*
)

select * from merged;

delete from tmp_vectors_insert where true;
end;
$$;

-- Matches

drop function if exists insert_into_matches;

create function insert_into_matches () returns setof matches language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into matches t
        using tmp_matches_insert s
        on t.question_id = s.question_id and t.created_at = now()
        when matched then do nothing
        when not matched by target then insert (id, created_at, question_id,  user_id) values 
        (gen_random_uuid(), now(), s.question_id, auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_matches_insert where true;
end;
$$;

-- Questions matchings chunks

drop function if exists insert_into_questions_matching_chunks;

create function insert_into_questions_matching_chunks () returns setof questions_matching_chunks language plpgsql security invoker as $$
begin

    insert into tmp_matches_insert (id, created_at, question_id, user_id)
    select (gen_random_uuid(), now(), question_id, user_id) from tmp_questions_matching_chunks_stg;

    insert into tmp_questions_matching_chunks_insert (id, created_at, match_id, chunk_id, user_id)
    select (gen_random_uuid(), created_at, match_id, chunk_id, user_id) from
    (select m.created_at,m.match_id, qmc.chunk_id, qmc.user_id from tmp_questions_matching_chunks_stg as qmc join (select id as match_id, question_id from tmp_matches_insert) as m on qmc.match_id = m.match_id) as qmc;

     merge into matches t
        using tmp_matches_insert s
        on t.question_id = s.question_id and t.created_at = s.created_at
        when matched then do nothing
        when not matched by target then insert (id, created_at, question_id,  user_id) values 
        (s.id, s.created_at, s.question_id, auth.uid());

    -- Perform the merge operation
    return query
    with merged as (
        merge into questions_matching_chunks t
        using tmp_questions_matching_chunks_insert s
        on t.modified_question_id = s.modified_question_id and t.chunk_id = s.chunk_id -- One row
        when matched then do nothing
        when not matched by target then insert (id, created_at, modified_question_id, chunk_id, user_id) values 
        (s.id, s.created_at, s.modified_question_id, s.chunk_id, auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_questions_matching_chunks_insert where true;
    delete from tmp_questions_matching_chunks_stg where true;
    delete from tmp_matches_insert where true;
end;
$$;

-- Modified questions

drop function if exists insert_into_modified_questions;

create function insert_into_modified_questions () returns setof modified_questions language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into modified_questions t
        using tmp_modified_questions_insert s
        on t.match_id = s.match_id and t.created_at = now()
        when matched then do nothing
        when not matched by target then insert (id, created_at, match_id, modified_question, user_id) values 
        (gen_random_uuid(), now(), s.match_id, decode(s.hex_modified_question, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_modified_questions_insert where true;
end;
$$;

-- Answsers

drop function if exists insert_into_answers;

create function insert_into_answers () returns setof answers language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into answers t
        using tmp_answers_insert s
        on t.modified_question_id = s.modified_question_id and t.created_at = now()
        when matched then do nothing
        when not matched by target then insert (id, created_at, modified_question_id, answer, user_id) values 
        (gen_random_uuid(), now(), s.modified_question_id, decode(s.hex_answer, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_answers_insert where true;
end;
$$;
