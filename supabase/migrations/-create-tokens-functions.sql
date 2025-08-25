drop function if exists insert_tokens;

create function insert_tokens() returns setof tokens language plpgsql security invoker as $$
begin  return query with merged as (
    merge into tokens t
    using tmp_tokens_insert s
    on t.fragment_id = s.fragment_id
    when matched then do nothing
    when not matched by target then insert values (s.id, now(), s.fragment_id, auth.uid())
    returning t.*
)

select * from merged;

delete from tmp_tokens_insert where true;
end;
$$;