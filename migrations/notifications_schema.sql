-- Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'message', 'session', 'review', 'system'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    link TEXT, -- Link to where the user can take action
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for Notifications
-- A user can see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT
    USING (auth.uid() = user_id);

-- A user can update their own notifications (e.g. mark as read)
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- System/Service Role can insert (or any authenticated user if we want them to trigger notifications for others)
-- For now, let's allow authenticated users to insert so they can trigger notifications via library functions
CREATE POLICY "Authenticated users can create notifications" ON notifications
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Real-time setup
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
