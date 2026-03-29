'use client';

import { useState } from 'react';
import { saveTestimonial, deleteTestimonial } from '../actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TestimonialForm({ testimonial }: { testimonial?: any }) {
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const handleRemoveImage = () => {
    setIsImageRemoved(true);
  };
  return (
    <form action={saveTestimonial} className="space-y-8 divide-y divide-zinc-200">
      <div className="space-y-8 divide-y divide-zinc-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-zinc-900">
              {testimonial ? 'Edit Testimonial' : 'New Testimonial'}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              This information will be displayed in the testimonials section of the home page.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            {testimonial && <input type="hidden" name="id" value={testimonial.id || ''} />}
            {testimonial && <input type="hidden" name="existingAvatar" value={testimonial.avatar || ''} />}
            {testimonial && <input type="hidden" name="removeAvatar" value={String(isImageRemoved)} />}

            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  defaultValue={testimonial?.name || ''}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="position" className="block text-sm font-medium text-zinc-700">
                Position / Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="position"
                  id="position"
                  placeholder="e.g. CEO at Company"
                  defaultValue={testimonial?.position || ''}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="text" className="block text-sm font-medium text-zinc-700">
                Testimonial Message
              </label>
              <div className="mt-1">
                <textarea
                  id="text"
                  name="text"
                  rows={4}
                  required
                  defaultValue={testimonial?.text || ''}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="rating" className="block text-sm font-medium text-zinc-700">
                Rating (1-5)
              </label>
              <div className="mt-1">
                <select
                  id="rating"
                  name="rating"
                  required
                  defaultValue={testimonial?.rating || 5}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-zinc-700">Profile Image (Avatar)</label>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  {testimonial?.avatar && !isImageRemoved && (
                    <span className="h-16 w-16 overflow-hidden bg-zinc-100 rounded-full border shrink-0 relative">
                      <img src={testimonial.avatar} className="w-full h-full object-cover" alt="Preview" />
                    </span>
                  )}
                  <div className="flex-1 flex items-center gap-4">
                    {testimonial?.avatar && !isImageRemoved && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors border border-red-100"
                      >
                        Remove Photo
                      </button>
                    )}
                    <div className="flex-1">
                      <label className="block text-xs text-zinc-500 mb-1">Upload New File</label>
                      <input
                        type="file"
                        name="avatarFile"
                        id="avatarFile"
                        accept="image/*"
                        className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-1.5"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-zinc-500">OR</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-zinc-700">
                    Avatar Image URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="avatarUrl"
                      id="avatarUrl"
                      placeholder="https://example.com/avatar.jpg"
                      defaultValue={testimonial?.avatar?.startsWith('http') ? testimonial.avatar : ''}
                      className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end gap-3 w-full">
          {testimonial?.id && (
            <button
              type="button"
              onClick={async () => {
                if (confirm('Are you sure you want to delete this testimonial?')) {
                  await deleteTestimonial(testimonial.id);
                }
              }}
              className="bg-white py-2 px-4 border border-red-200 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-auto"
            >
              Delete Testimonial
            </button>
          )}
          <a
            href="/admin/testimonials"
            className="bg-white py-2 px-4 border border-zinc-300 rounded-md shadow-sm text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
          >
            Save Testimonial
          </button>
        </div>
      </div>
    </form>
  );
}
