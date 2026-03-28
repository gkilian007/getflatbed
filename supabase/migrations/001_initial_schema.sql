-- Users profile (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  plan text default 'free' check (plan in ('free', 'premium')),
  stripe_customer_id text,
  telegram_chat_id text,
  origin_airports text[] default '{}',
  dest_preferences text[] default '{}',
  miles_level text default 'beginner' check (miles_level in ('beginner', 'intermediate', 'expert')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Deals table
create table public.deals (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('error_fare', 'miles', 'flash_sale', 'voucher')),
  origin text not null,
  destination text not null,
  airline text not null,
  price_original numeric,
  price_deal numeric,
  savings_pct integer,
  dates_available text,
  affiliate_url text,
  is_premium_only boolean default false,
  status text default 'active' check (status in ('active', 'expired')),
  verified_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Subscriptions
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan text not null,
  status text not null,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz default now()
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.deals enable row level security;
alter table public.subscriptions enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Active deals visible to all" on public.deals for select using (status = 'active');
create policy "Users can view own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert sample deals
insert into public.deals (type, origin, destination, airline, price_original, price_deal, savings_pct, dates_available, is_premium_only, status) values
('error_fare', 'MAD', 'JFK', 'Iberia', 3180, 290, 91, 'Jun–Sep 2026', false, 'active'),
('miles', 'BCN', 'NRT', 'Turkish Airlines', 5400, 45000, 92, 'Oct–Nov 2026', true, 'active'),
('flash_sale', 'MAD', 'MIA', 'Air Europa', 2100, 480, 77, 'Feb–Apr 2026', false, 'active'),
('miles', 'MAD', 'DXB', 'Emirates', 3800, 60000, 90, 'Any date', true, 'active'),
('error_fare', 'MAD', 'GRU', 'Iberia', 4200, 380, 91, 'May–Jul 2026', true, 'active'),
('flash_sale', 'BCN', 'LAX', 'Lufthansa', 3600, 620, 83, 'Mar–May 2026', false, 'active');
