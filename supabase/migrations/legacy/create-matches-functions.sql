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