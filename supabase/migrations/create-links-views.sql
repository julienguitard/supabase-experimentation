-- Drop views
drop view if exists links_to_crawl cascade;

-- Create view to find links that haven't been crawled yet
create view links_to_crawl with (security_invoker = on) as (
-- Query to find links that haven't been crawled yet
select
  id,
  created_at,
  url,
  category,
  user_id
from
  (
    select
      l.id,
      l.created_at,
      l.url,
      l.category,
      l.user_id,
      case
        when c.id is not null then 1
        else 0
      end as crawled
    from
      links l
      left join (
        select distinct
          contents.link_id as id
        from
          contents
        where
          status = 200 -- Only consider successful HTTP responses
          and (
            extract(
              epoch
              from
                now()
            ) - extract(
              epoch
              from
                (created_at)
            )
          ) < 86400 -- Only consider links that haven't been crawled in the last 24 hours
      ) c using (id)
  ) as uncrawled_links
where
  crawled = 0 -- Only consider links that haven't been crawled yet
);

-- Create a shorter view to find a random link that hasn't been crawled yet, for scalability
create view tmp_links_to_crawl
with
  (security_invoker = on) as (
    select
      *
    from
      links_to_crawl
    order by
      random()
    limit
      1 -- Todo  remove limit
  );