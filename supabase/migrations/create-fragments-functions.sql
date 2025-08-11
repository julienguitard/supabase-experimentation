create or replace function insert_fragments() returns setof fragments language plpgsql security definer as $$
begin  return query with merged as (
    merge into fragments t
    using tmp_fragments_insert s
    on t.source_table = s.source_table
    and t.source_column = s.source_column
    and t.source_id = s.source_id
    when matched then do nothing
    when not matched by target then insert values (gen_random_uuid(), now(), s.source_table, s.source_column, s.source_id)
    returning t.*
)
delete from tmp_fragments_insert where true;
end;
$$;
