create policy "all_users" on chunks
for all
to public
using (true);

create policy "all_users" on tmp_chunks_insert
for all
to public
using (true);