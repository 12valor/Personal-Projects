import { prisma } from './prisma';

export type ProjectCategory = 'hardware' | 'software';

export interface Project {
  id: string;
  slug: string;
  category: ProjectCategory;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  features: string[];
  client?: string;
}

function mapPrismaToProject(p: any): Project {
  return {
    id: p.id,
    slug: p.slug,
    category: p.category as ProjectCategory,
    title: p.title,
    description: p.shortDescription,
    fullDescription: p.fullDescription,
    image: p.coverImage,
    tags: JSON.parse(p.tags || '[]'),
    features: JSON.parse(p.features || '[]'),
    client: p.client || undefined,
  };
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  const data = await prisma.project.findMany({
    where: { category },
    orderBy: { createdAt: 'asc' }
  });
  return data.map(mapPrismaToProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const data = await prisma.project.findUnique({
    where: { slug }
  });
  if (!data) return undefined;
  return mapPrismaToProject(data);
}
