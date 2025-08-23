drop view if exists vectors_top_proximity cascade;

create view vectors_top_proximity
with
  (security_invoker = on) as (
    select
      *
    from
      (
        select
          id_0,
          id_1,
          dist,
          RANK() over (
            partition by
              id_0
            order by
              dist
          ) as rk_
        from
          (
            select
              t0.id as id_0,
              t1.id as id_1,
              l2_norm (t0.embeddings::halfvec) as l2_norm_,
              cosine_distance (t0.embeddings, t1.embeddings) as dist
            from
              vectors t0
              join vectors t1 on t0.id < t1.id
          )
      )
    where
      rk_ <= 5
  );

drop view if exists denormalized_vectors_0 cascade;

create view denormalized_vectors_0
with
  (security_invoker = on) as (
    select
      v.id,
      v.chunk_id,
      c.start_,
      c.end_,
      c.fragment_id,
      f.source_table,
      f.source_column,
      f.source_id
    from
      vectors v
      join chunks c on v.chunk_id = c.id
      join fragments f on c.fragment_id = f.id
  );

drop view if exists denormalized_vectors_1 cascade;

create view denormalized_vectors_1
with
  (security_invoker = on) as (
    select
      v.id,
      v.chunk_id,
      v.start_,
      v.end_,
      v.fragment_id,
      v.source_table,
      v.source_column,
      v.source_id,
      co.link_id,
      l.url,
      l.category
    from
      denormalized_vectors_0 v
      join contents co on v.source_id = co.id
      join links l on co.link_id = l.id
    union all
    select
      v.id,
      v.chunk_id,
      v.start_,
      v.end_,
      v.fragment_id,
      v.source_table,
      v.source_column,
      v.source_id,
      co.link_id,
      l.url,
      l.category
    from
      denormalized_vectors_0 v
      join summaries s on v.source_id = s.id
      join contents co on s.content_id = co.id
      join links l on co.link_id = l.id
  );

SELECT COUNT(*), SUM(CAST(url_0=url_1 AS INT)) FROM (
select
  vtp.*,
  v0.url as url_0,
  v0.category as category_0,
  v1.url as url_1,
  v1.category as category_1
from
  vectors_top_proximity vtp
  join denormalized_vectors_1 v0 on vtp.id_0 = v0.id
  join denormalized_vectors_1 v1 on vtp.id_1 = v1.id)