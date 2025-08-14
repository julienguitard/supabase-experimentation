alter table vectors enable row level security;

-- Check if the user is the owner of the vector
create policy "authenticated_all" on vectors
for all
to public
using ((select auth.uid() as user_id) = user_id)
with check ((select auth.uid() as user_id) = user_id);

alter table tmp_vectors_insert enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all" on tmp_vectors_insert
for all
to public
using ((select auth.uid() as user_id) is not null)
with check ((select auth.uid() as user_id) is not null);