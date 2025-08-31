-- Links

-- Contents

drop view if exists denormalized_contents cascade;

create view denormalized_contents with (security_invoker = on) as
(select
  c.id,
  c.created_at,
  l.link_id,
  l.link_created_at,
  c.status,
  c.content,
  c.error,
  l.url,
  l.category,
  c.user_id
from
  contents c
  join (
    select
      id as link_id,
      created_at as link_created_at,
      url,
      category,
      user_id
    from
      links
  ) l using (link_id));

-- Summaries

drop view if exists denormalized_summaries cascade;

create view denormalized_summaries with (security_invoker = on) as
(select
    s.id,
    s.created_at,
    c.content_id,
    c.content_created_at,
    c.link_id,
    c.link_created_at,
    s.summary,
    c.status,
    c.content,
    c.error,
    c.url,
    c.category,
    s.user_id
from
  summaries s
  join (
    select
      id as content_id,
      created_at as content_created_at,
      link_id,
      link_created_at,
      status,
      content,
      error,
      url,
      category,
      user_id
    from
      denormalized_contents
  ) c using (content_id));
-- Questions

-- Fragments

drop view if exists denormalized_contents_fragments cascade;

create view denormalized_contents_fragments
with
  (security_invoker = on) as (
    select
      f.id,
      f.created_at,
      c.content_id,
      c.content_created_at,
      c.link_id,
      c.link_created_at,
      c.status,
      c.content,
      c.error,
      c.url,
      c.category,
      f.user_id
    from
      (
        select
          id,
          created_at,
          source_id as content_id,
          user_id
        from
          fragments
        where
          source_table = 'contents'
      ) f
      join (
        select
          id as content_id,
          created_at as content_created_at,
          link_id,
          link_created_at,
          status,
          content,
          error,
          url,
          category,
          user_id
        from
          denormalized_contents
      ) c using (content_id)
  );

drop view if exists denormalized_summaries_fragments cascade;

create view denormalized_summaries_fragments
with
  (security_invoker = on) as (
    select
      f.id,
      f.created_at,
      s.summary_id,
      s.summary_created_at,
      s.content_id,
      s.content_created_at,
      s.link_id,
      s.link_created_at,
      s.summary,
      s.status,
      s.content,
      s.error,
      s.url,
      s.category,
      f.user_id
    from
      (
        select
          id,
          created_at,
          source_id as summary_id,
          user_id
        from
          fragments
        where
          source_table = 'summaries'
      ) f
      join (
        select
          id as summary_id,
          created_at as summary_created_at,
          link_id,
          link_created_at,
          content_id,
          content_created_at,
          summary,
          status,
          content,
          error,
          url,
          category,
          user_id
        from
          denormalized_summaries
      ) s using (summary_id)
  );

drop view if exists denormalized_questions_fragments cascade;

create view denormalized_questions_fragments
with
  (security_invoker = on) as (
    select
      f.id,
      f.created_at,
      q.question_id,
      q.question_created_at,
      q.question,
      f.user_id
    from
      (
        select
          id,
          created_at,
          source_id as question_id,
          user_id
        from
          fragments
        where
          source_table = 'questions'
      ) f
      join (
        select
          id as question_id,
          created_at as question_created_at,
          question,
          user_id
        from
          questions
      ) q using (question_id)
  );


drop view if exists denormalized_entities_fragments cascade;

create view denormalized_entities_fragments with (security_invoker = on) as
(
    select
    id,
    created_at,
    content as fragment,
    user_id
    from denormalized_contents_fragments
    union all
    select
    id,
    created_at,
    summary as fragment,
    user_id
    from denormalized_summaries_fragments
    union all 
    select
    id,
    created_at,
    question as fragment,
    user_id
    from denormalized_questions_fragments
  );



-- Chunks

drop view if exists denormalized_chunks cascade;

create view denormalized_chunks with (security_invoker = on) as
(
    select
    c.id,
    c.created_at,
    f.fragment_id,
    f.fragment_created_at,
    f.source_table,
    f.source_column,
    f.source_id,
    c.chunk,
    c.start_,
    c.end_,
    c.length_,
    c.user_id
    from chunks c
    join (
        select
        id as fragment_id,
        created_at as fragment_created_at,
        source_table,
        source_column,
        source_id,
        user_id
        from fragments
    ) f using (fragment_id)
);

drop view if exists denormalized_contents_chunks cascade;

create view denormalized_contents_chunks
with
  (security_invoker = on) as (
    select
      c.id,
      c.created_at,
      c.fragment_id,
      c.fragment_created_at,
      co.content_id,
      co.content_created_at,
      co.link_id,
      co.link_created_at,
      c.chunk,
      c.start_,
      c.end_,
      c.length_,
      co.status,
      co.content,
      co.error,
      co.url,
      co.category,
      c.user_id
    from
      (
        select
          id,
          created_at,
          fragment_id,
          fragment_created_at,
          source_id as content_id,
          chunk,
          start_,
          end_,
          length_,
          user_id
        from
          denormalized_chunks
        where
          source_table = 'contents'
      ) c
      join (
        select
          id as content_id,
          created_at as content_created_at,
          link_id,
          link_created_at,
          status,
          content,
          error,
          url,
          category,
          user_id
        from
          denormalized_contents
      ) co using (content_id)
  );

drop view if exists denormalized_summaries_chunks cascade;

create view denormalized_summaries_chunks
with
  (security_invoker = on) as (
    select
      c.id,
      c.created_at,
      c.fragment_id,
      c.fragment_created_at,
      s.summary_id,
      s.summary_created_at,
      s.content_id,
      s.content_created_at,
      s.link_id,
      s.link_created_at,
      c.chunk,
      c.start_,
      c.end_,
      c.length_,
      s.summary,
      s.status,
      s.content,
      s.error,
      s.url,
      s.category,
      c.user_id
    from
      (
        select
          id,
          created_at,
          fragment_id,
          fragment_created_at,
          source_id as summary_id,
          chunk,
          start_,
          end_,
          length_,
          user_id
        from
          denormalized_chunks
        where
          source_table = 'summaries'
      ) c
      join (
        select
          id as summary_id,
          created_at as summary_created_at,
          content_id,
          content_created_at,
          link_id,
          link_created_at,
          summary,
          status,
          content,
          error,
          url,
          category,
          user_id
        from
          denormalized_summaries
      ) s using (summary_id)
  );

drop view if exists denormalized_questions_chunks cascade;

create view denormalized_questions_chunks
with
  (security_invoker = on) as (
    select
      c.id,
      c.created_at,
      c.fragment_id,
      c.fragment_created_at,
      q.question_id,
      q.question_created_at,
      q.question,
      c.chunk,
      c.start_,
      c.end_,
      c.length_,
      c.user_id
    from
      (
        select
          id,
          created_at,
          fragment_id,
          fragment_created_at,
          source_id as question_id,
          chunk,
          start_,
          end_,
          length_,
          user_id
        from
          denormalized_chunks
        where
          source_table = 'questions'
      ) c
      join (
        select
          id as question_id,
          created_at as question_created_at,
          question,
          user_id
        from
          questions
      ) q using (question_id)
  );

-- Vectors  

drop view if exists denormalized_vectors cascade;

create view denormalized_vectors with (security_invoker = on) as
(
    select
    v.id,
    v.created_at,
    c.chunk_id,
    c.chunk_created_at,
    c.fragment_id,
    c.fragment_created_at,
    c.source_table,
    c.source_column,
    c.source_id,
    v.embeddings,
    c.chunk,
    c.start_,
    c.end_,
    c.length_,
    v.user_id
    from vectors v
    join (select
    id as chunk_id,
    created_at as chunk_created_at,
    fragment_id,
    fragment_created_at,
    source_table,
    source_column,
    source_id,
    chunk,
    start_,
    end_,
    length_,
    user_id
    from denormalized_chunks) c using (chunk_id)
);

drop view if exists denormalized_contents_vectors cascade;

create view denormalized_contents_vectors with (security_invoker = on) as
(
    select
    v.id,
    v.created_at,
    v.chunk_id,
    v.chunk_created_at,
    v.fragment_id,
    v.fragment_created_at,
    c.content_id,
    c.content_created_at,
    c.link_id,
    c.link_created_at,
    v.embeddings,
    v.chunk,
    v.start_,
    v.end_,
    v.length_,
    c.status,
    c.content,
    c.error,
    c.url,
    c.category,
    v.user_id
    from (select id,
    created_at,
    chunk_id,
    chunk_created_at,
    fragment_id,
    fragment_created_at,
    source_id as content_id,
    embeddings,
    chunk,
    start_,
    end_,
    length_,
    user_id
    from denormalized_vectors
    where source_table = 'contents') v
    join (select id as content_id, 
    created_at as content_created_at, 
    link_id, 
    link_created_at, 
    status, 
    content, 
    error, 
    url, 
    category, 
    user_id from denormalized_contents) c using (content_id)
);

drop view if exists denormalized_summaries_vectors cascade;

create view denormalized_summaries_vectors with (security_invoker = on) as
(
    select
    v.id,
    v.created_at,
    v.chunk_id,
    v.chunk_created_at,
    v.fragment_id,
    v.fragment_created_at,
    s.summary_id,
    s.summary_created_at,
    s.content_id,
    s.content_created_at,
    s.link_id,
    s.link_created_at,
    v.embeddings,
    v.chunk,
    v.start_,
    v.end_,
    v.length_,
    s.summary,
    s.status,
    s.content,
    s.error,
    s.url,
    s.category,
    v.user_id
    from (select id,
    created_at,
    chunk_id,
    chunk_created_at,
    fragment_id,
    fragment_created_at,
    source_id as summary_id,
    embeddings,
    chunk,
    start_,
    end_,
    length_,
    user_id
    from denormalized_vectors
    where source_table = 'summaries') v
    join (select id as summary_id,
     created_at as summary_created_at, 
     content_id, 
     content_created_at, 
     link_id, 
     link_created_at,
      summary,
       status,
        content, 
        error,
         url,
          category, 
          user_id from denormalized_summaries) s using (summary_id)
);

drop view if exists denormalized_questions_vectors cascade;

create view denormalized_questions_vectors with (security_invoker = on) as
(
    select
    v.id,
    v.created_at,
    v.chunk_id,
    v.chunk_created_at,
    v.fragment_id,
    v.fragment_created_at,
    q.question_id,
    q.question_created_at,
    v.embeddings,
    v.chunk,
    v.start_,
    v.end_,
    v.length_,
    q.question,
    q.user_id
    from (select id,
    created_at,
    chunk_id,
    chunk_created_at,
    fragment_id,
    fragment_created_at,
    source_id as question_id,
    embeddings,
    chunk,
    start_,
    end_,
    length_,
    user_id
    from denormalized_vectors
    where source_table = 'questions') v
    join (select id as question_id,
    created_at as question_created_at,
    question,
    user_id
    from questions) q using (question_id)
);

-- Matches

drop view if exists denormalized_matches cascade;

create view denormalized_matches with (security_invoker = on) as
(
    select
    m.id,
    m.created_at,
    q.question_id,
    q.question_created_at,
    q.question,
    m.user_id
    from matches m
    join (
        select
        id as question_id,
        created_at as question_created_at,
        question,
        user_id
        from questions
    ) q using (question_id)
);

-- Questions_matching_chunks

drop view if exists denormalized_questions_matching_chunks cascade;

create view denormalized_questions_matching_chunks with (security_invoker = on) as
(
    select
    qmc.id,
    qmc.created_at,
    m.match_id,
    m.match_created_at,
    m.question_id,
    m.question_created_at,
    c.chunk_id,
    c.chunk_created_at,
    m.question,
    c.chunk,
    c.start_,
    c.end_,
    c.length_,
    qmc.user_id from questions_matching_chunks qmc
    join (
        select
        id as match_id,
        created_at as match_created_at,
        question_id,
        question_created_at,
        question,
        user_id
        from denormalized_matches
    ) m using (match_id)
    join (select id as chunk_id, created_at as chunk_created_at, chunk, start_, end_, length_, user_id from denormalized_chunks) c using (chunk_id)
);
   
-- Modified_questions

drop view if exists denormalized_modified_questions cascade;

create view denormalized_modified_questions with (security_invoker = on) as
(
    select
    mq.id,
    mq.created_at,
    m.match_id,
    m.match_created_at,
    m.question_id,
    m.question_created_at,
    m.question,
    mq.modified_question,
    mq.user_id
    from modified_questions mq
    join (
        select
            id as match_id,
            created_at as match_created_at,
            question_id,
            question_created_at,
            question,
            user_id
        from
            denormalized_matches
    ) m using (match_id)
);


-- Answers

drop view if exists denormalized_answers cascade;

create view denormalized_answers with (security_invoker = on) as
(
    select
    a.id,
    a.created_at,
    mq.modified_question_id,
    mq.modified_question_created_at,
    mq.match_id,
    mq.match_created_at,
    mq.question_id,
    mq.question_created_at,
    a.answer,
    mq.modified_question,
    mq.question,
    a.user_id
    from answers a
    join (
      select
        id as modified_question_id,
        created_at as modified_question_created_at,
        match_id,
        match_created_at,
        question_id,
        question_created_at,
        modified_question,
        question,
        user_id
      from denormalized_modified_questions
    ) mq using (modified_question_id)
);