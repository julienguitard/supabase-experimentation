drop function if exists insert_http_into_contents;


create function insert_http_into_contents() 
returns setof contents 
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation to insert HTTP responses into contents table
    return query
    with inserted as (
        insert into contents (
            id, 
            created_at, 
            link_id, 
            status, 
            content,
            user_id,
        )
        select
            gen_random_uuid() as id,         -- Generate a new UUID for the log entry
            now() as created_at,             -- Current timestamp for log creation
            link_id,                         -- The ID of the link being checked
            cast(status as bigint),          -- HTTP status as BIGINT
            cast(content as bytea) as content, -- HTTP response content as TEXT
            auth.uid() as user_id
        from (
            select
                link_id,
                (http_get(url)).*            -- Perform HTTP GET and expand result columns (status, content, etc.)
            from (
                select
                    id::uuid as link_id,     -- Get the link's UUID
                    url                      -- Get the link's URL
                from
                    links_to_scrape
                order by
                    random()                 -- Randomize the order of links
                limit 5                      -- Limit to 5 links per run
            ) as sub_links
        ) as sub_http
    )
    select * from inserted;
end;
$$;

drop function if exists insert_into_contents;

create  function insert_into_contents() returns setof contents
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into contents t
        using tmp_contents_insert s
        on t.link_id = s.link_id and t.created_at = now() -- A link can be scraped multiple times
        when matched then do nothing
        when not matched by target then insert (id, created_at, link_id, status, content, error, user_id) values 
        (gen_random_uuid(), now(), s.link_id, s.status, decode(s.hex_content, 'hex'), decode(s.hex_error, 'hex'), auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_contents_insert where true;
end;
$$;


