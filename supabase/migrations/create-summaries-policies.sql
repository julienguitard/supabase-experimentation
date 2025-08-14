alter table summaries enable row level security;

-- Check if the user is the owner of the summary
create policy "authenticated_all"
on "public"."summaries"
as permissive
for all
to public
using (
(select auth.uid() as user_id) = user_id
)
with check (
(select auth.uid() as user_id) = user_id
);

alter table tmp_summaries_insert enable row level security;

-- Check if the user is authenticated
create policy "authenticated_all"
on "public"."tmp_summaries_insert"
as permissive
for all
to public
using (
(select auth.uid() as user_id) is not null
)
with check (
(select auth.uid() as user_id) is not null
);