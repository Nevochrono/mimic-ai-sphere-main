-- Users table policies
create policy "Users can view their own user row"
on users for select
using (auth.uid() = id);

create policy "Users can insert their own user row"
on users for insert
with check (auth.uid() = id);

-- Chat rooms table policies
create policy "Users can access their own chat rooms"
on chat_rooms for all
using (user_id = auth.uid());

-- Characters table policies
create policy "Users can access their own characters"
on characters for all
using (user_id = auth.uid());

-- Messages table policies
create policy "Users can access messages in their chat rooms"
on messages for all
using (
  chat_room_id in (
    select id from chat_rooms where user_id = auth.uid()
  )
); 