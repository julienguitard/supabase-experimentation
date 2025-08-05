create or replace view denormalized_contents as (
  select
    c.id,
    c.created_at,
    c.status,
    c.content,
    l.url,
    l.category
  from
    contents c
    left join links l on c.link_id = l.id
);

create or replace view contents_to_summarize as (
  -- Query to find contents that haven't been summarized yet
  select
    id,
    created_at,
    encode(content,'hex') AS hex_content,
    category
  from
    (
      select
        c.id,
        c.created_at,
        c.content,
        c.category,
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

create or replace view tmp_contents_to_summarize as (
  select
    *
  from
    contents_to_summarize
  order by
    RANDOM()
  limit
    2
);