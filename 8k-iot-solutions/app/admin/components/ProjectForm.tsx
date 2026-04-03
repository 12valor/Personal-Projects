'use client';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProject } from '../actions';
// Using a basic form to avoid complex state management since Server Actions handle it well
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectForm({ project }: { project?: any }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(saveProject, { error: null });
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [manualSlug, setManualSlug] = useState(!!project?.slug);

  // Auto-generate slug from title for new projects
  useEffect(() => {
    if (!project && !manualSlug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, manualSlug, project]);

  // Handle successful submission
  useEffect(() => {
    if (state?.success) {
      router.push('/admin');
      router.refresh();
    }
  }, [state, router]);

  // Parse existing JSON
  let tags = '';
  let features = '';
  if (project?.tags) {
    tags = JSON.parse(project.tags).join(', ');
  }
  if (project?.features) {
    features = JSON.parse(project.features).join('\n');
  }

  return (
    <form action={action} className="space-y-8 divide-y divide-zinc-200">
      <div className="space-y-8 divide-y divide-zinc-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-zinc-900">
              {project ? 'Edit Project' : 'New Project'}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              This information will be displayed publicly.
            </p>
          </div>

          {state?.error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            {project && <input type="hidden" name="id" value={project.id} />}
            {project && <input type="hidden" name="existingCoverImage" value={project.coverImage} />}

            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
                Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="slug" className="block text-sm font-medium text-zinc-700">
                Slug (URL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setManualSlug(true);
                  }}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-zinc-700">
                Category
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue={project?.category || 'hardware'}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                >
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="client" className="block text-sm font-medium text-zinc-700">
                Client (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="client"
                  id="client"
                  defaultValue={project?.client}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="shortDescription" className="block text-sm font-medium text-zinc-700">
                Short Description (Card format)
              </label>
              <div className="mt-1">
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  rows={2}
                  required
                  defaultValue={project?.shortDescription}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="fullDescription" className="block text-sm font-medium text-zinc-700">
                Full Description (Project page)
              </label>
              <div className="mt-1">
                <textarea
                  id="fullDescription"
                  name="fullDescription"
                  rows={4}
                  required
                  defaultValue={project?.fullDescription}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="tags" className="block text-sm font-medium text-zinc-700">
                Tags (Comma-separated)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  placeholder="e.g. IoT, LoRaWAN, React"
                  defaultValue={tags}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="features" className="block text-sm font-medium text-zinc-700">
                Features (One per line)
              </label>
              <div className="mt-1">
                <textarea
                  id="features"
                  name="features"
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2"
                  defaultValue={features}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-zinc-700">Cover Image</label>
              <div className="mt-1 flex items-center">
                {project?.coverImage && (
                  <span className="h-16 w-16 overflow-hidden bg-zinc-100 rounded-md border mr-4 shrink-0 relative">
                    <img src={project.coverImage} className="w-full h-full object-cover" alt="Preview" />
                  </span>
                )}
                <input
                  type="file"
                  name="coverImage"
                  id="coverImage"
                  accept="image/*"
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-1.5"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <a
            href="/admin"
            className="bg-white py-2 px-4 border border-zinc-300 rounded-md shadow-sm text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={isPending}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}
