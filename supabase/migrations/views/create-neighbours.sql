drop view if exists questions_neighbours_chunks;

create view questions_neighbours_chunks
with
  (security_invoker = on) as (
    select
      question_id as id,
      question_created_at as created_at,
      content_chunk_id as chunk_id
    from
      (
        select
          q.id as question_vector_id,
          q.created_at as question_vector_created_at,
          q.chunk_id as question_chunk_id,
          q.chunk_created_at as question_chunk_created_at,
          q.fragment_id as question_fragment_id,
          q.fragment_created_at as question_fragment_created_at,
          q.question_id,
          q.question_created_at,
          q.question,
          c.id as content_vector_id,
          c.created_at as content_vector_created_at,
          c.chunk_id as content_chunk_id,
          c.chunk_created_at as content_chunk_created_at,
          c.fragment_id as content_fragment_id,
          c.fragment_created_at as content_fragment_created_at,
          c.content_id,
          c.content_created_at,
          c.status,
          c.content,
          c.error,
          c.url,
          c.category,
          cosine_distance (q.embedding, c.embedding) as cosine_distance_,
          c.user_id,
        from
          (
            select
              id as question_id,
              created_at fragment_id,
              chunk_id,
              vector_id,
              embedding
            from
              latest_questions_vectors
          ) q
          join (
            select
              id as content_id,
              fragment_id,
              chunk_id,
              vector_id,
              embedding
            from
              latest_contents_vector
            where
              status = 200
          ) c on cosine_distance (q.embedding, c.embedding) < 0.4
      )
order by
  cosine_distance_ asc
limit
  10);