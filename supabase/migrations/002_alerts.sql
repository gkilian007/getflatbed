create table public.alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  origin text,
  destination text,
  max_price numeric,
  deal_types text[] default '{}',
  channels text[] default '{"email"}',
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.alerts enable row level security;

create policy "Users manage own alerts" on public.alerts
  for all using (auth.uid() = user_id);

-- Add telegram_chat_id to profiles if not exists
alter table public.profiles add column if not exists telegram_chat_id text;

-- Add one-time connect code columns for Telegram linking
alter table public.profiles add column if not exists telegram_connect_code text;
alter table public.profiles add column if not exists telegram_connect_code_expires_at timestamptz;
