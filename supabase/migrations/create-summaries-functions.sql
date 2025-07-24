CREATE OR REPLACE FUNCTION insert_into_summaries() RETURNS SETOF summaries
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Perform the merge operation to insert HTTP responses into contents table
    RETURN QUERY
    WITH merged AS (
        INSERT INTO summaries (
            id, 
            created_at,
            content_id,
            summary
        )
        SELECT
            gen_random_uuid() AS id,
            NOW() AS created_at,
            content_id,
            CAST(summary AS bytea) AS summary
        FROM
            tmp_summaries_insert
        WHERE
            false
    )
    SELECT * FROM merged;

    -- Clean up the tmp table
    DELETE FROM tmp_summaries_insert WHERE TRUE;
END;
$$;