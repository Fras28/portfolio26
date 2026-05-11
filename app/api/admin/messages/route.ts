import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ messages });
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, read, replied } = await req.json();
  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      ...(read !== undefined && { read }),
      ...(replied !== undefined && { replied }),
    },
  });

  return NextResponse.json({ message: updated });
}
