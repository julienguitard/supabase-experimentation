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
