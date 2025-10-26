-- Migration: Schedule expire-trials Edge Function with pg_cron
-- Story 3.4: Track Trial Expiration and Auto-Expire
-- Created: 2025-10-25
--
-- This migration sets up a daily cron job to invoke the expire-trials Edge Function
-- at midnight UTC (0 0 * * *) using pg_cron and pg_net extensions.
--
-- The job will:
-- 1. Check for trials where status = 'active' AND tier = 'trial' AND trial_ends_at < now()
-- 2. Update those subscriptions to status = 'expired'

-- Enable required extensions if not already enabled
-- pg_cron: PostgreSQL job scheduler (already enabled via Dashboard)
-- pg_net: Allows making HTTP requests from PostgreSQL
-- Note: pg_net extension must be enabled manually via Supabase Dashboard
-- Dashboard > Database > Extensions > Enable "pg_net"

-- Grant necessary permissions to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Grant usage on net schema for pg_net extension
GRANT USAGE ON SCHEMA net TO postgres;

-- Unschedule any existing expire-trials job (in case of re-running migration)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'expire-trials-daily') THEN
    PERFORM cron.unschedule('expire-trials-daily');
    RAISE NOTICE 'Unscheduled existing job: expire-trials-daily';
  END IF;
END $$;

-- Schedule the expire-trials Edge Function to run daily at midnight UTC
-- Cron syntax: '0 0 * * *' = minute=0, hour=0, every day, every month, every weekday
--
-- IMPORTANT: Requires Authorization header with anon key as per Supabase docs
-- Reference: https://supabase.com/docs/guides/cron/quickstart
SELECT cron.schedule(
  'expire-trials-daily',           -- Job name
  '0 0 * * *',                      -- Cron schedule: daily at midnight UTC
  $$
    SELECT net.http_post(
      url := 'https://wvzmjoeeprqfkmxwajhe.supabase.co/functions/v1/expire-trials',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2em1qb2VlcHJxZmtteHdhamhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzU1NDMsImV4cCI6MjA3NjI1MTU0M30.xEfqp_hqXj865FRf-gCTOhT0Y38Nbdhx84reIRvqNs4'
      ),
      body := jsonb_build_object(
        'scheduled_run', true,
        'timestamp', now()
      ),
      timeout_milliseconds := 60000   -- 60 second timeout
    ) AS request_id;
  $$
);

-- Verify the cron job was created
DO $$
DECLARE
  v_job_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_job_count
  FROM cron.job
  WHERE jobname = 'expire-trials-daily';

  IF v_job_count = 0 THEN
    RAISE EXCEPTION 'Failed to create cron job: expire-trials-daily';
  ELSE
    RAISE NOTICE 'Successfully created cron job: expire-trials-daily (runs daily at midnight UTC)';
  END IF;
END $$;

-- Query to check the job status (for manual verification):
-- SELECT * FROM cron.job WHERE jobname = 'expire-trials-daily';
--
-- Query to check job run history:
-- SELECT * FROM cron.job_run_details WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'expire-trials-daily') ORDER BY start_time DESC LIMIT 10;
--
-- To manually unschedule the job:
-- SELECT cron.unschedule('expire-trials-daily');
