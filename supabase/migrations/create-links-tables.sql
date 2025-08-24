create table links (
  id uuid not null default gen_random_uuid (), -- Unique identifier for each link, generated automatically
  created_at timestamp with time zone not null default now(), -- Timestamp when the link was created
  url text not null, -- The actual URL being stored
  category text null, -- Optional category for the link
  user_id uuid not null, -- User ID of the link owner
  constraint links_pkey primary key (id), -- Primary key constraint on id
  constraint links_user_id_fkey foreign key (user_id) references auth.users (id),
  constraint links_url_key unique (url) -- Ensures each URL is unique
) TABLESPACE pg_default; -- Use the default tablespace


-- Temporary tables for insert, update, and delete operations acting as a buffer between the API and the database

drop table if exists tmp_links_insert; 

create table tmp_links_insert as (
  select
    *
  from
    links
  where
    false
);

drop table if exists tmp_links_update;

create table tmp_links_update as (
  select
    *
  from
    links
  where
    false
);

drop table if exists tmp_links_delete;

create table tmp_links_delete as (
  select
    *
  from
    links
  where
    false
);