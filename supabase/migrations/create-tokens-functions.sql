create or replace function insert_tokens() returns setof tokens language plpgsql security definer as $$
begin  return query with merged as (
    merge into tokens t
    using tmp_tokens_insert s
    on t.fragment_id = s.fragment_id
    when matched then do nothing
    when not matched by target then insert values (s.id, now(), s.fragment_id)
    returning t.*
)
delete from tmp_tokens_insert where true;
end;
$$;