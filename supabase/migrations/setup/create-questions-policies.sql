alter table questions enable row level security;

-- Check if the user is the owner of the question
create policy "authenticated_all" on questions
for all
to public
using ((select auth.uid() as user_id) = user_id)
with check ((select auth.uid() as user_id) = user_id);

alter table tmp_questions_insert enable row level security;

-- Check if the user is authenticated to insert a question
create policy "authenticated_all" on tmp_questions_insert
for all
to public
using ((select auth.uid() as user_id) is not null)
with check ((select auth.uid() as user_id) is not null);