do $$
declare
    drop_stmt text;
begin
    for drop_stmt in
        select 'drop table if exists ' || quote_ident(table_name) || ' cascade;'
        from information_schema.tables
        where table_schema = 'public'
         and table_name like '%backup'
    loop
        begin
            execute drop_stmt;
        exception
            when others then
                raise warning 'failed to drop table: %', sqlerrm;
        end;
    end loop;
end;
$$ language plpgsql;