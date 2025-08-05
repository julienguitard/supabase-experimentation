CREATE OR REPLACE VIEW links_to_crawl AS (
-- Query to find links that haven't been crawled yet
select
  id,
  created_at,
  url,
  category
from
  (
    select
      l.id,
      l.created_at,
      l.url,
      l.category,
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
          status = 200
          and (
            EXTRACT(
              EPOCH
              from
                NOW()
            ) - EXTRACT(
              EPOCH
              from
                (created_at)
            )
          ) < 86400
      ) c using (id)
  ) as uncrawled_links
where
  crawled = 0);

CREATE OR REPLACE VIEW tmp_links_to_crawl AS (
    SELECT * FROM links_to_crawl ORDER BY RANDOM() LIMIT 1);--TODO  remove limit