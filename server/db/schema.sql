-- Supabase schema for CommunityCloset.
-- Apply this file in the Supabase SQL Editor. App data is stored as JSONB
-- records because the UI uses denormalized display models for its collections.

create table if not exists public.app_records (
  collection text not null check (collection in (
    'users', 'items', 'transactions', 'wishlist', 'categories',
    'complaints', 'reports', 'notifications', 'messages', 'reviews', 'badges'
  )),
  record_id text not null,
  owner_id uuid references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, record_id)
);

create index if not exists app_records_owner_collection_idx
  on public.app_records (owner_id, collection);
create index if not exists app_records_payload_gin_idx
  on public.app_records using gin (payload);

alter table public.app_records enable row level security;

grant select, insert, update, delete on public.app_records to authenticated;
revoke all on public.app_records from anon, public;

create or replace function public.set_communitycloset_record_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_communitycloset_record_updated_at on public.app_records;
create trigger set_communitycloset_record_updated_at
before update on public.app_records
for each row execute procedure public.set_communitycloset_record_updated_at();

create or replace function public.is_communitycloset_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

create or replace function public.is_communitycloset_user_active()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select records.payload ->> 'status' = 'active'
    from public.app_records as records
    where records.collection = 'users'
      and records.record_id = auth.uid()::text
  ), false);
$$;

create or replace function public.get_communitycloset_impact()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null
     or (
       not public.is_communitycloset_admin()
       and not public.is_communitycloset_user_active()
     ) then
    raise exception 'An active account is required to view community metrics'
      using errcode = '42501';
  end if;

  return (
    select jsonb_build_object(
      'itemsReused', (
        select count(*)
        from public.app_records
        where collection = 'transactions'
          and payload ->> 'status' = 'completed'
      ),
      'kgCo2Diverted', round((
        select count(*) * 2.8
        from public.app_records
        where collection = 'transactions'
          and payload ->> 'status' = 'completed'
      ), 1),
      'moneySavedInr', (
        select count(*) * 450
        from public.app_records
        where collection = 'transactions'
          and payload ->> 'status' = 'completed'
      ),
      'activeLendersCount', (
        select count(distinct payload ->> 'userId')
        from public.app_records
        where collection = 'items'
      ),
      'totalUsers', (
        select count(*)
        from public.app_records
        where collection = 'users'
          and payload ->> 'status' = 'active'
      ),
      'updatedAt', now()
    )
  );
end;
$$;

revoke all on function public.get_communitycloset_impact() from public, anon;
grant execute on function public.get_communitycloset_impact() to authenticated;

create or replace function public.validate_communitycloset_record_owner()
returns trigger
language plpgsql
as $$
declare
  expected_owner uuid;
begin
  case new.collection
    when 'users' then expected_owner := (new.payload ->> 'id')::uuid;
    when 'items' then expected_owner := (new.payload ->> 'userId')::uuid;
    when 'transactions' then expected_owner := (new.payload ->> 'requesterId')::uuid;
    when 'wishlist' then expected_owner := (new.payload ->> 'userId')::uuid;
    when 'complaints' then expected_owner := (new.payload ->> 'userId')::uuid;
    when 'reports' then expected_owner := (new.payload ->> 'reporterId')::uuid;
    when 'messages' then expected_owner := (new.payload ->> 'senderId')::uuid;
    when 'reviews' then expected_owner := (new.payload ->> 'reviewerId')::uuid;
    when 'badges' then expected_owner := (new.payload ->> 'userId')::uuid;
    when 'notifications' then expected_owner := auth.uid();
    when 'categories' then expected_owner := null;
  end case;

  if new.owner_id is distinct from expected_owner then
    raise exception 'Record owner does not match its payload';
  end if;
  if new.collection = 'users'
     and not public.is_communitycloset_admin()
     and (
       new.payload ->> 'role' is distinct from 'user'
       or new.payload ->> 'status' is distinct from 'active'
     ) then
    raise exception 'Only an administrator can change profile role or status';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_communitycloset_record_owner on public.app_records;
create trigger validate_communitycloset_record_owner
before insert or update on public.app_records
for each row execute procedure public.validate_communitycloset_record_owner();

drop policy if exists "read app records" on public.app_records;
create policy "read app records"
on public.app_records for select to authenticated
using (
  public.is_communitycloset_admin()
  or (collection = 'users' and owner_id = auth.uid())
  or (
    public.is_communitycloset_user_active()
    and (
      collection = 'categories'
      or collection = 'items'
      or collection = 'reviews'
      or collection = 'badges'
      or owner_id = auth.uid()
      or (collection = 'transactions' and payload ->> 'ownerId' = auth.uid()::text)
      or (collection = 'messages' and payload ->> 'receiverId' = auth.uid()::text)
      or (collection = 'notifications' and payload ->> 'userId' = auth.uid()::text)
      or (collection = 'reviews' and payload ->> 'revieweeId' = auth.uid()::text)
    )
  )
);

drop policy if exists "insert owned app records" on public.app_records;
create policy "insert owned app records"
on public.app_records for insert to authenticated
with check (
  public.is_communitycloset_admin()
  or (
    public.is_communitycloset_user_active()
    and owner_id = auth.uid()
    and collection not in ('categories', 'badges')
    and (
        collection <> 'users'
        or (payload ->> 'role' = 'user' and payload ->> 'status' = 'active')
    )
  )
);

drop policy if exists "update owned app records" on public.app_records;
create policy "update owned app records"
on public.app_records for update to authenticated
using (
  public.is_communitycloset_admin()
  or (
    public.is_communitycloset_user_active()
    and (
      owner_id = auth.uid()
      or (collection = 'transactions' and payload ->> 'ownerId' = auth.uid()::text)
      or (collection = 'messages' and payload ->> 'receiverId' = auth.uid()::text)
      or (collection = 'notifications' and payload ->> 'userId' = auth.uid()::text)
    )
  )
)
with check (
  public.is_communitycloset_admin()
  or (
    public.is_communitycloset_user_active()
    and
    owner_id = auth.uid()
    and collection not in ('categories', 'badges')
    and (
      collection <> 'users'
      or (payload ->> 'role' = 'user' and payload ->> 'status' = 'active')
    )
  )
  or (
    public.is_communitycloset_user_active()
    and (
      (collection = 'transactions' and payload ->> 'ownerId' = auth.uid()::text)
      or (collection = 'messages' and payload ->> 'receiverId' = auth.uid()::text)
      or (collection = 'notifications' and payload ->> 'userId' = auth.uid()::text)
    )
  )
);

drop policy if exists "delete owned app records" on public.app_records;
create policy "delete owned app records"
on public.app_records for delete to authenticated
using (
  public.is_communitycloset_admin()
  or (
    public.is_communitycloset_user_active()
    and owner_id = auth.uid()
    and collection not in ('categories', 'badges')
  )
);

create or replace function public.award_communitycloset_badges()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  awarded_user uuid;
  awarded_type text;
  awarded_title text;
  awarded_description text;
  awarded_icon text;
begin
  if new.collection = 'items' and tg_op = 'UPDATE' then
    return new;
  end if;

  if new.collection = 'items' then
    awarded_user := (new.payload ->> 'userId')::uuid;
    awarded_type := 'first_share';
    awarded_title := 'First Share Hero';
    awarded_description := 'Shared your first resource with Katraj neighbors';
    awarded_icon := 'Sparkles';
  elsif new.collection = 'transactions' and new.payload ->> 'status' = 'completed' then
    awarded_user := (new.payload ->> 'requesterId')::uuid;
    awarded_type := 'reuse_hero';
    awarded_title := 'Reuse Hero';
    awarded_description := 'Completed a resource borrow and prevented landfill waste';
    awarded_icon := 'Leaf';
  else
    return new;
  end if;

  insert into public.app_records (collection, record_id, owner_id, payload)
  values (
    'badges',
    awarded_user::text || ':' || awarded_type,
    awarded_user,
    jsonb_build_object(
      'id', awarded_user::text || ':' || awarded_type,
      'userId', awarded_user,
      'badgeType', awarded_type,
      'title', awarded_title,
      'description', awarded_description,
      'icon', awarded_icon,
      'earnedAt', now()
    )
  )
  on conflict (collection, record_id) do nothing;
  return new;
end;
$$;

drop trigger if exists award_communitycloset_badges on public.app_records;
create trigger award_communitycloset_badges
after insert or update on public.app_records
for each row execute procedure public.award_communitycloset_badges();

create or replace function public.create_communitycloset_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile jsonb;
begin
  profile := jsonb_build_object(
    'id', new.id,
    'email', new.email,
    'name', coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    'role', 'user',
    'avatar', new.raw_user_meta_data ->> 'avatar_url',
    'bio', new.raw_user_meta_data ->> 'bio',
    'locationAddress', coalesce(new.raw_user_meta_data ->> 'location_address', 'Katraj, Pune, Maharashtra'),
    'lat', 18.4575,
    'lng', 73.8508,
    'ecoPoints', 100,
    'co2SavedKg', 0,
    'verified', new.email_confirmed_at is not null,
    'status', 'active',
    'createdAt', new.created_at
  );

  insert into public.app_records (collection, record_id, owner_id, payload)
  values ('users', new.id::text, new.id, profile)
  on conflict (collection, record_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_communitycloset_user_created on auth.users;
create trigger on_communitycloset_user_created
after insert on auth.users
for each row execute procedure public.create_communitycloset_profile();

insert into public.app_records (collection, record_id, owner_id, payload)
values
  ('categories', 'cat-1', null, '{"id":"cat-1","name":"Clothing & Accessories","type":"material","icon":"Shirt","description":"Clothes, shoes, bags, and accessories"}'),
  ('categories', 'cat-2', null, '{"id":"cat-2","name":"Books & Study","type":"material","icon":"BookOpen","description":"Books, textbooks, notebooks, and study materials"}'),
  ('categories', 'cat-3', null, '{"id":"cat-3","name":"Furniture","type":"material","icon":"Armchair","description":"Chairs, tables, shelves, and other furniture"}'),
  ('categories', 'cat-4', null, '{"id":"cat-4","name":"Kitchen Items","type":"tool","icon":"Utensils","description":"Cookware, utensils, appliances, and kitchen items"}'),
  ('categories', 'cat-5', null, '{"id":"cat-5","name":"Electronics","type":"tool","icon":"Laptop","description":"Laptops, chargers, speakers, and electronic devices"}'),
  ('categories', 'cat-6', null, '{"id":"cat-6","name":"Sports & Fitness","type":"tool","icon":"Dumbbell","description":"Sports equipment, fitness gear, and accessories"}'),
  ('categories', 'cat-7', null, '{"id":"cat-7","name":"Toys & Games","type":"material","icon":"Gamepad2","description":"Toys, board games, puzzles, and recreational items"}'),
  ('categories', 'cat-8', null, '{"id":"cat-8","name":"Home & Utility","type":"tool","icon":"House","description":"Household items, cleaning tools, and useful utilities"}')
on conflict (collection, record_id) do nothing;
