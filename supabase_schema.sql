-- Create a table to store user portfolios
-- We use JSONB columns for flexibility and simplicity in storing the nested data structures
create table public.portfolios (
  user_id uuid references auth.users not null primary key,
  investments jsonb default '{}'::jsonb,
  return_rates jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.portfolios enable row level security;

-- Create policies to allow users to only access their own data

-- Policy for SELECT
create policy "Users can view their own portfolio" 
on public.portfolios for select 
using (auth.uid() = user_id);

-- Policy for INSERT (allows users to create their initial record)
create policy "Users can insert their own portfolio" 
on public.portfolios for insert 
with check (auth.uid() = user_id);

-- Policy for UPDATE
create policy "Users can update their own portfolio" 
on public.portfolios for update 
using (auth.uid() = user_id);

-- Function to handle updating the updated_at timestamp
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on public.portfolios
  for each row execute procedure moddatetime (updated_at);
