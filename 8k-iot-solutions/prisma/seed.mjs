import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  // Hardware Projects
  {
    slug: "smart-agricultural-sensor-node",
    category: "hardware",
    title: "Smart Agricultural Sensor Node",
    shortDescription: "Solar-powered IoT sensor arrays for precision farming and soil monitoring.",
    fullDescription: "Designed and engineered a complete end-to-end sensor node for agricultural monitoring. The device runs on low-power LoRaWAN networks and solar power, allowing it to operate autonomously for years. It collects soil moisture, ambient temperature, humidity, and light levels, sending data back to a centralized dashboard for farm management optimization.",
    coverImage: "https://images.unsplash.com/photo-1592982537447-6f23349e58bd?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["IoT", "LoRaWAN", "Sensors", "Solar"]),
    features: JSON.stringify(["Ultra-low power consumption", "Real-time telemetry", "Ruggedized weatherproof casing", "Cloud dashboard integration"])
  },
  {
    slug: "industrial-fleet-tracker",
    category: "hardware",
    title: "Industrial Fleet Tracker",
    shortDescription: "Ruggedized GPS and telemetry tracker for heavy machinery.",
    fullDescription: "A durable hardware module built for mining and construction equipment. It interfaces directly with the vehicle's CAN bus to monitor engine health, location, and operational efficiency, preventing costly machine downtime.",
    coverImage: "https://images.unsplash.com/photo-1587293852726-00624066f22c?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["GPS", "CAN bus", "Telemetry", "Industrial"]),
    features: JSON.stringify(["Ruggedized IP67 enclosure", "High-accuracy GNSS", "Real-time alerts", "Extended battery backup"])
  },
  {
    slug: "smart-home-hub",
    category: "hardware",
    title: "Smart Home Control Hub",
    shortDescription: "Centralized controller bridging Zigbee, Z-Wave, and Wi-Fi devices.",
    fullDescription: "Custom PCB design and firmware development for a universal smart home hub. This device acts as the brain for residential automation, allowing disparate wireless protocols to communicate seamlessly with a single local network.",
    coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Zigbee", "IoT", "PCB Design", "Smart Home"]),
    features: JSON.stringify(["Multi-protocol support", "Local processing (no cloud required)", "Custom Linux distribution required", "Sleek physical design"])
  },
  {
    slug: "wearable-health-monitor",
    category: "hardware",
    title: "Wearable Health Monitor",
    shortDescription: "Low-Profile biometric wearable for continuous clinical patient monitoring.",
    fullDescription: "Engineered a miniaturized wearable device containing PPG optical sensors and an accelerometer to track patient vitals continuously. Data is synced via Bluetooth Low Energy (BLE) to a clinical iPad app.",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Wearable", "BLE", "HealthTech", "Biometrics"]),
    features: JSON.stringify(["Continuous heart rate tracking", "Medical-grade accuracy", "7-day battery life", "Encrypted data transmission"])
  },
  {
    slug: "automated-warehouse-robot",
    category: "hardware",
    title: "Automated Warehouse Robot",
    shortDescription: "Autonomous micro-AGV for inventory sorting and transport.",
    fullDescription: "Prototyped the motor controller boards and sensor arrays for a small-scale automated guided vehicle. It utilizes LiDAR and optical flow sensors to navigate complex warehouse floors without human intervention.",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Robotics", "AGV", "LiDAR", "Motor Control"]),
    features: JSON.stringify(["Obstacle avoidance", "Dynamic pathfinding", "Auto-docking charging", "Swarm communication"])
  },
  {
    slug: "environmental-air-quality-monitor",
    category: "hardware",
    title: "Urban Air Quality Monitor",
    shortDescription: "Street-level sensors detecting PM2.5, NO2, and CO levels in real-time.",
    fullDescription: "A rugged hardware node deployed across city centers to combat pollution. It samples air quality every 5 minutes and pushes data over cellular networks to a public API.",
    coverImage: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Sensors", "Environment", "LTE-M", "Smart City"]),
    features: JSON.stringify(["Multi-gas detection array", "Cellular connectivity", "Vandal-proof housing", "Self-calibrating algorithms"])
  },
  {
    slug: "retail-traffic-counter",
    category: "hardware",
    title: "Retail Foot Traffic Counter",
    shortDescription: "Privacy-first optical sensor for store analytics.",
    fullDescription: "Developed a ceiling-mounted optical sensor that uses Edge AI to count foot traffic directions in retail stores without recording or storing PII (Personally Identifiable Information).",
    coverImage: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Edge AI", "Retail", "Computer Vision", "Analytics"]),
    features: JSON.stringify(["99% count accuracy", "Directional tracking", "PoE (Power over Ethernet) powered", "Anonymous processing"])
  },
  {
    slug: "smart-grid-meter",
    category: "hardware",
    title: "Smart Grid Power Meter",
    shortDescription: "Next-gen utility node for intelligent energy grid management.",
    fullDescription: "A custom hardware solution for utility companies that provides micro-second level power telemetry, enabling rapid fault detection and dynamic load balancing.",
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Energy", "Smart Grid", "Telemetry", "Utilities"]),
    features: JSON.stringify(["Remote disconnect capabilities", "High-frequency sampling", "Secure crypto-element", "Mesh networking"])
  },
  {
    slug: "asset-tracking-beacon",
    category: "hardware",
    title: "Asset Tracking Beacon",
    shortDescription: "Ultra-compact BLE tag for indoor asset localization.",
    fullDescription: "Designed tiny, inexpensive Bluetooth beacons meant to be attached to medical equipment in hospitals. When combined with our gateway receivers, they provide room-level tracking of expensive carts and tools.",
    coverImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["BLE", "Bluetooth", "Asset Tracking", "Healthcare"]),
    features: JSON.stringify(["Coin-cell powered (2 years)", "Water-resistant", "Configurable broadcast rate", "Anti-tamper alert"])
  },
  {
    slug: "custom-drone-payload",
    category: "hardware",
    title: "Drone Multi-Spectral Payload",
    shortDescription: "Custom sensor integration module for commercial UAVs.",
    fullDescription: "A lightweight hardware interface that connects multi-spectral cameras and thermal sensors to standard DJI drone frames, allowing simultaneous data capture for agricultural and surveying companies.",
    coverImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["UAV", "Drone", "Sensors", "Surveying"]),
    features: JSON.stringify(["Universal mounting bracket", "Independent power system", "Time-synchronized data capture", "Carbon-fiber enclosure"])
  },

  // Software Projects
  {
    slug: "iot-fleet-dashboard",
    category: "software",
    title: "IoT Fleet Management Dashboard",
    shortDescription: "Real-time web application to track thousands of connected devices globally.",
    fullDescription: "A high-performance Next.js application built to visualize telemetry data from over 10,000 active hardware nodes. Features an interactive WebGL map, live metric streaming via WebSockets, and actionable alert management.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["React", "Next.js", "WebSockets", "Dashboard"]),
    features: JSON.stringify(["Real-time device tracking", "Historical data graphing", "Over-the-Air (OTA) update management", "Role-based access control"])
  },
  {
    slug: "healthcare-patient-portal",
    category: "software",
    title: "Patient Telemetry Portal",
    shortDescription: "Secure web application for doctors to monitor patient wearable data.",
    fullDescription: "Developed a HIPAA-compliant web portal that aggregates heart rate, SpO2, and activity data from patient wearables. It highlights anomalies using a custom alert algorithm, saving doctors time during morning rounds.",
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Healthcare", "Portal", "HIPAA", "Vue.js"]),
    features: JSON.stringify(["EHR integration", "Anomaly detection alerts", "Patient summary reports", "Encrypted data storage"])
  },
  {
    slug: "ecommerce-analytics-engine",
    category: "software",
    title: "E-Commerce Analytics Engine",
    shortDescription: "Backend data pipeline and dashboard for high-volume retail analytics.",
    fullDescription: "Engineered a scalable data pipeline using Node.js and PostgreSQL to process millions of daily transactions. The paired frontend allows retail managers to slice data dynamically to uncover purchasing trends.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2615&auto=format&fit=crop",
    tags: JSON.stringify(["Node.js", "PostgreSQL", "Analytics", "E-Commerce"]),
    features: JSON.stringify(["ETL pipeline", "Custom reporting engine", "Predictive demand modeling", "API for third-party tools"])
  },
  {
    slug: "smart-city-api-gateway",
    category: "software",
    title: "Smart City API Gateway",
    shortDescription: "Centralized routing service for municipal data streams.",
    fullDescription: "A robust API gateway built in Go that handles incoming traffic from traffic lights, environmental sensors, and parking meters. It standardizes the data format and securely distributes it to authorized city applications.",
    coverImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2744&auto=format&fit=crop",
    tags: JSON.stringify(["Go", "API", "Microservices", "Smart City"]),
    features: JSON.stringify(["High-throughput routing", "Rate limiting", "Authentication & JWT validation", "Automated API documentation"])
  },
  {
    slug: "mobile-field-technician-app",
    category: "software",
    title: "Field Technician Mobile App",
    shortDescription: "Offline-first React Native application for hardware deployment.",
    fullDescription: "Created a cross-platform mobile application used by field technicians to commission new hardware installations. It relies on a local-first database to function deep underground or in rural areas where cell service is non-existent.",
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["React Native", "Mobile", "Offline-First", "BLE"]),
    features: JSON.stringify(["Offline data sync", "Bluetooth device provisioning", "Barcode/QR scanning", "Automated QA checklists"])
  },
  {
    slug: "ai-vision-processing-pipeline",
    category: "software",
    title: "AI Vision Processing Pipeline",
    shortDescription: "Cloud infrastructure for processing factory floor camera feeds.",
    fullDescription: "A scalable Python microservice architecture that ingests RTSP video streams from factory assembly lines, runs inference using custom PyTorch models to detect defects, and logs results in a time-series database.",
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Python", "AI", "Computer Vision", "AWS"]),
    features: JSON.stringify(["Stream processing", "Model versioning", "Alert generation sub-100ms", "Auto-scaling infrastructure"])
  },
  {
    slug: "manufacturing-erp",
    category: "software",
    title: "Custom Manufacturing ERP",
    shortDescription: "Bespoke resource planning software for electronic component assembly.",
    fullDescription: "Developed a tailored ERP system for a mid-sized PCB assembly plant. It tracks raw material inventory, manages BOMs (Bills of Materials), and schedules machine time, drastically reducing idle periods.",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["ERP", "Full-Stack", "TypeScript", "Manufacturing"]),
    features: JSON.stringify(["Inventory tracking", "BOM management", "Supplier integration via EDI", "Production scheduling calendar"])
  },
  {
    slug: "logistics-routing-engine",
    category: "software",
    title: "Logistics Routing Engine",
    shortDescription: "Optimization algorithm and interface for delivery fleet dispatching.",
    fullDescription: "A proprietary software suite that takes daily delivery manifests and computes the most fuel-efficient routes for a fleet of 50+ trucks, adjusting in real-time for traffic constraints.",
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["Algorithms", "Logistics", "Mapping", "SaaS"]),
    features: JSON.stringify(["Multi-stop optimization", "Real-time traffic ingestion", "Driver companion app", "Customer ETA tracking"])
  },
  {
    slug: "energy-trading-platform",
    category: "software",
    title: "Energy Trading Platform",
    shortDescription: "Web application for managing solar micro-grid power distribution.",
    fullDescription: "A blockchain-adjacent ledger system where neighborhoods with solar installations can automatically sell excess power back to the micro-grid or directly to neighbors. Features a sleek, trust-inducing UI.",
    coverImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2574&auto=format&fit=crop",
    tags: JSON.stringify(["FinTech", "Energy", "Web App", "Security"]),
    features: JSON.stringify(["Smart contract auditing", "Live pricing engine", "Automated billing", "Granular usage analytics"])
  },
  {
    slug: "customer-support-crm",
    category: "software",
    title: "Customer Support CRM",
    shortDescription: "Streamlined ticketing system built exclusively for B2B hardware vendors.",
    fullDescription: "A CRM platform optimized for support teams managing physical device returns and RMAs. It integrates directly with warehouse shipping APIs to generate return labels instantly when a hardware fault is diagnosed.",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
    tags: JSON.stringify(["CRM", "React", "Node.js", "B2B"]),
    features: JSON.stringify(["RMA workflow automation", "Knowledge base integration", "Shipping API hooks", "Hardware warranty tracking"])
  }
];

async function main() {
  console.log('Seeding data...');
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
