-- Schedule the function to run every hour at minute 0 using pg_cron
select * from cron.schedule(
  '0 0 * * 0',                      -- Cron expression: every Sunday at midnight GMT
  $$ select * from insert_http_into_contents() $$
);
