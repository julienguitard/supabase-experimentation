-- Schedule the function to run every hour at minute 0 using pg_cron
SELECT * FROM cron.schedule(
  '0 0 * * 0',                      -- Cron expression: every Sunday at midnight GMT
  $$ SELECT * FROM insert_http_into_contents() $$
);
