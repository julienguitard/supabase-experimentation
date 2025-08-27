drop view if exists tmp_questions;

create view tmp_questions with (security_invoker = on) as (
  select * from questions order by random() limit 3
);