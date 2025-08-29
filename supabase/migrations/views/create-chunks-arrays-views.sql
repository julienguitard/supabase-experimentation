-- questions_matching_chunks
drop view if exists denormalized_questions_matching_chunks_arrays;

create view denormalized_questions_matching_chunks_arrays
with
  (security_invoker = on) as (
    select
      matching_id as id,
      max(created_at) as created_at,
      question_id,
      max(question_created_at) as question_created_at,
      array_agg(chunk) as chunks,
      user_id
    from denormalized_questions_matching_chunks
    group by
      matching_id,
      question_id,
      user_id
  );