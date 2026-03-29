import { prisma } from './lib/prisma';

async function main() {
  const jerow = await (prisma as any).teamMember.create({
    data: {
      name: "Jerow Bogie",
      role: "Co-Founder & CEO",
      bio: "Visionary lead behind 8K IoT Solutions. Jerow specializes in system architecture and strategic innovation, helping clients bridge the gap between abstract ideas and scalable hardware ecosystems.",
      imageUrl: "/team/jerow.png",
      twitterUrl: "#",
      linkedinUrl: "#",
      order: 1,
      isActive: true,
    },
  });

  const evan = await (prisma as any).teamMember.create({
    data: {
      name: "Evan Bogie",
      role: "Co-Founder & CTO",
      bio: "Hardware engineering expert with a focus on embedded systems and industrial IoT integration. Evan leads the technical implementation and material sourcing for all 8K projects.",
      imageUrl: "/team/evan.png",
      twitterUrl: "#",
      linkedinUrl: "#",
      order: 2,
      isActive: true,
    },
  });

  console.log("Team pre-filled:", { jerow, evan });
}

main().catch(console.error);
