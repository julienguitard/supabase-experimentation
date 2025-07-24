create policy "all_users"
on "public"."contents"
as PERMISSIVE
for ALL
to public
using (
TRUE
);


create policy "all_users"
on "public"."tmp_contents_insert"
as PERMISSIVE
for ALL
to public
using (
TRUE
);

