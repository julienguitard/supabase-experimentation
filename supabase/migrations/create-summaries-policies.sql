create policy "all_users"
on "public"."summaries"
as PERMISSIVE
for ALL
to public
using (
TRUE
);


create policy "all_users"
on "public"."tmp_summaries_insert"
as PERMISSIVE
for ALL
to public
using (
TRUE
);