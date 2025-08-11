create policy "all_users" on fragments
for all
to public
using (true);

create policy "all_users" on tmp_fragments_insert
for all
to public
using (true);

