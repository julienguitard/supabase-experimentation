drop view if exists matches_with_question_chunks_select_buffer cascade;

create view matches_with_question_chunks_select_buffer as (
select
  match_id,
  (array_agg(hex_question))[1] as hex_question,
  array_agg(hex_chunk) as hex_chunks
from
  (
    select
      m.match_id,
      q.hex_question,
      c.hex_chunk,
      m.user_id
    from
      (
        select
          id as match_id,
          question_id,
          user_id
        from
          matches_insert_buffer
      ) m
      left join (
        select
          match_id,
          chunk_id,
          user_id
        from
          questions_matching_chunks_insert_buffer
      ) qmc using (match_id)
      join (
        select
          id as question_id,
          encode(question,'hex') as hex_question,
          user_id
        from
          questions
      ) q using (question_id)
      join (
        select
          id as chunk_id,
          encode(chunk,'hex') as hex_chunk,
          user_id
        from
          chunks
      ) c using (chunk_id)
  )
group by
  match_id);

drop view if exists modified_questions_with_chunks_select_buffer cascade;

create view modified_questions_with_chunks_select_buffer as (
  select
    id,
    (array_agg(hex_modified_question)) [1] as hex_modified_question,
    array_agg(hex_chunk) as hex_chunks
  from
    (
      select
        m.id,
        m.match_id,
        m.hex_modified_question,
        c.hex_chunk,
        m.user_id
      from
        (
          select
            mm.id,
            mm.match_id,
            mb.hex_modified_question,
            mm.user_id
          from
            modified_questions mm join
            modified_questions_insert_buffer mb using (match_id)
        ) m
        left join (
          select
            match_id,
            chunk_id,
            user_id
          from
            questions_matching_chunks
        ) qmc using (match_id)
        join (select id as chunk_id,
               encode(chunk,'hex') as hex_chunk,
               user_id from chunks) c using (chunk_id)
    )
  group by
    id
);