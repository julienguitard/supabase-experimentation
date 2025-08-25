drop function if exists insert_into_vectors;

create function insert_into_vectors() returns setof vectors language plpgsql security invoker as $$
begin  return query with merged as (
    merge into vectors t
    using tmp_vectors_insert s
    on t.chunk_id = s.chunk_id --We dont revectorize an existing chunk
    when matched then do nothing
    when not matched by target then insert values (gen_random_uuid(), now(), s.chunk_id, s.embeddings, auth.uid())
    returning t.*
)

select * from merged;

delete from tmp_vectors_insert where true;
end;
$$;