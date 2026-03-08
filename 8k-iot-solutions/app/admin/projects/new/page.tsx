import ProjectForm from '../../components/ProjectForm';
import Link from 'next/link';

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-8 flex items-center">
        <Link href="/admin" className="text-sm font-medium text-zinc-500 hover:text-zinc-800 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <ProjectForm />
        </div>
      </div>
    </div>
  );
}
