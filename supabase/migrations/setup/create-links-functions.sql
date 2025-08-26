drop function if exists insert_into_links;
drop function if exists update_into_links;
drop function if exists delete_into_links;

create or replace function insert_into_links() returns setof links 
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into links t
        using tmp_links_insert s
        on t.url = s.url
        when matched then do nothing
        when not matched by target then insert (id, created_at, url, category, user_id) values 
        (gen_random_uuid(), now(), s.url, s.category, auth.uid())
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_links_insert where true;
end;
$$ ;

create or replace function update_into_links() returns setof links
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation
    return query
    with merged as (
        merge into links t
        using tmp_links_update s
        on t.id = s.id 
        when matched then update set category = s.category
        when not matched then do nothing
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_links_update where true;
end;
$$;

create or replace function delete_into_links() returns setof links
language plpgsql
security invoker
as $$
begin
    -- Perform the merge operation and capture deleted rows
    return query
    with merged as (
        merge into links t
        using tmp_links_delete s
        on t.id = s.id 
        when matched then delete
        when not matched then do nothing
        returning t.*
    )
    select * from merged;
    
    -- Clean up the tmp table
    delete from tmp_links_delete where true;
end;
$$;
