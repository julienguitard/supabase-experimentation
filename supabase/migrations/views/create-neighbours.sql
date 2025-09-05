drop view if exists questions_neighbours_chunks cascade;

create view questions_neighbours_chunks
with
  (security_invoker = on) as (
    select
      question_id as id,
      question_created_at as created_at,
      chunk_id as chunk_id,
      question,
      chunk,
      start_,
      end_,
      length_,
      user_id
    from
      (
        select
          q.question_id,
          q.question_created_at,
          q.question,
          c.chunk_id  chunk_id,
          c.chunk, 
          c.start_,
          c.end_,
          c.length_,
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
              question_created_at,
              question,
              embeddings,
              user_id
            from
              latest_questions_vectors
          ) q
          join (
            select
              id,
              chunk_id,
              chunk_created_at,
              fragment_id,
              fragment_created_at,
              content_id,
              content_created_at,
              chunk,
              start_,
              end_,
              length_,
              status,
              content,
              error,
              embeddings,
              user_id
            from
              latest_links_vectors
            where
              status = '200'
          ) c on cosine_distance (q.embeddings, c.embeddings) < 0.9 --TODO change with a realistic threshold
      )
order by
  cosine_distance_ asc
limit
  10);