drop view if exists denormalized_questions_matching_chunks_arrays cascade;

create view denormalized_questions_matching_chunks_arrays
with
  (security_invoker = on) as (
    select
      match_id as id,
      max(created_at) as created_at,
      question_id,
      max(question_created_at) as question_created_at,
      max(question::text)::bytea as question,
      array_agg(chunk) as chunks,
      user_id
    from denormalized_questions_matching_chunks
    group by
      match_id,
      question_id,
      user_id
  );