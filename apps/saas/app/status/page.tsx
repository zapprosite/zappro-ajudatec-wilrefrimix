'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

type Metrics = {
  cpuPercent: number
  ramBytes: number
  reqPerSec: number
  avgLatencyMs: number
  errors1m: number
  connections: number
}

type StatusPayload = {
  status: string
  metrics: Metrics
}

export default function StatusPage() {
  const [data, setData] = useState<StatusPayload | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const timer = useRef<number | null>(null)

  const ramGB = useMemo(() => {
    const bytes = data?.metrics.ramBytes || 0
    return Math.round((bytes / (1024 ** 3)) * 100) / 100
  }, [data])

  useEffect(() => {
    const tick = async () => {
      try {
        const r = await fetch('/api/status')
        if (r.ok) {
          const j = await r.json()
          setData({ status: j.status, metrics: j.metrics })
        }
      } catch {}
    }
    tick()
    timer.current = window.setInterval(tick, 2000)
    return () => { if (timer.current) window.clearInterval(timer.current) }
  }, [])

  useEffect(() => {
    const es = new EventSource('/api/logs/stream')
    es.onmessage = (ev) => { setLogs((prev) => [...prev.slice(-99), ev.data]) }
    es.onerror = () => { es.close() }
    return () => { es.close() }
  }, [])

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Status do Servidor</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded"><div className="text-sm text-slate-500">Estado</div><div className="text-xl font-semibold">{data?.status || '...'}</div></div>
        <div className="p-4 border rounded"><div className="text-sm text-slate-500">CPU</div><div className="text-xl font-semibold">{data?.metrics.cpuPercent ?? 0}%</div></div>
        <div className="p-4 border rounded"><div className="text-sm text-slate-500">RAM</div><div className="text-xl font-semibold">{ramGB} GB</div></div>
        <div className="p-4 border rounded"><div className="text-sm text-slate-500">Req/s</div><div className="text-xl font-semibold">{data?.metrics.reqPerSec ?? 0}</div></div>
        <div className="p-4 border rounded"><div className="text-sm text-slate-500">Latência média</div><div className="text-xl font-semibold">{data?.metrics.avgLatencyMs ?? 0} ms</div></div>
        <div className="p-4 border rounded"><div className="text-sm text-slate-500">Erros (1m)</div><div className="text-xl font-semibold">{data?.metrics.errors1m ?? 0}</div></div>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-2">Logs (SSE)</h2>
        <div className="h-64 overflow-auto border rounded p-2 text-sm font-mono bg-slate-50">
          {logs.map((l, i) => (<div key={i}>{l}</div>))}
        </div>
      </section>
    </main>
  )
}
