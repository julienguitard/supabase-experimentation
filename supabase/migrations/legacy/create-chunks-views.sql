drop view if exists tmp_chunks_to_vectorize cascade;

drop view if exists chunks_to_vectorize cascade;

create view chunks_to_vectorize
with
  (security_invoker = on) as (
    select
      id,
      created_at,
      fragment_id,
      chunk,
      start_,
      end_,
      length_
    from
      (
        select
          c.id,
          v.id as id_,
          c.created_at,
          c.fragment_id,
          c.chunk,
          c.start_,
          c.end_,
          c.length_
        from
          (
            select
              id,
              created_at,
              fragment_id,
              chunk,
              start_,
              end_,
              length_
            from
              chunks
          ) c
          left join (
            select distinct
              chunk_id as id
            from
              vectors
          ) v using (id)
      )
    where
      id_ is null
  );

create view tmp_chunks_to_vectorize
with
  (security_invoker = on) as (
    select
      *
    from
      chunks_to_vectorize
    order by random()
    limit
      5
  );