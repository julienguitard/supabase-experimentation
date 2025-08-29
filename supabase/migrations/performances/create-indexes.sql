-- links

create index if not exists links_user_id_idx on links (user_id);

-- contents

create index if not exists contents_user_id_idx on contents (user_id);

-- summaries

create index if not exists summaries_user_id_idx on summaries (user_id);

-- questions

create index if not exists questions_user_id_idx on questions (user_id);

-- fragments

create index if not exists fragments_user_id_idx on fragments (user_id);

-- chunks   

create index if not exists chunks_user_id_idx on chunks (user_id);

-- vectors

create index if not exists vectors_user_id_idx on vectors (user_id);

-- matches

create index if not exists matches_user_id_idx on matches (user_id);    

-- questions_matching_chunks

create index if not exists questions_matching_chunks_user_id_idx on questions_matching_chunks (user_id);


-- modified_questions

create index if not exists modified_questions_user_id_idx on modified_questions (user_id);

-- answers

create index if not exists answers_user_id_idx on answers (user_id);

