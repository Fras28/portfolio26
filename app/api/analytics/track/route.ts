import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { type, target, path } = await req.json();
    if (!type || !target) return NextResponse.json({ ok: false }, { status: 400 });

    await prisma.interaction.create({
      data: { type, target, path: path || '/' },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Track error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
