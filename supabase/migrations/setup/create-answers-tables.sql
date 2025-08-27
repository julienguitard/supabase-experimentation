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