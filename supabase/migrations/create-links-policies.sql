create policy "all_users"
on "public"."links"
as PERMISSIVE
for ALL
to public
using (
TRUE
);


create policy "all_users"
on "public"."tmp_links_insert"
as PERMISSIVE
for ALL
to public
using (
TRUE
);

create policy "all_users"
on "public"."tmp_links_update"
as PERMISSIVE
for ALL
to public
using (
TRUE
);

create policy "all_users"
on "public"."tmp_links_delete"
as PERMISSIVE
for ALL
to public
using (
TRUE
);