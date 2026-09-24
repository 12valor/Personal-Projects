import { notFound } from "next/navigation";
import { getSupabaseServerClient, type PortfolioProjectRow } from "../../../../lib/supabase";
import { serializeProject } from "../../../../lib/project-mappers";
import ProjectModal from "../../../../components/ProjectModal";

export default async function InterceptedWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);

  if (Number.isNaN(projectId)) {
    notFound();
  }

  const supabase = getSupabaseServerClient();
  const { data: projectRecord, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle<PortfolioProjectRow>();

  if (error || !projectRecord) {
    notFound();
  }

  const project = serializeProject(projectRecord);

  return <ProjectModal project={project} />;
}
