drop function if exists insert_into_questions;

create function insert_into_questions () returns setof questions language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into questions t
        using tmp_questions_insert s
        on t.question = decode(s.hex_question, 'hex')
        when matched then do nothing
        when not matched by target then insert values
        (gen_random_uuid(), now(),decode(s.hex_question, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_questions_insert where true;
end;
$$;