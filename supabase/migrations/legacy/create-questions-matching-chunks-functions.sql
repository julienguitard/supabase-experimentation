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