import { supabase } from "@/src/lib/supabase";
import { notFound } from "next/navigation";
import InterceptModal from "@/src/components/InterceptModal";
import ProjectDetailContent from "@/src/components/ProjectDetailContent";

export default async function ProjectInterceptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <InterceptModal>
      <ProjectDetailContent project={project} />
    </InterceptModal>
  );
}
