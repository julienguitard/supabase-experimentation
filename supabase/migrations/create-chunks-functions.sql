drop function if exists insert_chunks;

create function insert_chunks() returns setof chunks language plpgsql security invoker as $$
begin  return query with merged as (
    merge into chunks t
    using tmp_chunks_insert s
    on t.fragment_id = s.fragment_id
    when matched then do nothing
    when not matched by target then insert values (s.id, now(), s.fragment_id, decode(s.hex_content, 'hex'), s.start_, s.end_, auth.uid())
    returning t.*
)
delete from tmp_chunks_insert where true;
end;
$$;
