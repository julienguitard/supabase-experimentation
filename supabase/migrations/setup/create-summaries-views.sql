drop views if exists denormalized_summaries cascade;
drop views if exists latest_summaries cascade;

create view denormalized_summaries
with
  (security_invoker = on) as (
    select
      s.id,
      s.created_at,
      s.summary,
      s.user_id,
      dc.content_id,
      dc.content_created_at,
      dc.content,
      dc.url,
      dc.category,
      dc.status
    from
      summaries s
      join (
        select
          id as content_id,
          created_at as content_created_at,
          content,
          url,
          category,
          status
        from
          denormalized_contents
      ) dc using (content_id)
  );

create view latest_summaries
with
  (security_invoker = on) as (
    select
      *
    from
      (
        select
          id,
          created_at,
          summary,
          user_id,
          content_id,
          content_created_at,
          url,
          category,
          status,
          row_number() over (
            partition by
              content_id
            order by
              created_at desc
          ) as created_at_rank
        from
          denormalized_summaries
      )
    where
      created_at_rank = 1
  );