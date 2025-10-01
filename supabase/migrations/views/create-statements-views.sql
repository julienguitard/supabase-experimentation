drop view if exists done_counts_statements_views cascade;

create view done_counts_statements_views with (security_invoker = on) as (
select
  'select * from (' || array_to_string(array_agg(statement_), ' union all ') || ') order by table_name,created_at desc'
from
  (
    select
      format(
        'select %L as table_name, created_at, cnt from (
  select created_at, count(id) AS cnt from %s group by created_at)',
        table_name,
        table_name
      ) as statement_
    from
      information_schema.tables
    where
      table_schema = 'public'
      and table_type = 'BASE TABLE'
      and not (table_name like '%buffer%')
  ));

drop view if exists todos_counts_statements_views cascade;

create view todos_counts_statements_views with (security_invoker = on) as (
select
  array_to_string(array_agg(statement_), ' union all ')
from
  (
    select
      format(
        'select %L as table_name, count(*) as cnt from %s',
        table_name,
        table_name
      ) as statement_
    from
      information_schema.tables
    where
      table_schema = 'public'
      and table_type = 'VIEW'
      and table_name like '%\_to\_%'
      and not (table_name like '%buffer%')
      and not (table_name like '%extract%')
  ));