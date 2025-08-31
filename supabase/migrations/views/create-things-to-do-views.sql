-- Links

drop view if exists links_to_scrape cascade;

create view links_to_scrape with (security_invoker = on) as
(select id,
        created_at,
        url,
        category,
        user_id
        from (select l.id,
                        l.created_at,
                        l.url,
                        l.category,
                        l.user_id,
                        CASE WHEN c.id is null THEN TRUE ELSE FALSE END as is_to_scrape
                    from links l
                    left join latest_links_contents c on c.link_id = l.id)
        where is_to_scrape
);
drop view if exists links_to_scrape_extract;

create view links_to_scrape_extract
with
  (security_invoker = on) as (
    select
      *
    from
      links_to_scrape
    order by
      random()
    limit
      3
  );

-- Contents

drop view if exists contents_to_summarize cascade;

create view contents_to_summarize with (security_invoker = on) as
(select id,
        created_at,
        status,
        encode(content,'hex') as hex_content,
        encode(error,'hex') as hex_error,
        user_id
        from (select c.id,
                c.created_at,
                c.status,
                c.content,
                c.error,
                c.user_id,
                case when s.id is null then true else false end as is_to_summarize
                from contents c
                left join latest_links_summaries s on s.content_id = c.id)
        where is_to_summarize);

drop view if exists contents_to_summarize_extract;

create view contents_to_summarize_extract
with
  (security_invoker = on) as (
    select
      *
    from
      contents_to_summarize
    order by
      random()
    limit
      3
  );

-- Summaries

-- Questions

drop view if exists questions_to_answer cascade;

create view questions_to_answer with (security_invoker = on) as
(select id,
        created_at,
        encode(question,'hex') as hex_question,
        user_id
        from (select q.id,
                q.created_at,
                q.question,
                q.user_id,
                case when a.id is null then true else false end as is_to_answer
                from questions q
                left join latest_questions_answers a on a.question_id = q.id)
        where is_to_answer);

drop view if exists questions_to_answer_extract;

create view questions_to_answer_extract
with
  (security_invoker = on) as (
    select
      *
    from
      questions_to_answer
    order by
      random()
    limit
      3
  );

-- Fragments

drop view if exists contents_to_fragment cascade;

create view contents_to_fragment with (security_invoker = on) as
(select id,
        created_at,
        status,
        user_id
        from (select c.id,
                c.created_at,
                c.status,
                c.error,
                c.content,
                c.user_id,
                case when f.id is null then true else false end as is_to_fragment
                from contents c
                left join latest_links_fragments f on f.content_id = c.id)
        where is_to_fragment);

drop view if exists summaries_to_fragment cascade;

create view summaries_to_fragment with (security_invoker = on) as
(select id,
        created_at,
        user_id
        from (select s.id,
                s.created_at,
                s.summary,
                s.user_id,
                case when f.id is null then true else false end as is_to_fragment
                from summaries s
                left join latest_summaries_fragments f on f.summary_id = s.id)
        where is_to_fragment);

drop view if exists questions_to_fragment cascade;

create view questions_to_fragment with (security_invoker = on) as
(select id,
        created_at,
        user_id
        from (select q.id,
                q.created_at,
                q.question,
                q.user_id,
                case when f.id is null then true else false end as is_to_fragment
                from questions q
                left join latest_questions_fragments f on f.question_id = q.id)
        where is_to_fragment);

drop view if exists entities_to_fragment cascade;

create view entities_to_fragment with (security_invoker = on) as
(select 'contents' as source_table,
        'content' as source_column,
        id as source_id,
        user_id
        from contents_to_fragment
        union all
        select 'summaries' as source_table,
        'summary' as source_column,
        id as source_id,
        user_id
        from summaries_to_fragment
        union all
        select 'questions' as source_table,
        'question' as source_column,
        id as source_id,
        user_id
        from questions_to_fragment
);

drop view if exists entities_to_fragment_extract;

create view entities_to_fragment_extract
with
  (security_invoker = on) as (
    select
      *
    from
      entities_to_fragment
  );

drop view if exists fragments_to_chunk cascade;

 create view fragments_to_chunk with (security_invoker = on) as
 (select id,
        created_at,
        encode(fragment,'hex') as hex_fragment,
        user_id
        from (select f.id,
                f.created_at,
                f.fragment,
                f.user_id,
                case when c.id is null then true else false end as is_to_chunk
                from denormalized_entities_fragments f
                left join latest_fragments_chunks c on c.fragment_id = f.id)
        where is_to_chunk);

drop view if exists fragments_to_chunk_extract;

create view fragments_to_chunk_extract
with
  (security_invoker = on) as (
    select
      *
    from
      fragments_to_chunk
    order by
      random()
    limit
      10
  );

-- Chunks

drop view if exists chunks_to_vectorize cascade;

create view chunks_to_vectorize with (security_invoker = on) as
(select id,
        created_at,
        chunk,
        user_id
        from (select c.id,
                c.created_at,
                c.chunk,
                c.user_id,
                case when v.id is null then true else false end as is_to_vectorize
                from chunks c
                left join latest_fragments_vectors v on v.chunk_id = c.id)
        where is_to_vectorize);

drop view if exists chunks_to_vectorize_extract;

create view chunks_to_vectorize_extract
with
  (security_invoker = on) as (
    select
      *
    from
      chunks_to_vectorize
    order by
      random()
    limit
      5
  );
  
-- Vectors  

-- Matches

-- Modified questions

-- Answers