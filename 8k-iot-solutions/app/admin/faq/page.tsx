import { prisma } from '@/lib/prisma';
import FAQClient from './FAQClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "FAQ Management",
};

export default async function FAQAdminPage() {
  const faqs = await (prisma as any).faqItem.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-zinc-900 font-poppins tracking-tight">FAQ Management</h1>
        <p className="mt-2 text-zinc-600 font-poppins text-[15px]">
          Manage the questions and answers displayed on your landing page.
        </p>
      </div>

      <FAQClient initialFaqs={faqs} />
    </div>
  );
}
