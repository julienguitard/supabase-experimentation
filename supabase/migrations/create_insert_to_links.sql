CREATE OR REPLACE FUNCTION insert_into_links(TEXT, TEXT) RETURNS links
AS
$$
INSERT INTO links 
SELECT gen_random_uuid() AS id, NOW() As created_at, $1 AS url, $2 AS category;
SELECT * FROM links ORDER BY created_at DESC LIMIT 1
$$ language SQL