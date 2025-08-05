drop function if exists insert_into_summaries;

create function insert_into_summaries () RETURNS SETOF summaries LANGUAGE plpgsql SECURITY DEFINER as $$
BEGIN
    -- Perform the merge operation
    RETURN QUERY
    WITH merged AS (
        MERGE INTO summaries t
        USING tmp_summaries_insert s
        ON t.content_id = s.content_id
        WHEN MATCHED THEN DO NOTHING
        WHEN NOT MATCHED BY TARGET THEN INSERT VALUES 
        (gen_random_uuid(), NOW(), s.content_id, decode(s.hex_summary, 'hex'))
        RETURNING t.*
    )
    SELECT * FROM merged;
    
    -- Clean up the tmp table
    DELETE FROM tmp_summaries_insert WHERE TRUE;
END;
$$;