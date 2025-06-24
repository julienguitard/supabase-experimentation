create table public.links (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  url text not null,
  category text null,
  constraint links_pkey primary key (id),
  constraint links_url_key unique (url)
) TABLESPACE pg_default;