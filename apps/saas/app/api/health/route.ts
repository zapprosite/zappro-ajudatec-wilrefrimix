import { NextResponse } from 'next/server';
import { record } from '../../../lib/monitor';

export async function GET() {
  const t0 = Date.now()
  const res = NextResponse.json({ status: 'OK' }, { status: 200 })
  const dur = Date.now() - t0
  record('/api/health', dur, 200)
  return res
}
