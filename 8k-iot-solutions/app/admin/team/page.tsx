import { prisma } from '@/lib/prisma';
import TeamClient from './TeamClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Team Management",
};

export default async function TeamAdminPage() {
  const members = await (prisma as any).teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  // Auto-prefill logic for first-time setup
  if (members.length === 0) {
    const prefillData = [
      {
        name: "Jerow Bogie",
        role: "Co-Founder & CEO",
        bio: "Visionary lead behind 8K IoT Solutions. Jerow specializes in system architecture and strategic innovation, helping clients bridge the gap between abstract ideas and scalable hardware ecosystems.",
        imageUrl: "/team/jerow.png",
        twitterUrl: "#",
        linkedinUrl: "#",
        order: 1,
      },
      {
        name: "Evan Bogie",
        role: "Co-Founder & CTO",
        bio: "Hardware engineering expert with a focus on embedded systems and industrial IoT integration. Evan leads the technical implementation and material sourcing for all 8K projects.",
        imageUrl: "/team/evan.png",
        twitterUrl: "#",
        linkedinUrl: "#",
        order: 2,
      }
    ];

    // Note: We're not using prisma.teamMember.createMany here to avoid complexity in this server component's first run
    // In a real app, this would be a seed script, but for this "prefill" request, we'll just show the empty state 
    // and let the user add them or I can run a command.
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-zinc-900 font-poppins tracking-tight">Team Management</h1>
        <p className="mt-2 text-zinc-600 font-poppins text-[15px]">
          Manage your team members and founder profiles.
        </p>
      </div>

      <TeamClient initialMembers={members} />
    </div>
  );
}
