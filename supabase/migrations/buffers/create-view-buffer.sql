dedrop view if exists matches_with_question_chunks_select_buffer cascade;

create view matches_with_question_chunks_select_buffer 
with (security_invoker = on) 
as (
  select
    match_id,
    (array_agg(hex_question)) [1] as hex_question,
    array_agg(hex_chunk) as hex_chunks
  from
    (
      select
        mq.match_id,
        mq.hex_question,
        qmc.hex_chunk,
        mq.user_id
      from
        (
          select
            m.match_id,
            m.question_id,
            q.hex_question,
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
            join (
              select
                id as question_id,
                encode(question, 'hex') as hex_question,
                user_id
              from
                questions
            ) q using (question_id)
        ) mq
        left join (
          select
            qmc_.match_id,
            qmc_.chunk_id,
            c.hex_chunk,
            qmc_.user_id
          from
            (
              select
                match_id,
                chunk_id,
                user_id
              from
                questions_matching_chunks_insert_buffer
            ) qmc_
            join (
              select
                id as chunk_id,
                encode(chunk, 'hex') as hex_chunk,
                user_id
              from
                chunks
            ) c using (chunk_id)
        ) qmc using (match_id)
    )
  group by
    match_id
);

drop view if exists modified_questions_with_chunks_select_buffer cascade;

create  view modified_questions_with_chunks_select_buffer 
with (security_invoker = on) 
as (
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
        qmc.hex_chunk,
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
            qmc_.match_id,
            qmc_.chunk_id,
            c.hex_chunk,
            qmc_.user_id
          from
            questions_matching_chunks qmc_
         
        join (select id as chunk_id,
               encode(chunk,'hex') as hex_chunk,
               user_id from chunks) c using (chunk_id)) qmc using (match_id)
    )
  group by
    id
);