-- Users table
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    hashed_password text not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Chat rooms table
create table if not exists chat_rooms (
    id uuid primary key default gen_random_uuid(),
    name text,
    user_id uuid references users(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Characters table
create table if not exists characters (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    user_id uuid references users(id) on delete cascade,
    status text default 'pending',
    model_url text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Messages table
create table if not exists messages (
    id uuid primary key default gen_random_uuid(),
    chat_room_id uuid references chat_rooms(id) on delete cascade,
    sender_id uuid references users(id) on delete set null,
    content text not null,
    role text not null, -- 'user' or 'character'
    created_at timestamp with time zone default timezone('utc'::text, now())
); 