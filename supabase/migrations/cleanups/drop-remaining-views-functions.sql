do $$
declare
    drop_stmt text;
begin
    for drop_stmt in
        select 'drop view if exists ' || quote_ident(table_name) || ' cascade;'
        from information_schema.tables
        where table_schema = 'public'
          and table_type = 'VIEW'
    loop
        begin
            execute drop_stmt;
        exception
            when others then
                raise warning 'failed to drop view: %', sqlerrm;
        end;
    end loop;
end;
$$ language plpgsql;

do $$
declare
    drop_stmt text;
begin
    for drop_stmt in
        select 'drop function if exists ' || quote_ident(routine_name) || ' cascade;'
        from information_schema.routines
        where routine_schema = 'public'
    loop
        begin
            execute drop_stmt;
        exception
            when others then
                raise warning 'failed to drop function: %', sqlerrm;
        end;
    end loop;
end;
$$ language plpgsql;