alter table questions_matching_chunks enable row level security;

-- Check if the user is the owner of the modified question
create policy "authenticated_all" on questions_matching_chunks
for all
to public
using ((select auth.uid() as user_id) = user_id)
with check ((select auth.uid() as user_id) = user_id);

alter table tmp_questions_matching_chunks_insert enable row level security;

-- Check if the user is authenticated to insert a modified question
create policy "authenticated_all" on tmp_questions_matching_chunks_insert
for all
to public
using ((select auth.uid() as user_id) is not null)
with check ((select auth.uid() as user_id) is not null);