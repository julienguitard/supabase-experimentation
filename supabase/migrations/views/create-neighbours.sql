drop view if exists questions_neighbours_chunks;

create view questions_neighbours_chunks
with
  (security_invoker = on) as (
    select
      question_id as id,
      content_chunk_id as chunk_id
    from
      (
        select
          q.id as question_vector_id,
          q.chunk_id as question_chunk_id,
          q.fragment_id as question_fragment_id,
          q.question_id,
          c.id as content_vector_id,
          c.chunk_id as content_chunk_id,
          c.fragment_id as content_fragment_id,
          c.content_id,
          cosine_distance (q.embeddings, c.embeddings) as cosine_distance_,
          c.user_id
        from
          (
            select
              id,
              chunk_id,
              fragment_id,
              question_id,
              embeddings,
              user_id
            from
              latest_questions_vectors
          ) q
          join (
            select
              id,
              chunk_id,
              fragment_id,
              content_id,
              embeddings,
              user_id
            from
              latest_links_vectors
            where
              status = '200'
          ) c on cosine_distance (q.embeddings, c.embeddings) < 0.4
      )
order by
  cosine_distance_ asc
limit
  10);