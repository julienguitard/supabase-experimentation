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

alter table tmp_contents_insert enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."tmp_contents_insert"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

