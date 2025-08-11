create policy "all_users" on vectors
for all
to public
using (true);

create policy "all_users" on tmp_vectors_insert
for all
to public
using (true);