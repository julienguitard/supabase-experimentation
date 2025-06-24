CREATE OR REPLACE FUNCTION curl_logs_insert() RETURNS curl_logs
AS $$
select
  gen_random_uuid() AS id,
  NOW() AS created_at,
  url_id,
  CAST(status AS TEXT) AS status,
  CAST(content AS TEXT) AS content
from
  (
    select
      url_id,
      (http_get(url)).*

    from
      (
        select
          id::uuid AS url_id,
          url
        from
          links
        order by
          random()
        limit
          5
      )
  );
SELECT * FROM curl_logs LIMIT 1
$$ language SQL;

SELECT * FROM cron.schedule('0 * * * *',$$ SELECT * FROM curl_logs_insert() $$);

