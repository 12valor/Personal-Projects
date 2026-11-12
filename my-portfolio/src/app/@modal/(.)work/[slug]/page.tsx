import { notFound } from "next/navigation";
import { getProjectDetailBySlugOrId } from "../../../../lib/supabase";
import ProjectModal from "../../../../components/ProjectModal";

export default async function InterceptedWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project } = await getProjectDetailBySlugOrId(slug);

  if (!project) {
    notFound();
  }

  return <ProjectModal project={project} />;
}
