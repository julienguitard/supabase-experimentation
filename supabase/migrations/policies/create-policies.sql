-- links

alter table links enable row level security;

-- Check if the user is the owner of the link
create policy "authenticated_all"
on "public"."links"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id 
) with check ((select auth.uid() as user_id) = user_id); 

alter table links_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."links_insert_buffer"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

alter table links_update_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."links_update_buffer"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

alter table links_delete_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."links_delete_buffer"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);


-- contents

alter table contents enable row level security;

-- Check if the user is the owner of the content
create policy "authenticated_all"
on "public"."contents"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id 
) with check ((select auth.uid() as user_id) = user_id); 

alter table contents_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."contents_insert_buffer"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);
-- questions

alter table questions enable row level security;

-- Check if the user is the owner of the question
create policy "authenticated_all"
on "public"."questions"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

alter table questions_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."questions_insert_buffer"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

-- fragments

alter table fragments enable row level security;

-- Check if the user is the owner of the fragment
create policy "authenticated_all"
on "public"."fragments"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

alter table fragments_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."fragments_insert_buffer"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

-- chunks

alter table chunks enable row level security;

-- Check if the user is the owner of the chunk
create policy "authenticated_all"
on "public"."chunks"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

alter table chunks_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."chunks_insert_buffer"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

-- vectors

alter table vectors enable row level security;

-- Check if the user is the owner of the vector
create policy "authenticated_all"
on "public"."vectors"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

alter table vectors_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."vectors_insert_buffer"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

-- matches

alter table matches enable row level security;

-- Check if the user is the owner of the match
create policy "authenticated_all"
on "public"."matches"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

alter table matches_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."matches_insert_buffer"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

-- questions_matching_chunks

alter table questions_matching_chunks enable row level security;

-- Check if the user is the owner of the questions_matching_chunks row
create policy "authenticated_all"
on "public"."questions_matching_chunks"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

alter table questions_matching_chunks_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."questions_matching_chunks_insert_buffer"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

-- modified_questions

alter table modified_questions enable row level security;

-- Check if the user is the owner of the modified_question
create policy "authenticated_all"
on "public"."modified_questions"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

alter table modified_questions_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."modified_questions_insert_buffer"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

-- answers

alter table answers enable row level security;

-- Check if the user is the owner of the answer
create policy "authenticated_all"
on "public"."answers"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) = user_id
) with check ((select auth.uid() as user_id) = user_id);

alter table answers_insert_buffer enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."answers_insert_buffer"
as permissive
for all
to public
using (
  (select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);
