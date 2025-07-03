-- Create a table to store logs of curl requests
create table public.curl_logs (
  id uuid not null default gen_random_uuid (), -- Unique identifier for each log entry
  created_at timestamp with time zone not null default now(), -- Timestamp when the log was created
  url_id uuid null default gen_random_uuid (), -- Reference to the related URL in the links table
  status text null, -- Status of the curl request (e.g., HTTP status code or custom status)
  content text null, -- Content or response body from the curl request
  constraint curl_logs_pkey primary key (id), -- Primary key constraint on id
  constraint curl_logs_url_id_fkey foreign KEY (url_id) references links (id) -- Foreign key constraint referencing links table
) TABLESPACE pg_default;