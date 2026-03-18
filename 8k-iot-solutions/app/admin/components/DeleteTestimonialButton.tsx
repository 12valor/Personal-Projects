'use client';

import { deleteTestimonial } from '../actions';

export default function DeleteTestimonialButton({ id }: { id: string }) {
  return (
    <button 
      type="button" 
      className="text-red-600 hover:text-red-900" 
      onClick={async () => { 
        if (confirm('Are you sure you want to delete this testimonial?')) {
          await deleteTestimonial(id);
        }
      }}
    >
      Delete
    </button>
  );
}
