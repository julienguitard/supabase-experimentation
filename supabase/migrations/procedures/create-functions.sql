-- Links

drop function if exists insert_into_links;
drop function if exists update_into_links;
drop function if exists delete_into_links;

create function insert_into_links() returns setof links 
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into links t
        using links_insert_buffer s
        on t.url = s.url
        when matched then do nothing
        when not matched by target then insert (id, created_at, url, category, user_id) values 
        (gen_random_uuid(), now(), s.url, s.category, auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from links_insert_buffer where true;
end;
$$ ;

create function update_into_links() returns setof links
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into links t
        using links_update_buffer s
        on t.id = s.id 
        when matched then update set category = s.category
        when not matched then do nothing
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from links_update_buffer where true;
end;
$$;

create  function delete_into_links() returns setof links
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation and capture deleted rows
    return query
    with merged as (
        merge into links t
        using links_delete_buffer s
        on t.id = s.id 
        when matched then delete
        when not matched then do nothing
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from links_delete_buffer where true;
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
        using contents_insert_buffer s
        on t.link_id = s.link_id and t.created_at = now() -- A link can be scraped multiple times
        when matched then do nothing
        when not matched by target then insert (id, created_at, link_id, status, content, error, user_id) values 
        (gen_random_uuid(), now(), s.link_id, s.status, decode(s.hex_content, 'hex'), decode(s.hex_error, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from contents_insert_buffer where true;
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
        using summaries_insert_buffer s
        on t.content_id = s.content_id AND t.created_at = now()
        when matched then do nothing
        when not matched by target then insert (id, created_at, content_id, summary, user_id) values 
        (gen_random_uuid(), now(), s.content_id, decode(s.hex_summary, 'hex'),auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from summaries_insert_buffer where true;
end;
$$;

-- Questions

drop function if exists insert_into_questions;

create function insert_into_questions () returns setof questions language plpgsql security invoker as $$
begin  return query with merged as (
    merge into questions t
    using questions_insert_buffer s
    on t.question = decode(s.hex_question, 'hex')
    when matched then do nothing
    when not matched by target then insert (id, created_at, question, user_id) values 
    (gen_random_uuid(), now(), decode(s.hex_question, 'hex'), auth.uid())
    returning t.*
)
    select * from merged;

    delete from questions_insert_buffer where true;
end;
$$;

drop function if exists update_into_questions; -- TODO check the usefulness of this function

create function update_into_questions () returns setof questions language plpgsql security invoker as $$
begin  return query with merged as (
    merge into questions t
    using questions_update_buffer s
    on t.id = s.id 
    when matched then do nothing -- TODO check the usefulness of this function
    when not matched then do nothing
    returning t.*
)
    select * from merged;

    delete from questions_update_buffer where true;
end;
$$;

drop function if exists delete_into_questions;

create function delete_into_questions () returns setof questions language plpgsql security invoker as $$
begin  return query with merged as (
    merge into questions t
    using questions_delete_buffer s
    on t.id = s.id 
    when matched then delete
    when not matched then do nothing
    returning t.*
)
    select * from merged;


delete from questions_delete_buffer where true;
end;
$$;


-- Fragments

drop function if exists insert_into_fragments;

create function insert_into_fragments () returns setof fragments language plpgsql security invoker as $$
begin  return query with merged as (
    merge into fragments t
    using fragments_insert_buffer s
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
   
delete from fragments_insert_buffer where true;
end;
$$;


drop function if exists insert_into_fragments_from_entities;

create function insert_into_fragments_from_entities() returns setof fragments language plpgsql security invoker as $$
begin  return query with merged as (
    merge into fragments t
    using entities_to_fragment s
    on t.source_table = s.source_table
    and t.source_column = s.source_column
    and t.source_id = s.source_id
    when matched then do nothing
    when not matched by target then insert (id, created_at, source_table, source_column, source_id, user_id) values 
    (gen_random_uuid(), now(), s.source_table, s.source_column, s.source_id, auth.uid())
    returning t.*
)
    select * from merged;
    
end;
$$;

-- Chunks

drop function if exists insert_into_chunks;

create function insert_into_chunks () returns setof chunks language plpgsql security invoker as $$
begin  return query with merged as (
    merge into chunks t
    using chunks_insert_buffer s
    on t.fragment_id = s.fragment_id -- We dont rechunk an existing fragment
    when matched then do nothing
    when not matched by target then insert (id, created_at, fragment_id, chunk, start_, end_, length_, user_id) values 
    (gen_random_uuid(), now(), s.fragment_id, decode(s.hex_chunk, 'hex'), s.start_, s.end_,s.length_, auth.uid())
    returning t.*
)

select * from merged;

delete from chunks_insert_buffer where true;
end;
$$;

-- Vectors

drop function if exists insert_into_vectors;

create function insert_into_vectors() returns setof vectors language plpgsql security invoker as $$
begin  return query with merged as (
    merge into vectors t
    using vectors_insert_buffer s
    on t.chunk_id = s.chunk_id --We dont revectorize an existing chunk
    when matched then do nothing
    when not matched by target then insert (id, created_at, chunk_id, embeddings, user_id) values 
    (gen_random_uuid(), now(), s.chunk_id, s.embeddings, auth.uid())
    returning t.*
)

select * from merged;

delete from vectors_insert_buffer where true;
end;
$$;

-- Matches (this function is not used in the pipeline, just for reference)

drop function if exists insert_into_matches;

create function insert_into_matches () returns setof matches language plpgsql security invoker as $$ 
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into matches t
        using matches_insert_buffer s
        on t.question_id = s.question_id and t.created_at = now()
        when matched then do nothing
        when not matched by target then insert (id, created_at, question_id,  user_id) values 
        (gen_random_uuid(), now(), s.question_id, auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from matches_insert_buffer where true;
end;
$$;

-- Questions matchings chunks

drop function if exists insert_into_various_from_questions_to_answer_with_chunks_agg;

create function insert_into_various_from_questions_to_answer_with_chunks_agg () returns setof matches_with_question_chunks_select_buffer  language plpgsql security invoker as $$ --TODO
begin
        insert into
        matches_insert_buffer (id, created_at, question_id, user_id)
        select
        gen_random_uuid (), now(), question_id, user_id
        from
        (
            select distinct
            id as question_id,
            user_id
            from
            questions_to_answer_with_chunks
        );

        insert into
        questions_matching_chunks_insert_buffer (
            id,
            created_at,
            match_id,
            chunk_id,
            user_id
        )
        select
            gen_random_uuid (),
            now(),
            m.id,
            qac.chunk_id,
            m.user_id
            from
            matches_insert_buffer m
            join (
                select
                id as question_id,
                chunk_id
                from
                questions_to_answer_with_chunks
                where chunk_id is not null
            ) qac using (question_id);

        insert into matches (id, created_at, question_id, user_id)
        select id, created_at, question_id, user_id from matches_insert_buffer;

        insert into questions_matching_chunks (id, created_at, match_id, chunk_id, user_id)
        select id, created_at, match_id, chunk_id, user_id from questions_matching_chunks_insert_buffer;

        return query with
        selected as (
           select * from matches_with_question_chunks_select_buffer
        )
        select
        *
        from
        selected;


        delete from questions_matching_chunks_insert_buffer
        where
        true;

        delete from matches_insert_buffer
        where
        true;

end;
$$;



-- Modified questions

drop function if exists insert_into_modified_questions; --TODO not sure this function is needed

create function insert_into_modified_questions () returns setof modified_questions language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into modified_questions t
        using modified_questions_insert_buffer s
        on t.match_id = s.match_id and t.created_at = now()
        when matched then do nothing
        when not matched by target then insert (id, created_at, match_id, modified_question, user_id) values 
        (gen_random_uuid(), now(), s.match_id, decode(s.hex_modified_question, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from modified_questions_insert_buffer where true;
end;
$$;

drop function if exists insert_into_modified_questions_with_chunks_agg;

create function insert_into_modified_questions_with_chunks_agg() returns setof modified_questions_with_chunks_select_buffer language plpgsql security invoker as $$
begin

      insert into
        modified_questions (
          id,
          created_at,
          match_id,
          modified_question,
          user_id
        )
      select
        gen_random_uuid(),
        now(),
        match_id,
        decode(hex_modified_question, 'hex'),
        auth.uid()
      from
        modified_questions_insert_buffer;

      return query
      with
        selected as (
          select
            *
          from
            modified_questions_with_chunks_select_buffer
        )
      select
        *
      from
        selected;

      delete from modified_questions_insert_buffer
      where
        true;


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
        using answers_insert_buffer s
        on t.modified_question_id = s.modified_question_id and t.created_at = now()
        when matched then do nothing
        when not matched by target then insert (id, created_at, modified_question_id, answer, user_id) values 
        (gen_random_uuid(), now(), s.modified_question_id, decode(s.hex_answer, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from answers_insert_buffer where true;
end;
$$;
