alter table chunks enable row level security;

-- Check if the user is the owner of the chunk
create policy "authenticated_all" on chunks
for all
to public
using ((select auth.uid() as user_id) = user_id);

alter table tmp_chunks_insert enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all" on tmp_chunks_insert
for all
to public
using ((select auth.uid() as user_id) = user_id);