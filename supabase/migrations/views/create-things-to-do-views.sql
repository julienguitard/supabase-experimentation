-- Links

drop view if exist links_to_scrape;

create view links_to_scrape with (security_invoker = on) as
(select id,
        created_at,
        url,
        category,
        user_id,
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

-- Contents

drop view if exist contents_to_summarize;

create view contents_to_summarize with (security_invoker = on) as
(select id,
        created_at,
        status,
        content,
        error,
        user_id,
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

-- Summaries

-- Questions

drop view if exist questions_to_answer;

create view questions_to_answer with (security_invoker = on) as
(select id,
        created_at,
        question,
        user_id,
        from (select q.id,
                q.created_at,
                q.question,
                q.user_id,
                case when a.id is null then true else false end as is_to_answer
                from questions q
                left join latest_answers a on a.question_id = q.id)
        where is_to_answer);

-- Fragments

drop views if exist contents_to_fragment;

create view contents_to_fragment with (security_invoker = on) as
(select id,
        created_at,
        status,
        content,
        error,
        user_id,
        from (select c.id,
                c.created_at,
                c.status,
                c.error,
                c.content,
                c.user_id,
                case when f.id is null then true else false end as is_to_fragment
                from contents c
                left join denormalized_fragments_with_contents f on f.content_id = c.id)
        where is_to_fragment);

drop view if exist summaries_to_fragment;


create view summaries_to_fragment with (security_invoker = on) as
(select id,
        created_at,
        summary,
        user_id,
        from (select s.id,
                s.created_at,
                s.summary,
                s.user_id,
                case when f.id is null then true else false end as is_to_fragment
                from summaries s
                left join denormalized_fragments_with_summaries f on f.summary_id = s.id)
        where is_to_fragment);

drop view if exist questions_to_fragment;

create view questions_to_fragment with (security_invoker = on) as
(select id,
        created_at,
        question,
        user_id,
        from (select q.id,
                q.created_at,
                q.question,
                q.user_id,
                case when f.id is null then true else false end as is_to_fragment
                from questions q
                left join denormalized_fragments_with_questions f on f.question_id = q.id)
        where is_to_fragment);

drop view if exists entities_to_fragment;

create view entities_to_fragment with (security_invoker = on) as
(select 'contents' as source_table,
        'content' as source_column,
        id as source_id,
        user_id,
        from contents_to_fragment
        union all
        select 'summaries' as source_table,
        'summary' as source_column,
        id as source_id,
        user_id,
        from summaries_to_fragment
        union all
        select 'questions' as source_table,
        'question' as source_column,
        id as source_id,
        user_id,
        from questions_to_fragment
);

 drop view if exist fragments_to_chunk;

 create view fragments_to_chunk with (security_invoker = on) as
 (select id,
        created_at,
        fragment,
        user_id,
        from (select f.id,
                f.created_at,
                f.fragment,
                f.user_id,
                case when c.id is null then true else false end as is_to_chunk
                from fragments f
                left join latest_fragments_chunks c on c.fragment_id = f.id)
        where is_to_chunk);

-- Chunks

drop view if exist chunks_to_vectorize;

create view chunks_to_vectorize with (security_invoker = on) as
(select id,
        created_at,
        chunk,
        user_id,
        from (select c.id,
                c.created_at,
                c.chunk,
                c.user_id,
                case when v.id is null then true else false end as is_to_vectorize
                from chunks c
                left join latest_fragments_vectors v on v.chunk_id = c.id)
        where is_to_vectorize);

-- Vectors  

-- Matches

-- Modified questions

-- Answers