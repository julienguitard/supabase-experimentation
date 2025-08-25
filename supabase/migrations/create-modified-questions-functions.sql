drop function if exists insert_into_modified_questions;

create function insert_into_modified_questions () returns setof modified_questions language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into modified_questions t
        using tmp_modified_questions_insert s
        on t.question_id = s.question_id and t.create_at = now()
        when matched then do nothing
        when not matched by target then insert values 
        (gen_random_uuid(), now(), s.question_id, decode(s.hex_modified_question, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_modified_questions_insert where true;
end;
$$;