import { getProjectBySlug } from '@/lib/projects';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const backLink = project.category === 'hardware' ? '/projects/hardware' : '/projects/software';
  const themeColor = project.category === 'hardware' ? 'zinc' : 'indigo';

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Spacer to account for fixed navbar offset if needed, or overlay hero directly */}
      <div className="h-[75px] md:h-[90px]" />

      <main className="pb-20">
        {/* Hero Section */}
        <div className="w-full h-[40vh] md:h-[60vh] relative bg-zinc-900 overflow-hidden">
          <Image 
            src={project.image} 
            alt={project.title}
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          
          {/* Hero Content positioned at the bottom of the hero banner */}
          <div className="absolute bottom-0 w-full">
            <div className="max-w-4xl mx-auto px-6 pb-8 md:pb-12 text-white">
              <Link href={backLink} className="inline-flex items-center text-sm font-medium text-zinc-300 hover:text-white transition-colors mb-6 drop-shadow-md">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to {project.category === 'hardware' ? 'Hardware' : 'Software'} Projects
              </Link>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-semibold tracking-wide text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold tracking-tight mb-4 drop-shadow-lg">
                {project.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Main Content (Left Column) */}
            <div className="md:col-span-2 space-y-10">
              <section>
                <h2 className="text-2xl font-poppins font-semibold text-zinc-900 mb-4">Project Overview</h2>
                <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                  {project.fullDescription}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-poppins font-semibold text-zinc-900 mb-4">Key Features</h2>
                <ul className="space-y-4">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4">
                      {/* Check Icon with dynamic theme color */}
                      <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${themeColor === 'indigo' ? 'bg-indigo-100 text-indigo-600' : 'bg-zinc-100 text-zinc-600'}`}>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-zinc-700 text-lg leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar (Right Column) */}
            <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-zinc-200 pt-8 md:pt-0 md:pl-8">
              <div className="sticky top-[140px]">
                <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <span className="block text-sm font-medium text-zinc-500 mb-1">Category</span>
                    <span className="block text-base font-semibold text-zinc-900 capitalize">{project.category}</span>
                  </div>
                  
                  {project.client && (
                    <div>
                      <span className="block text-sm font-medium text-zinc-500 mb-1">Client</span>
                      <span className="block text-base font-semibold text-zinc-900">{project.client}</span>
                    </div>
                  )}

                  <div>
                    <span className="block text-sm font-medium text-zinc-500 mb-2">Technologies</span>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-semibold text-zinc-700 bg-zinc-100 rounded-md border border-zinc-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
