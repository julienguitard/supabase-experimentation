create or replace function insert_vectors() returns setof vectors language plpgsql security definer as $$
begin  return query with merged as (
    merge into vectors t
    using tmp_vectors_insert s
    on t.chunk_id = s.chunk_id
    when matched then do nothing
    when not matched by target then insert values (gen_random_uuid(), now(), s.chunk_id, s.vector)
    returning t.*
)
delete from tmp_vectors_insert where true;
end;
$$;