drop view if exists tmp_fragments_to_chunk_with_content cascade;

drop view if exists tmp_fragments_to_chunk cascade;

drop view if exists tmp_fragments_to_check cascade;

drop view if exists fragments_to_chunk_with_content cascade;

drop view if exists fragments_to_chunk cascade;

drop view if exists fragments_to_check cascade;

create view fragments_to_check
with
  (security_invoker = on) as (
    select
      source_table,
      source_column,
      source_id,
      user_id
    from
      (
        select
          'contents' as source_table,
          'content' as source_column,
          id as source_id,
          user_id
        from
          contents
        union all
        select
          'summaries' as source_table,
          'summary' as source_column,
          id as source_id,
          user_id
        from
          summaries
      )
    except all
    select
      source_table,
      source_column,
      source_id,
      user_id
    from
      fragments
  );

create view fragments_to_chunk
with
  (security_invoker = on) as (
    select
      id,
      created_at,
      source_table,
      source_column,
      source_id,
      user_id
    from
      (
        select
          f.id,
          c.id as id_,
          f.created_at,
          f.source_table,
          f.source_column,
          f.source_id,
          f.user_id
        from
          fragments f
          left join (
            select distinct
              fragment_id as id
            from
              chunks
          ) c using (id)
      )
    where
      id_ is null
  );

create view fragments_to_chunk_with_content
with
  (security_invoker = on) as (
    select
      id,
      created_at,
      source_table,
      source_column,
      source_id,
      encode(fragment, 'hex') as hex_fragment,
      user_id
    from
      (
        select
          f.id,
          f.created_at,
          f.source_table,
          f.source_column,
          f.source_id,
          c.fragment,
          f.user_id
        from
          (
            select
              id as source_id,
              content as fragment,
              user_id
            from
              contents
          ) c
          join (
            select
              *
            from
              fragments_to_chunk
            where
              source_table = 'contents'
          ) f using (source_id, user_id)
        union all
        select
          f.id,
          f.created_at,
          f.source_table,
          f.source_column,
          f.source_id,
          s.fragment,
          f.user_id
        from
          (
            select
              id as source_id,
              summary as fragment,
              user_id
            from
              summaries
          ) s
          join (
            select
              *
            from
              fragments_to_chunk
            where
              source_table = 'summaries'
          ) f using (source_id, user_id)
      )
  );

create view tmp_fragments_to_check
with
  (security_invoker = on) as (
    select
      *
    from
      fragments_to_check
  );

create view tmp_fragments_to_chunk
with
  (security_invoker = on) as (
    select
      *
    from
      fragments_to_chunk
  );

create view tmp_fragments_to_chunk_with_content
with
  (security_invoker = on) as (
    select
      *
    from
      fragments_to_chunk_with_content
    limit 5
  );