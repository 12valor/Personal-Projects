export type ProjectCategory = 'hardware' | 'software';

export interface Project {
  id: string;
  slug: string;
  category: ProjectCategory;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  features: string[];
  client?: string;
}

export const projects: Project[] = [
  // Hardware Projects
  {
    id: "h1",
    slug: "smart-agricultural-sensor-node",
    category: "hardware",
    title: "Smart Agricultural Sensor Node",
    description: "Solar-powered IoT sensor arrays for precision farming and soil monitoring.",
    fullDescription: "Designed and engineered a complete end-to-end sensor node for agricultural monitoring. The device runs on low-power LoRaWAN networks and solar power, allowing it to operate autonomously for years. It collects soil moisture, ambient temperature, humidity, and light levels, sending data back to a centralized dashboard for farm management optimization.",
    image: "https://images.unsplash.com/photo-1592982537447-6f23349e58bd?q=80&w=2670&auto=format&fit=crop",
    tags: ["IoT", "LoRaWAN", "Sensors", "Solar"],
    features: ["Ultra-low power consumption", "Real-time telemetry", "Ruggedized weatherproof casing", "Cloud dashboard integration"]
  },
  {
    id: "h2",
    slug: "industrial-fleet-tracker",
    category: "hardware",
    title: "Industrial Fleet Tracker",
    description: "Ruggedized GPS and telemetry tracker for heavy machinery.",
    fullDescription: "A durable hardware module built for mining and construction equipment. It interfaces directly with the vehicle's CAN bus to monitor engine health, location, and operational efficiency, preventing costly machine downtime.",
    image: "https://images.unsplash.com/photo-1587293852726-00624066f22c?q=80&w=2670&auto=format&fit=crop",
    tags: ["GPS", "CAN bus", "Telemetry", "Industrial"],
    features: ["Ruggedized IP67 enclosure", "High-accuracy GNSS", "Real-time alerts", "Extended battery backup"]
  },
  {
    id: "h3",
    slug: "smart-home-hub",
    category: "hardware",
    title: "Smart Home Control Hub",
    description: "Centralized controller bridging Zigbee, Z-Wave, and Wi-Fi devices.",
    fullDescription: "Custom PCB design and firmware development for a universal smart home hub. This device acts as the brain for residential automation, allowing disparate wireless protocols to communicate seamlessly with a single local network.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2670&auto=format&fit=crop",
    tags: ["Zigbee", "IoT", "PCB Design", "Smart Home"],
    features: ["Multi-protocol support", "Local processing (no cloud required)", "Custom Linux distribution required", "Sleek physical design"]
  },
  {
    id: "h4",
    slug: "wearable-health-monitor",
    category: "hardware",
    title: "Wearable Health Monitor",
    description: "Low-Profile biometric wearable for continuous clinical patient monitoring.",
    fullDescription: "Engineered a miniaturized wearable device containing PPG optical sensors and an accelerometer to track patient vitals continuously. Data is synced via Bluetooth Low Energy (BLE) to a clinical iPad app.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop",
    tags: ["Wearable", "BLE", "HealthTech", "Biometrics"],
    features: ["Continuous heart rate tracking", "Medical-grade accuracy", "7-day battery life", "Encrypted data transmission"]
  },
  {
    id: "h5",
    slug: "automated-warehouse-robot",
    category: "hardware",
    title: "Automated Warehouse Robot",
    description: "Autonomous micro-AGV for inventory sorting and transport.",
    fullDescription: "Prototyped the motor controller boards and sensor arrays for a small-scale automated guided vehicle. It utilizes LiDAR and optical flow sensors to navigate complex warehouse floors without human intervention.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    tags: ["Robotics", "AGV", "LiDAR", "Motor Control"],
    features: ["Obstacle avoidance", "Dynamic pathfinding", "Auto-docking charging", "Swarm communication"]
  },
  {
    id: "h6",
    slug: "environmental-air-quality-monitor",
    category: "hardware",
    title: "Urban Air Quality Monitor",
    description: "Street-level sensors detecting PM2.5, NO2, and CO levels in real-time.",
    fullDescription: "A rugged hardware node deployed across city centers to combat pollution. It samples air quality every 5 minutes and pushes data over cellular networks to a public API.",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=2670&auto=format&fit=crop",
    tags: ["Sensors", "Environment", "LTE-M", "Smart City"],
    features: ["Multi-gas detection array", "Cellular connectivity", "Vandal-proof housing", "Self-calibrating algorithms"]
  },
  {
    id: "h7",
    slug: "retail-traffic-counter",
    category: "hardware",
    title: "Retail Foot Traffic Counter",
    description: "Privacy-first optical sensor for store analytics.",
    fullDescription: "Developed a ceiling-mounted optical sensor that uses Edge AI to count foot traffic directions in retail stores without recording or storing PII (Personally Identifiable Information).",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2670&auto=format&fit=crop",
    tags: ["Edge AI", "Retail", "Computer Vision", "Analytics"],
    features: ["99% count accuracy", "Directional tracking", "PoE (Power over Ethernet) powered", "Anonymous processing"]
  },
  {
    id: "h8",
    slug: "smart-grid-meter",
    category: "hardware",
    title: "Smart Grid Power Meter",
    description: "Next-gen utility node for intelligent energy grid management.",
    fullDescription: "A custom hardware solution for utility companies that provides micro-second level power telemetry, enabling rapid fault detection and dynamic load balancing.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2670&auto=format&fit=crop",
    tags: ["Energy", "Smart Grid", "Telemetry", "Utilities"],
    features: ["Remote disconnect capabilities", "High-frequency sampling", "Secure crypto-element", "Mesh networking"]
  },
  {
    id: "h9",
    slug: "asset-tracking-beacon",
    category: "hardware",
    title: "Asset Tracking Beacon",
    description: "Ultra-compact BLE tag for indoor asset localization.",
    fullDescription: "Designed tiny, inexpensive Bluetooth beacons meant to be attached to medical equipment in hospitals. When combined with our gateway receivers, they provide room-level tracking of expensive carts and tools.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2670&auto=format&fit=crop",
    tags: ["BLE", "Bluetooth", "Asset Tracking", "Healthcare"],
    features: ["Coin-cell powered (2 years)", "Water-resistant", "Configurable broadcast rate", "Anti-tamper alert"]
  },
  {
    id: "h10",
    slug: "custom-drone-payload",
    category: "hardware",
    title: "Drone Multi-Spectral Payload",
    description: "Custom sensor integration module for commercial UAVs.",
    fullDescription: "A lightweight hardware interface that connects multi-spectral cameras and thermal sensors to standard DJI drone frames, allowing simultaneous data capture for agricultural and surveying companies.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2670&auto=format&fit=crop",
    tags: ["UAV", "Drone", "Sensors", "Surveying"],
    features: ["Universal mounting bracket", "Independent power system", "Time-synchronized data capture", "Carbon-fiber enclosure"]
  },

  // Software Projects
  {
    id: "s1",
    slug: "iot-fleet-dashboard",
    category: "software",
    title: "IoT Fleet Management Dashboard",
    description: "Real-time web application to track thousands of connected devices globally.",
    fullDescription: "A high-performance Next.js application built to visualize telemetry data from over 10,000 active hardware nodes. Features an interactive WebGL map, live metric streaming via WebSockets, and actionable alert management.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    tags: ["React", "Next.js", "WebSockets", "Dashboard"],
    features: ["Real-time device tracking", "Historical data graphing", "Over-the-Air (OTA) update management", "Role-based access control"]
  },
  {
    id: "s2",
    slug: "healthcare-patient-portal",
    category: "software",
    title: "Patient Telemetry Portal",
    description: "Secure web application for doctors to monitor patient wearable data.",
    fullDescription: "Developed a HIPAA-compliant web portal that aggregates heart rate, SpO2, and activity data from patient wearables. It highlights anomalies using a custom alert algorithm, saving doctors time during morning rounds.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2670&auto=format&fit=crop",
    tags: ["Healthcare", "Portal", "HIPAA", "Vue.js"],
    features: ["EHR integration", "Anomaly detection alerts", "Patient summary reports", "Encrypted data storage"]
  },
  {
    id: "s3",
    slug: "ecommerce-analytics-engine",
    category: "software",
    title: "E-Commerce Analytics Engine",
    description: "Backend data pipeline and dashboard for high-volume retail analytics.",
    fullDescription: "Engineered a scalable data pipeline using Node.js and PostgreSQL to process millions of daily transactions. The paired frontend allows retail managers to slice data dynamically to uncover purchasing trends.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2615&auto=format&fit=crop",
    tags: ["Node.js", "PostgreSQL", "Analytics", "E-Commerce"],
    features: ["ETL pipeline", "Custom reporting engine", "Predictive demand modeling", "API for third-party tools"]
  },
  {
    id: "s4",
    slug: "smart-city-api-gateway",
    category: "software",
    title: "Smart City API Gateway",
    description: "Centralized routing service for municipal data streams.",
    fullDescription: "A robust API gateway built in Go that handles incoming traffic from traffic lights, environmental sensors, and parking meters. It standardizes the data format and securely distributes it to authorized city applications.",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2744&auto=format&fit=crop",
    tags: ["Go", "API", "Microservices", "Smart City"],
    features: ["High-throughput routing", "Rate limiting", "Authentication & JWT validation", "Automated API documentation"]
  },
  {
    id: "s5",
    slug: "mobile-field-technician-app",
    category: "software",
    title: "Field Technician Mobile App",
    description: "Offline-first React Native application for hardware deployment.",
    fullDescription: "Created a cross-platform mobile application used by field technicians to commission new hardware installations. It relies on a local-first database to function deep underground or in rural areas where cell service is non-existent.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
    tags: ["React Native", "Mobile", "Offline-First", "BLE"],
    features: ["Offline data sync", "Bluetooth device provisioning", "Barcode/QR scanning", "Automated QA checklists"]
  },
  {
    id: "s6",
    slug: "ai-vision-processing-pipeline",
    category: "software",
    title: "AI Vision Processing Pipeline",
    description: "Cloud infrastructure for processing factory floor camera feeds.",
    fullDescription: "A scalable Python microservice architecture that ingests RTSP video streams from factory assembly lines, runs inference using custom PyTorch models to detect defects, and logs results in a time-series database.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2670&auto=format&fit=crop",
    tags: ["Python", "AI", "Computer Vision", "AWS"],
    features: ["Stream processing", "Model versioning", "Alert generation sub-100ms", "Auto-scaling infrastructure"]
  },
  {
    id: "s7",
    slug: "manufacturing-erp",
    category: "software",
    title: "Custom Manufacturing ERP",
    description: "Bespoke resource planning software for electronic component assembly.",
    fullDescription: "Developed a tailored ERP system for a mid-sized PCB assembly plant. It tracks raw material inventory, manages BOMs (Bills of Materials), and schedules machine time, drastically reducing idle periods.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    tags: ["ERP", "Full-Stack", "TypeScript", "Manufacturing"],
    features: ["Inventory tracking", "BOM management", "Supplier integration via EDI", "Production scheduling calendar"]
  },
  {
    id: "s8",
    slug: "logistics-routing-engine",
    category: "software",
    title: "Logistics Routing Engine",
    description: "Optimization algorithm and interface for delivery fleet dispatching.",
    fullDescription: "A proprietary software suite that takes daily delivery manifests and computes the most fuel-efficient routes for a fleet of 50+ trucks, adjusting in real-time for traffic constraints.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
    tags: ["Algorithms", "Logistics", "Mapping", "SaaS"],
    features: ["Multi-stop optimization", "Real-time traffic ingestion", "Driver companion app", "Customer ETA tracking"]
  },
  {
    id: "s9",
    slug: "energy-trading-platform",
    category: "software",
    title: "Energy Trading Platform",
    description: "Web application for managing solar micro-grid power distribution.",
    fullDescription: "A blockchain-adjacent ledger system where neighborhoods with solar installations can automatically sell excess power back to the micro-grid or directly to neighbors. Features a sleek, trust-inducing UI.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2574&auto=format&fit=crop",
    tags: ["FinTech", "Energy", "Web App", "Security"],
    features: ["Smart contract auditing", "Live pricing engine", "Automated billing", "Granular usage analytics"]
  },
  {
    id: "s10",
    slug: "customer-support-crm",
    category: "software",
    title: "Customer Support CRM",
    description: "Streamlined ticketing system built exclusively for B2B hardware vendors.",
    fullDescription: "A CRM platform optimized for support teams managing physical device returns and RMAs. It integrates directly with warehouse shipping APIs to generate return labels instantly when a hardware fault is diagnosed.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
    tags: ["CRM", "React", "Node.js", "B2B"],
    features: ["RMA workflow automation", "Knowledge base integration", "Shipping API hooks", "Hardware warranty tracking"]
  }
];

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter(p => p.category === category);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}
