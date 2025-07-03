create table public.links (
  id uuid not null default gen_random_uuid (), -- Unique identifier for each link, generated automatically
  created_at timestamp with time zone not null default now(), -- Timestamp when the link was created
  url text not null, -- The actual URL being stored
  category text null, -- Optional category for the link
  constraint links_pkey primary key (id), -- Primary key constraint on id
  constraint links_url_key unique (url) -- Ensures each URL is unique
) TABLESPACE pg_default; -- Use the default tablespace