drop view if exists tmp_contents_to_summarize cascade;
drop view if exists contents_to_summarize cascade;
drop view if exists denormalized_contents cascade;


create view denormalized_contents with (security_invoker = on) as (
  select
    c.id,
    c.created_at,
    c.status,
    c.content,
    c.user_id,
    l.url,
    l.category
  from
    contents c
    left join links l on c.link_id = l.id
);

create view contents_to_summarize with (security_invoker = on) as (
  -- Query to find contents that haven't been summarized yet
  select
    id,
    created_at,
    encode(content,'hex') as hex_content,
    category,
    user_id
  from
    (
      select
        c.id,
        c.created_at,
        c.content,
        c.category,
        c.user_id,
        case
          when s.id is not null then 1
          else 0
        end as summarized
      from
        (
          select
            *
          from
            denormalized_contents
          where
            status = 200
        ) c
        left join (
          select distinct
            summaries.content_id as id
          from
            summaries
        ) s using (id)
    ) as unsummarized_contents
  where
    summarized = 0
);

create view tmp_contents_to_summarize with (security_invoker = on) as (
  select
    *
  from
    contents_to_summarize
  order by
    random()
  limit
    2
);