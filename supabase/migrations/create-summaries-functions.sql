drop function if exists insert_into_summaries;

create function insert_into_summaries () returns setof summaries language plpgsql security invoker as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into summaries t
        using tmp_summaries_insert s
        on t.content_id = s.content_id
        when matched then do nothing
        when not matched by target then insert values 
        (gen_random_uuid(), now(), s.content_id, decode(s.hex_summary, 'hex'),auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_summaries_insert where true;
end;
$$;