-- PostgREST exposes the public schema. Deny direct anon/authenticated access
-- to every application table by default; Prisma uses the server database role.
DO $$
DECLARE table_name text;
BEGIN
  FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;
END $$;

-- These legacy tables contain only pre-aggregated public statistics and are
-- the only public-schema records intentionally read via the Supabase anon key.
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['infographic_stats', 'age_group_stats', 'education_stats', 'occupation_stats', 'population_trends']
  LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS public_aggregate_read ON public.%I', table_name);
      EXECUTE format('CREATE POLICY public_aggregate_read ON public.%I FOR SELECT TO anon, authenticated USING (true)', table_name);
    END IF;
  END LOOP;
END $$;
