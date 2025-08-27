drop view if exists denormalized_questions_matching_chunks_0 cascade;

create view denormalized_questions_matching_chunks_0
with
  (security_invoker = on) as (
    select
      id,
      match_id,
      chunk_id,
      question_id,
      chunk,
      question
    from
      (
        select
          id,
          chunk_id,
          match_id
        from
          questions_matching_chunks
      ) qmc
      join (
        select
          id as chunk_id,
          chunk
        from
          chunks
      ) c using (chunk_id)
      join (
        select
          id as match_id,
          question_id
        from
          matches
      ) m using (match_id)
      join (
        select
          id as question_id,
          question
        from
          questions
      ) q using (question_id)
  );

drop view if exists denormalized_questions_matching_chunks_1 cascade;

create view denormalized_questions_matching_chunks_1
with
  (security_invoker = on) as (
    select
      id,
      match_id,
      chunk_id,
      question_id,
      modified_question_id,
      chunk,
      question,
      modified_question
    from
      (
        select
          id,
          match_id,
          chunk_id,
          question_id,
          chunk,
          question
        from
          denormalized_questions_matching_chunks_0
      ) qmc
      join (
        select
          id as modified_question_id,
          match_id,
          modified_question
        from
          modified_questions
      ) mq using (match_id)
  );

  drop view if exists question_with_chunk_array;

create view question_with_chunk_array
with
  (security_invoker = on) as (
    select
      match_id,
      question_id,
      ARRAY_AGG(chunk) as chunks,
      question
    from
      (
        (
          select
            id,
            match_id,
            chunk_id,
            question_id,
            chunk,
            question
          from
            denormalized_questions_matching_chunks_0
        )
      )
    group by
      match_id,
      question_id,
      question
  );

drop view if exists modified_question_with_chunk_array;

create view modified_question_with_chunk_array
with
  (security_invoker = on) as (
    select
      match_id,
      question_id,
      ARRAY_AGG(chunk) as chunks,
      question,
      modified_question
    from
      (
        (
          select
            id,
            match_id,
            chunk_id,
            question_id,
            modified_question_id,
            chunk,
            question,
            modified_question
          from
            denormalized_questions_matching_chunks_1
        )
      )
    group by
      match_id,
      question_id,
      modified_question_id,
      question,
      modified_question
  );