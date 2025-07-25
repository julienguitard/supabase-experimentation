CREATE OR REPLACE VIEW links_to_crawl AS (
-- Query to find links that haven't been crawled yet
SELECT
    id,
    created_at,
    url,
    category
FROM (
    SELECT
        l.id,
        l.created_at,
        l.url,
        l.category,
        CASE
            WHEN c.id IS NOT NULL THEN 1
            ELSE 0
        END AS crawled
    FROM
        links l
        LEFT JOIN (
            SELECT DISTINCT
                contents.link_id AS id
            FROM
                contents
        ) c USING (id)
) AS uncrawled_links
WHERE
    crawled = 0);

CREATE OR REPLACE VIEW tmp_links_to_crawl AS (
    SELECT * FROM links_to_crawl ORDER BY RANDOM() LIMIT 1);--TODO  remove limit