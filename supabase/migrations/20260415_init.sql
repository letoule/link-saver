create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text,
  memo text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

alter table links enable row level security;

create policy "anon_select" on links for select using (true);
create policy "anon_insert" on links for insert with check (true);
create policy "anon_delete" on links for delete using (true);
