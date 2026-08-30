-- CmsPageStore is exposed through Supabase/PostgREST's public schema.
-- With no policies defined, enabling RLS denies anon/authenticated access while
-- preserving server-side Prisma access through the database connection.
ALTER TABLE "CmsPageStore" ENABLE ROW LEVEL SECURITY;
