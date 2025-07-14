-- First, fix your existing functions (correct the DELETE statements)

CREATE OR REPLACE FUNCTION insert_into_links() RETURNS SETOF links AS $$
BEGIN
    -- Perform the merge operation
    RETURN QUERY
    WITH merged AS (
        MERGE INTO links t
        USING tmp_links_insert s
        ON t.url = s.url
        WHEN MATCHED THEN DO NOTHING
        WHEN NOT MATCHED BY TARGET THEN INSERT VALUES (gen_random_uuid(), NOW(), s.url, s.category)
        RETURNING t.*
    )
    SELECT * FROM merged;
    
    -- Clean up the tmp table
    DELETE FROM tmp_links_insert WHERE TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_into_links() RETURNS SETOF links AS $$
BEGIN
    -- Perform the merge operation
    RETURN QUERY
    WITH merged AS (
        MERGE INTO links t
        USING tmp_links_update s
        ON t.id = s.id 
        WHEN MATCHED THEN UPDATE SET category = s.category
        WHEN NOT MATCHED THEN DO NOTHING
        RETURNING t.*
    )
    SELECT * FROM merged;
    
    -- Clean up the tmp table
    DELETE FROM tmp_links_update WHERE TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_into_links() RETURNS SETOF links AS $$
BEGIN
    -- Perform the merge operation and capture deleted rows
    RETURN QUERY
    WITH merged AS (
        MERGE INTO links t
        USING tmp_links_delete s
        ON t.id = s.id 
        WHEN MATCHED THEN DELETE
        WHEN NOT MATCHED THEN DO NOTHING
        RETURNING t.*
    )
    SELECT * FROM merged;
    
    -- Clean up the tmp table
    DELETE FROM tmp_links_delete WHERE TRUE;
END;
$$ LANGUAGE plpgsql;
