import TestimonialForm from '../../components/TestimonialForm';

export default function NewTestimonial() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Add New Testimonial</h1>
      <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
        <TestimonialForm />
      </div>
    </div>
  );
}
