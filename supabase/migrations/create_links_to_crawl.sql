CREATE OR REPLACE VIEW links_to_crawl AS (
select
  id,
  created_at,
  url,
  category
from
  (
    select
      *,
      case
        when c.id is not null then 1
        else 0
      end as crawled
    from
      links l
      left join (
        select distinct
          url_id as id
        from
          curl_logs
          where status = 200 
          and content is not null 
          and TIMESTAMP_DIFF(created_at, crawled_at, DAY) > 30
      ) c using (id)
  )
where
  crawled = 0);