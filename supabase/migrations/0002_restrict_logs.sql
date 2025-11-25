-- Drop policies that allow authenticated users to read logs
drop policy if exists monitor_route_metrics_select_authenticated on public.monitor_route_metrics;
drop policy if exists monitor_logs_select_authenticated on public.monitor_logs;

-- Ensure service role can still do everything (insert is already there, add select/all just in case or rely on service role bypass)
-- Service role bypasses RLS by default, so we don't strictly need policies for it, but the previous file added insert policy.
-- We will just remove the public/authenticated access.
