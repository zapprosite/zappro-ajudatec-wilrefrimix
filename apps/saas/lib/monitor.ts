import os from 'os'
import { createClient } from '@supabase/supabase-js'

type Level = 'info' | 'warn' | 'error'
type LogEvent = { ts: number; level: Level; msg: string }
type RouteEvent = { ts: number; route: string; dur: number; status: number }

const logs: LogEvent[] = []
const routes: RouteEvent[] = []
const clients: Set<{ write: (data: string) => void }> = new Set()
let lastCpu = os.loadavg()[0]
let lastCpuTs = Date.now()

function pushLog(level: Level, msg: string) {
  const ev = { ts: Date.now(), level, msg }
  logs.push(ev)
  while (logs.length > 1000) logs.shift()
  const line = `data: ${JSON.stringify(ev)}\n\n`
  for (const c of clients) c.write(line)
  persistLog(ev).catch(() => {})
}

export function record(route: string, dur: number, status: number) {
  const ev = { ts: Date.now(), route, dur, status }
  routes.push(ev)
  while (routes.length > 5000) routes.shift()
  persistRoute(ev).catch(() => {})
}

export function log(level: Level, msg: string) { pushLog(level, msg) }

export function attachClient(write: (data: string) => void) {
  const c = { write }
  clients.add(c)
  return () => { clients.delete(c) }
}

export function connections(): number { return clients.size }

function cpuPercent(): number {
  const now = Date.now()
  const curr = os.loadavg()[0]
  const cores = Math.max(1, os.cpus().length)
  lastCpu = curr
  lastCpuTs = now
  const pct = Math.min(100, (curr / cores) * 100)
  return Math.round(pct * 10) / 10
}

function ramBytes(): number { return process.memoryUsage().rss }

export function snapshot() {
  const now = Date.now()
  const windowMs = 60_000
  const windowRoutes = routes.filter(r => now - r.ts <= windowMs)
  const reqCount = windowRoutes.length
  const latencyAvg = reqCount > 0 ? windowRoutes.reduce((a, b) => a + b.dur, 0) / reqCount : 0
  const errors = windowRoutes.filter(r => r.status >= 500).length
  const cpu = cpuPercent()
  const ram = ramBytes()
  const conns = clients.size
  const rate = reqCount / (windowMs / 1000)
  const stable = cpu <= 70 && ram <= 1.5 * 1024 * 1024 * 1024 && latencyAvg <= 200 && errors === 0 && rate >= 50
  return {
    status: stable ? 'Estável' : 'Degradado',
    metrics: {
      cpuPercent: cpu,
      ramBytes: ram,
      reqPerSec: Math.round(rate),
      avgLatencyMs: Math.round(latencyAvg),
      errors1m: errors,
      connections: conns,
    },
    samples: {
      lastRoutes: windowRoutes.slice(-50),
      lastLogs: logs.slice(-100),
    }
  }
}

export function validatePackages(pkgs: Record<string, string>) {
  const baseline: Record<string, string> = {
    next: '^15.0.4',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    '@supabase/supabase-js': '^2.47.10',
    stripe: '^16.6.0',
    '@stripe/stripe-js': '^4.8.0'
  }
  const mismatches: Record<string, { expected: string; actual: string }> = {}
  for (const [name, expected] of Object.entries(baseline)) {
    const actual = pkgs[name]
    if (!actual || actual !== expected) mismatches[name] = { expected, actual: actual || '' }
  }
  return { ok: Object.keys(mismatches).length === 0, mismatches }
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
const supa = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

async function persistRoute(ev: RouteEvent) {
  if (!supa) return
  const ttlAt = new Date(ev.ts + 7 * 24 * 60 * 60 * 1000).toISOString()
  await supa.from('monitor_route_metrics').insert({ ts: new Date(ev.ts).toISOString(), route: ev.route, dur_ms: ev.dur, status: ev.status, ttl_at: ttlAt }).select().throwOnError()
}

async function persistLog(ev: LogEvent) {
  if (!supa) return
  const ttlAt = new Date(ev.ts + 7 * 24 * 60 * 60 * 1000).toISOString()
  await supa.from('monitor_logs').insert({ ts: new Date(ev.ts).toISOString(), level: ev.level, msg: ev.msg, ttl_at: ttlAt }).select().throwOnError()
}
