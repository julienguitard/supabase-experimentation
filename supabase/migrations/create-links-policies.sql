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

alter table tmp_links_insert enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."tmp_links_insert"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

alter table tmp_links_update enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."tmp_links_update"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);

alter table tmp_links_delete enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."tmp_links_delete"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
) with check ((select auth.uid() as user_id) is not null);