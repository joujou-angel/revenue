-- Create agent_rewards table
create table public.agent_rewards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null default auth.uid(),
  contract_id uuid references public.contracts(id),
  amount numeric not null,
  date date not null default current_date,
  description text,
  type text check (type in ('automatic', 'manual')) not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.agent_rewards enable row level security;

-- Create Policy
create policy "Users can view own rewards"
  on public.agent_rewards for select
  using (auth.uid() = user_id);

create policy "Users can insert own rewards"
  on public.agent_rewards for insert
  with check (auth.uid() = user_id);

-- Create Function for Auto-Commission (2%)
create or replace function public.handle_new_contract_commission()
returns trigger as $$
begin
  insert into public.agent_rewards (user_id, contract_id, amount, date, description, type)
  values (
    new.user_id,
    new.id,
    new.total_amount * 0.02, -- 2% Commission
    new.sign_date,
    '合約佣金 (2%)',
    'automatic'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create Trigger
create trigger on_contract_created
  after insert on public.contracts
  for each row execute procedure public.handle_new_contract_commission();
