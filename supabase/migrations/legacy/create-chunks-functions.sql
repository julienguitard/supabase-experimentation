

drop function if exists insert_into_chunks;

create function insert_into_chunks () returns setof chunks language plpgsql security invoker as $$
begin  return query with merged as (
    merge into chunks t
    using tmp_chunks_insert s
    on t.fragment_id = s.fragment_id -- We dont rechunk an existing fragment
    when matched then do nothing
    when not matched by target then insert (id, created_at, fragment_id, chunk, start_, end_, length_, user_id) values 
    (gen_random_uuid(), now(), s.fragment_id, decode(s.hex_chunk, 'hex'), s.start_, s.end_,s.length_, auth.uid())
    returning t.*
)

select * from merged;

delete from tmp_chunks_insert where true;
end;
$$;

