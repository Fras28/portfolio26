import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();
    const ua = req.headers.get('user-agent') || undefined;
    const referrer = req.headers.get('referer') || undefined;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || undefined;

    await prisma.pageVisit.create({
      data: {
        path: path || '/',
        userAgent: ua,
        referrer,
        ip,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
