import { NextResponse } from 'next/server';
import * as portfolioPackage from '../../../../package.json';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    await db.admin().command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      version: portfolioPackage.version,
      mongo: 'pong',
      at: new Date().toISOString(),
    });
  } catch(error) {
    console.error('Health check / mongo ping failed:', error);
    return NextResponse.json(
      {
        ok: false,
        version: portfolioPackage.version,
        mongo: 'error',
        at: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}