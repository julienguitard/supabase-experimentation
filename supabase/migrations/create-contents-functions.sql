CREATE OR REPLACE FUNCTION insert_http_into_contents() 
RETURNS SETOF contents 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Perform the merge operation to insert HTTP responses into contents table
    RETURN QUERY
    WITH inserted AS (
        INSERT INTO contents (
            id, 
            created_at, 
            link_id, 
            status, 
            content
        )
        SELECT
            gen_random_uuid() AS id,         -- Generate a new UUID for the log entry
            NOW() AS created_at,             -- Current timestamp for log creation
            link_id,                         -- The ID of the link being checked
            CAST(status AS BIGINT),          -- HTTP status as BIGINT
            CAST(content AS bytea) AS content -- HTTP response content as TEXT
        FROM (
            SELECT
                link_id,
                (http_get(url)).*            -- Perform HTTP GET and expand result columns (status, content, etc.)
            FROM (
                SELECT
                    id::uuid AS link_id,     -- Get the link's UUID
                    url                      -- Get the link's URL
                FROM
                    links_to_crawl
                ORDER BY
                    random()                 -- Randomize the order of links
                LIMIT 5                      -- Limit to 5 links per run
            ) AS sub_links
        ) AS sub_http
    )
    SELECT * FROM inserted;
END;
$$;

CREATE OR REPLACE FUNCTION insert_into_contents() RETURNS SETOF contents
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Perform the merge operation
    RETURN QUERY
    WITH merged AS (
        MERGE INTO contents t
        USING tmp_contents_insert s
        ON t.link_id = s.link_id AND t.created_at = s.created_at
        WHEN MATCHED THEN DO NOTHING
        WHEN NOT MATCHED BY TARGET THEN INSERT VALUES (gen_random_uuid(), NOW(), s.link_id, s.status, s.status, s.content::bytea)
        RETURNING t.*
    )
    SELECT * FROM merged;
    
    -- Clean up the tmp table
    DELETE FROM tmp_contents_insert WHERE TRUE;
END;
$$;


