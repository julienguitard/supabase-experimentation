-- Create a table to store logs of curl requests
drop function if exists insert_http_into_contents;

drop function if exists insert_into_contents;

drop table if exists public.contents;

create table public.contents (
  id uuid not null default gen_random_uuid (), -- Unique identifier for each log entry
  created_at timestamp with time zone not null default now(), -- Timestamp when the log was created
  link_id uuid null default gen_random_uuid (), -- Reference to the related URL in the links table
  status int8 null, -- Status of the curl request (e.g., HTTP status code or custom status)
  content bytea null, -- Content or response body from the curl request
  constraint contents_pkey primary key (id), -- Primary key constraint on id
  constraint contents_link_id_fkey foreign KEY (link_id) references links (id) -- Foreign key constraint referencing links table
) TABLESPACE pg_default;

drop table if exists public.tmp_contents_insert;

create table tmp_contents_insert as (
  select
    id, created_at, link_id, status, '0afe' as hex_content
  from
    contents
  where
    false
);

