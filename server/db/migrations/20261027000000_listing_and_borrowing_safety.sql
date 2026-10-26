-- Run after server/db/schema.sql. Listing removal is an archive operation so
-- transaction snapshots and wishlist/report references remain intact.

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
  elsif new.collection = 'items' then
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

update public.app_records as listing
set payload = jsonb_set(listing.payload, '{status}', '"borrowed"'::jsonb, true)
where listing.collection = 'items'
  and exists (
    select 1
    from public.app_records as transaction_record
    where transaction_record.collection = 'transactions'
      and transaction_record.payload ->> 'listingId' = listing.record_id
      and transaction_record.payload ->> 'type' = 'borrow'
      and transaction_record.payload ->> 'status' in ('accepted', 'active')
  );

create or replace function public.guard_communitycloset_listing_record()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  listing_type text;
  listing_status text;
  listing_id text;
  validate_listing_terms boolean;
begin
  if new.collection <> 'items' then
    return new;
  end if;

  listing_type := new.payload ->> 'type';
  listing_status := new.payload ->> 'status';
  listing_id := new.record_id;
  if tg_op = 'INSERT' then
    validate_listing_terms := true;
  else
    validate_listing_terms :=
      new.payload ->> 'type' is distinct from old.payload ->> 'type'
      or new.payload ->> 'depositAmount' is distinct from old.payload ->> 'depositAmount'
      or new.payload ->> 'maxDurationDays' is distinct from old.payload ->> 'maxDurationDays'
      or new.payload ->> 'salePrice' is distinct from old.payload ->> 'salePrice'
      or new.payload ->> 'exchangePreference' is distinct from old.payload ->> 'exchangePreference';
  end if;

  if tg_op = 'UPDATE' then
    if new.payload ->> 'userId' is distinct from old.payload ->> 'userId' then
      raise exception 'A listing owner cannot be changed';
    end if;

    if new.payload ->> 'type' is distinct from old.payload ->> 'type'
       and exists (
         select 1
         from public.app_records as transaction_record
         where transaction_record.collection = 'transactions'
           and transaction_record.payload ->> 'listingId' = listing_id
           and transaction_record.payload ->> 'status' in ('pending', 'accepted', 'active')
       ) then
      raise exception 'A listing type cannot change while requests are open';
    end if;
  end if;

  if listing_status in ('available', 'archived')
     and exists (
       select 1
       from public.app_records as transaction_record
       where transaction_record.collection = 'transactions'
         and transaction_record.payload ->> 'listingId' = listing_id
         and transaction_record.payload ->> 'type' = 'borrow'
         and transaction_record.payload ->> 'status' in ('accepted', 'active')
     ) then
    raise exception 'A listing with an active borrow cannot be made available or archived';
  end if;

  if listing_status = 'borrowed'
     and not exists (
       select 1
       from public.app_records as transaction_record
       where transaction_record.collection = 'transactions'
         and transaction_record.payload ->> 'listingId' = listing_id
         and transaction_record.payload ->> 'type' = 'borrow'
         and transaction_record.payload ->> 'status' in ('accepted', 'active')
     ) then
    raise exception 'A listing can only be marked borrowed by an accepted borrow request';
  end if;

  if listing_type in ('lend', 'borrow') and validate_listing_terms then
    if coalesce((new.payload ->> 'depositAmount')::numeric, -1) < 0
       or coalesce((new.payload ->> 'maxDurationDays')::integer, 0) < 1 then
      raise exception 'Borrow listings require a non-negative deposit and a positive duration';
    end if;
  end if;

  if listing_type = 'sale' and validate_listing_terms
     and coalesce((new.payload ->> 'salePrice')::numeric, -1) < 0 then
    raise exception 'Sale listings require a non-negative sale price';
  end if;

  if listing_type = 'exchange' and validate_listing_terms
     and nullif(btrim(new.payload ->> 'exchangePreference'), '') is null then
    raise exception 'Exchange listings require an exchange preference';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_communitycloset_listing_record on public.app_records;
create trigger guard_communitycloset_listing_record
before insert or update on public.app_records
for each row execute procedure public.guard_communitycloset_listing_record();

create or replace function public.guard_communitycloset_borrow_transaction()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requester_id uuid;
  listing_owner_id uuid;
  listing_record public.app_records%rowtype;
  new_status text;
  old_status text;
begin
  if new.collection <> 'transactions' then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.payload ->> 'type' = 'borrow'
       and new.payload ->> 'type' is distinct from 'borrow' then
      raise exception 'A borrow request type cannot be changed';
    end if;
  end if;
  if new.payload ->> 'type' is distinct from 'borrow' then
    return new;
  end if;

  requester_id := nullif(new.payload ->> 'requesterId', '')::uuid;
  listing_owner_id := nullif(new.payload ->> 'ownerId', '')::uuid;
  new_status := new.payload ->> 'status';
  if tg_op = 'UPDATE' then
    old_status := old.payload ->> 'status';
    if new.payload ->> 'listingId' is distinct from old.payload ->> 'listingId'
       or new.payload ->> 'requesterId' is distinct from old.payload ->> 'requesterId'
       or new.payload ->> 'ownerId' is distinct from old.payload ->> 'ownerId'
       or new.payload ->> 'type' is distinct from old.payload ->> 'type'
       or new.payload ->> 'startDate' is distinct from old.payload ->> 'startDate'
       or new.payload ->> 'endDate' is distinct from old.payload ->> 'endDate'
       or new.payload ->> 'depositPaid' is distinct from old.payload ->> 'depositPaid' then
      raise exception 'Borrow request details, participants, and listing cannot be changed';
    end if;
  end if;

  if requester_id is null
     or listing_owner_id is null
     or new.owner_id is distinct from requester_id then
    raise exception 'Borrow request ownership is invalid';
  end if;

  select records.*
  into listing_record
  from public.app_records as records
  where records.collection = 'items'
    and records.record_id = new.payload ->> 'listingId'
  for update;

  if not found then
    raise exception 'The listing does not exist';
  end if;
  if (listing_record.payload ->> 'userId')::uuid is distinct from listing_owner_id then
    raise exception 'Borrow request owner does not match the listing owner';
  end if;
  if requester_id = listing_owner_id then
    raise exception 'Users cannot borrow their own listings';
  end if;
  if coalesce(listing_record.payload ->> 'type', '') not in ('lend', 'borrow')
     and (
       tg_op <> 'UPDATE'
       or old_status not in ('accepted', 'active')
       or new_status not in (old_status, 'completed')
     ) then
    raise exception 'Only borrow listings can receive new borrow requests';
  end if;

  if tg_op = 'INSERT' then
    if auth.uid() is null
       or auth.uid() is distinct from requester_id
       or new_status is distinct from 'pending' then
      raise exception 'A signed-in borrower may only create their own pending request';
    end if;
    if listing_record.payload ->> 'status' is distinct from 'available' then
      raise exception 'This listing is not available to borrow';
    end if;
    if nullif(new.payload ->> 'startDate', '') is null
       or nullif(new.payload ->> 'endDate', '') is null
       or coalesce((listing_record.payload ->> 'maxDurationDays')::integer, 0) < 1
       or (new.payload ->> 'endDate')::date < (new.payload ->> 'startDate')::date
       or (new.payload ->> 'endDate')::date - (new.payload ->> 'startDate')::date
          > (listing_record.payload ->> 'maxDurationDays')::integer then
      raise exception 'The requested borrow period exceeds the listing duration';
    end if;
    if exists (
      select 1
      from public.app_records as prior_request
      where prior_request.collection = 'transactions'
        and prior_request.record_id <> new.record_id
        and prior_request.payload ->> 'listingId' = new.payload ->> 'listingId'
        and prior_request.payload ->> 'requesterId' = requester_id::text
        and prior_request.payload ->> 'type' = 'borrow'
        and prior_request.payload ->> 'status' = 'pending'
    ) then
      raise exception 'You already have a pending request for this listing';
    end if;
    return new;
  end if;

  if new_status is not distinct from old_status then
    return new;
  end if;

  if new_status in ('accepted', 'active') then
    if auth.uid() is distinct from listing_owner_id
       or (new_status = 'accepted' and old_status <> 'pending')
       or (new_status = 'active' and old_status not in ('pending', 'accepted')) then
      raise exception 'Only the listing owner may accept a pending request';
    end if;
    if old_status not in ('accepted', 'active')
       and listing_record.payload ->> 'status' is distinct from 'available' then
      raise exception 'This listing is no longer available';
    end if;
    if exists (
      select 1
      from public.app_records as active_request
      where active_request.collection = 'transactions'
        and active_request.record_id <> new.record_id
        and active_request.payload ->> 'listingId' = new.payload ->> 'listingId'
        and active_request.payload ->> 'type' = 'borrow'
        and active_request.payload ->> 'status' in ('accepted', 'active')
    ) then
      raise exception 'Another borrow request already holds this listing';
    end if;
  elsif new_status in ('declined', 'rejected') then
    if auth.uid() is distinct from listing_owner_id or old_status <> 'pending' then
      raise exception 'Only the listing owner may decline a pending request';
    end if;
  elsif new_status = 'cancelled' then
    if auth.uid() is distinct from requester_id or old_status <> 'pending' then
      raise exception 'Only the borrower may cancel a pending request';
    end if;
  elsif new_status = 'completed' then
    if auth.uid() not in (requester_id, listing_owner_id)
       or old_status not in ('accepted', 'active') then
      raise exception 'Only a participant may complete an accepted borrow';
    end if;
  else
    raise exception 'Invalid borrow request status transition';
  end if;

  return new;
end;
$$;

create or replace function public.sync_communitycloset_borrowed_listing()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_status text;
  current_status text;
begin
  if new.collection <> 'transactions'
     or new.payload ->> 'type' is distinct from 'borrow' then
    return new;
  end if;

  current_status := new.payload ->> 'status';
  if tg_op = 'UPDATE' then
    previous_status := old.payload ->> 'status';
  end if;

  if current_status in ('accepted', 'active')
     and previous_status not in ('accepted', 'active') then
    update public.app_records
    set payload = jsonb_set(payload, '{status}', '"borrowed"'::jsonb, true)
    where collection = 'items'
      and record_id = new.payload ->> 'listingId'
      and payload ->> 'status' = 'available';
    if not found then
      raise exception 'This listing is no longer available to borrow';
    end if;
  elsif current_status = 'completed'
        and previous_status in ('accepted', 'active') then
    update public.app_records
    set payload = jsonb_set(payload, '{status}', '"available"'::jsonb, true)
    where collection = 'items'
      and record_id = new.payload ->> 'listingId'
      and payload ->> 'status' = 'borrowed';
    if not found then
      raise exception 'The borrowed listing could not be restored to available';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists guard_communitycloset_borrow_transaction on public.app_records;
create trigger guard_communitycloset_borrow_transaction
before insert or update on public.app_records
for each row execute procedure public.guard_communitycloset_borrow_transaction();

drop trigger if exists sync_communitycloset_borrowed_listing on public.app_records;
create trigger sync_communitycloset_borrowed_listing
after insert or update on public.app_records
for each row execute procedure public.sync_communitycloset_borrowed_listing();

revoke all on function public.guard_communitycloset_listing_record() from public, anon;
revoke all on function public.guard_communitycloset_borrow_transaction() from public, anon;
revoke all on function public.sync_communitycloset_borrowed_listing() from public, anon;

drop policy if exists "delete owned app records" on public.app_records;
create policy "delete owned app records"
on public.app_records for delete to authenticated
using (
  public.is_communitycloset_admin()
  or (
    public.is_communitycloset_user_active()
    and owner_id = auth.uid()
    and collection not in ('categories', 'badges', 'items', 'transactions')
  )
);
