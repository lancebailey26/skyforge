import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { Project } from '../../../types/project';
import { WithId, Document } from 'mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection('projects')
      .find({ status: { $ne: 'archived' }})
      .sort({ featured: -1, priority: 1 })
      .toArray();

    const projects: Project[] = docs.map((doc: WithId<Document>) => ({
      _id: doc._id ? doc._id.toString() : undefined,
      slug: (doc.slug as string) ?? '',
      title: (doc.title as string) ?? '',
      description: (doc.description as string) ?? '',
      techStack: Array.isArray(doc.techStack) ? (doc.techStack as string[]) : [],
      tags: Array.isArray(doc.tags) ? (doc.tags as string[]) : [],
      featured: (doc.featured as boolean) ?? false,
      priority: (doc.priority as number) ?? 0,
      status: (doc.status as Project['status']) ?? 'live',
      url: doc.url as string | undefined,
      repoUrl: doc.repoUrl as string | undefined,
      imageUrl: doc.imageUrl as string | undefined,
      createdAt: doc.createdAt as string | undefined,
      updatedAt: doc.updatedAt as string | undefined
    }));

    return NextResponse.json({ projects });
  } catch(error) {
    console.error('Error loading projects', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}