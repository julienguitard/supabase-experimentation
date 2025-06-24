create table public.curl_logs (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  url_id uuid null default gen_random_uuid (),
  status text null,
  content text null,
  constraint curl_logs_pkey primary key (id),
  constraint curl_logs_url_id_fkey foreign KEY (url_id) references links (id)
) TABLESPACE pg_default;