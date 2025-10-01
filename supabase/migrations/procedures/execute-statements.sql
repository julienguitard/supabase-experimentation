drop function if exists execute_done_counts_statements cascade;

create function execute_done_counts_statements() returns table(
    table_name TEXT,
    created_at TIMESTAMPTZ,
    cnt BIGINT
)
language plpgsql
security invoker
as $$
declare
statement_ text;
begin
  SELECT * INTO STRICT statement_ FROM done_counts_statements_views;
 return query execute statement_;
end;
$$;

drop function if exists execute_todos_counts_statements cascade;

create function execute_todos_counts_statements() returns table(
    table_name TEXT,
    cnt BIGINT
)
language plpgsql
security invoker
as $$
declare
statement_ text;
begin
  SELECT * INTO STRICT statement_ FROM todos_counts_statements_views;
 return query execute statement_;
end;
$$;


