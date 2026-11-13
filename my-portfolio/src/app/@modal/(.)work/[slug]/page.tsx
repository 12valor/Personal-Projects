import { notFound } from "next/navigation";
import { getProjectDetailBySlugOrId } from "../../../../lib/supabase";
import { resolveImageDimensions } from "../../../../lib/project-mappers";
import ProjectModal from "../../../../components/ProjectModal";

export default async function InterceptedWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project, previousProject, nextProject } =
    await getProjectDetailBySlugOrId(slug);

  if (!project) {
    notFound();
  }

  const mediaUrls = [
    project.image_url,
    ...(project.gallery_urls ?? []),
  ].filter(Boolean);
  const dimensions = await resolveImageDimensions(mediaUrls);

  return (
    <ProjectModal
      project={project}
      previousProject={previousProject}
      nextProject={nextProject}
      initialDimensions={dimensions}
    />
  );
}
