create policy "all_users" on tokens
for all
to public
using (true);

create policy "all_users" on tmp_tokens_insert
for all
to public
using (true);