import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "8K Smart Home Hub",
      slug: "smart-home-hub",
      description: "A centralized software engine to orchestrate your entire home IoT ecosystem. Features real-time device status, automated routines, and elegant dashboard control.",
      price: "₱1,499/yr",
      imageUrl: "/products/smart-home-hub.png",
      features: JSON.stringify(["Real-time Sync", "Multi-device Support", "Automation Engine"]),
      order: 1,
      isActive: true,
    },
    {
      name: "Industrial Analytics Pro",
      slug: "industrial-analytics",
      description: "Mission-critical monitoring for factory floors and industrial sites. Includes heatmaps, predictive failure alerts, and deep data logging for operational efficiency.",
      price: "₱5,999/yr",
      imageUrl: "/products/industrial-analytics.png",
      features: JSON.stringify(["Failure Prediction", "Custom Heatmaps", "Edge Computing"]),
      order: 2,
      isActive: true,
    },
    {
      name: "IoT Security Shield",
      slug: "iot-security-shield",
      description: "Advanced network security layer designed specifically for IoT vulnerabilities. Detects anomalies, prevents unauthorized access, and secures your data stream.",
      price: "₱2,999/yr",
      imageUrl: "/products/security-shield.png",
      features: JSON.stringify(["Anomaly Detection", "End-to-end Encryption", "Threat Intel"]),
      order: 3,
      isActive: true,
    },
    {
      name: "Fleet Track Cloud",
      slug: "fleet-track-cloud",
      description: "The ultimate logistics companion. Monitor your entire vehicle fleet in real-time with GPS tracking, fuel consumption analytics, and driver behavior reports.",
      price: "Contact for Price",
      imageUrl: "/products/fleet-track.png",
      features: JSON.stringify(["Real-time GPS", "Fuel Monitoring", "Geofencing"]),
      order: 4,
      isActive: true,
    }
  ];

  console.log("Seeding products...");

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
