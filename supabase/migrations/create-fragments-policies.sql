alter table fragments enable row level security;

-- Check if the user is the owner of the fragment
create policy "authenticated_all" on fragments
for all
to public
using ((select auth.uid() as user_id) = user_id)
with check ((select auth.uid() as user_id) = user_id);

alter table tmp_fragments_insert enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all" on tmp_fragments_insert
for all
to public
using ((select auth.uid() as user_id) is not null)
with check ((select auth.uid() as user_id) is not null);

