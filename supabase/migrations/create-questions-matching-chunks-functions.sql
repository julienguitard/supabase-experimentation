drop function if exists insert_into_questions_matching_chunks;

create function insert_into_questions_matching_chunks () returns setof questions_matching_chunks language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into questions_matching_chunks t
        using tmp_questions_matching_chunks_insert s
        on t.modified_question_id = s.modified_question_id and t.chunk_id = s.chunk_id -- One row per modified question and chunk
        when matched then do nothing
        when not matched by target then insert values 
        (gen_random_uuid(), now(), s.modified_question_id, s.chunk_id, auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_questions_matching_chunks_insert where true;
end;
$$;