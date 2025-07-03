-- Function to insert curl log entries for 5 random links every hour
CREATE OR REPLACE FUNCTION curl_logs_insert()
RETURNS curl_logs
AS $$
  SELECT
    gen_random_uuid() AS id,         -- Generate a new UUID for the log entry
    NOW() AS created_at,             -- Current timestamp for log creation
    url_id,                          -- The ID of the link being checked
    CAST(status AS TEXT) AS status,  -- HTTP status as text
    CAST(content AS TEXT) AS content -- HTTP response content as text
  FROM (
    SELECT
      url_id,
      (http_get(url)).*              -- Perform HTTP GET and expand result columns (status, content, etc.)
    FROM (
      SELECT
        id::uuid AS url_id,          -- Get the link's UUID
        url                          -- Get the link's URL
      FROM
        links
      ORDER BY
        random()                     -- Randomize the order of links
      LIMIT 5                        -- Limit to 5 links per run
    ) AS sub_links
  ) AS sub_http;
  SELECT * FROM curl_logs LIMIT 1;   -- Dummy select to satisfy RETURNS requirement
$$ LANGUAGE SQL;

-- Schedule the function to run every hour at minute 0 using pg_cron
SELECT * FROM cron.schedule(
  '0 * * * *',                      -- Cron expression: every hour at minute 0
  $$ SELECT * FROM curl_logs_insert() $$
);
