import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { subDays, startOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const days30ago = subDays(startOfDay(now), 30);
  const days7ago  = subDays(startOfDay(now), 7);

  const [
    totalVisits,
    visitsLast7,
    visitsLast30,
    totalInteractions,
    topPages,
    topInteractions,
    messages,
    unreadMessages,
    visitsByDay,
  ] = await Promise.all([
    prisma.pageVisit.count(),
    prisma.pageVisit.count({ where: { createdAt: { gte: days7ago } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: days30ago } } }),
    prisma.interaction.count(),
    prisma.pageVisit.groupBy({
      by: ['path'],
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 5,
    }),
    prisma.interaction.groupBy({
      by: ['target'],
      _count: { target: true },
      orderBy: { _count: { target: 'desc' } },
      take: 5,
    }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    // Daily visits last 30 days
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT DATE("createdAt") as day, COUNT(*) as count
      FROM "PageVisit"
      WHERE "createdAt" >= ${days30ago}
      GROUP BY DATE("createdAt")
      ORDER BY day ASC
    `,
  ]);

  return NextResponse.json({
    visits: {
      total: totalVisits,
      last7Days: visitsLast7,
      last30Days: visitsLast30,
    },
    interactions: {
      total: totalInteractions,
      top: topInteractions.map(i => ({ name: i.target, count: Number(i._count.target) })),
    },
    pages: {
      top: topPages.map(p => ({ path: p.path, count: Number(p._count.path) })),
    },
    messages: {
      total: messages,
      unread: unreadMessages,
    },
    chart: visitsByDay.map(r => ({
      day: String(r.day),
      visits: Number(r.count),
    })),
  });
}
