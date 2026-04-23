// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuditEntry {
  label: string;
  date: string;
  actor: string;
}

export interface Milestone {
  name: string;
  duration: string;
  cost: string;
}

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  integrations?: string[];
  hosting?: string[];
}

export interface AIQualification {
  score: number;
  label: string;
  description: string;
  nextAction: string;
  handoffNote: string;
}

export interface ZohoSync {
  status: string;
  crmId: string;
  lastSynced: string;
}

export interface LeadDetail {
  id: string;
  fullProjectName: string;
  clientContact: string;
  source: string;
  dateReceived: string;
  status: string;
  budget: string;
  timeline: string;
  leadSummary: string;
  aiQualification: AIQualification;
  techStack: TechStack;
  milestones: Milestone[];
  suggestedQuestions: string[];
  auditLog: AuditEntry[];
  zoho?: ZohoSync;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const LEAD_DETAILS: Record<string, LeadDetail> = {
  "LD-1247": {
    id: "LD-1247",
    fullProjectName: "E-commerce Mobile App for Fashion Retail",
    clientContact: "Rahul Sharma",
    source: "Alliance",
    dateReceived: "Apr 19, 2026",
    status: "qualified",
    budget: "$45,000 – $55,000",
    timeline: "4–5 months",
    leadSummary:
      "Client is looking to build a comprehensive mobile application for their fashion retail business. The app needs to support both iOS and Android platforms with features including user authentication, product catalog with advanced search and filtering, shopping cart, payment integration, order tracking, and an admin dashboard for inventory management.",
    aiQualification: {
      score: 92,
      label: "Strong Lead - High Potential",
      description:
        "This is an excellent opportunity with clear requirements and realistic budget expectations. The client has a well-established business and understands the scope of work. The timeline aligns with our capacity, and the technical requirements match our core competencies. High probability of conversion.",
      nextAction:
        "Schedule a discovery call to discuss detailed requirements, timeline expectations, and introduce the team. Prepare a preliminary proposal with tech stack recommendations.",
      handoffNote:
        "After marking as 'Qualified', this lead will be handed off to the sales team in Zoho CRM for further pipeline management.",
    },
    techStack: {
      frontend: ["React Native", "Redux Toolkit", "React Navigation"],
      backend: ["Node.js", "Express.js", "MongoDB"],
      integrations: ["Stripe Payment Gateway", "AWS S3 for Media", "Firebase Push Notifications", "Twilio SMS"],
      hosting: ["AWS EC2", "MongoDB Atlas", "CloudFront CDN"],
    },
    milestones: [
      { name: "Discovery & Design", duration: "2-3 weeks", cost: "$8,000 - $10,000" },
      { name: "Core Development", duration: "8-10 weeks", cost: "$22,000 - $27,000" },
      { name: "Integration & Testing", duration: "3-4 weeks", cost: "$10,000 - $12,000" },
      { name: "Deployment & Handoff", duration: "1-2 weeks", cost: "$5,000 - $6,000" },
    ],
    suggestedQuestions: [
      "What is your target launch date for the app?",
      "Do you have existing branding guidelines and design assets we should follow?",
      "Will you need ongoing maintenance and support after launch?",
      "Do you have a preferred payment gateway, or are you open to recommendations?",
      "What is your expected user base in the first 6 months?",
      "Will you need analytics and user behavior tracking integrated?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 19, 2026 at 9:15 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 19, 2026 at 9:18 AM", actor: "AI Engine" },
      { label: "Lead qualified by AI", date: "Apr 19, 2026 at 9:18 AM", actor: "AI Engine" },
      { label: "Assigned to Rahul Sharma", date: "Apr 19, 2026 at 9:30 AM", actor: "Admin" },
      { label: "Synced to Zoho CRM", date: "Apr 19, 2026 at 10:24 AM", actor: "System" },
    ],
    zoho: {
      status: "Lead Created in Zoho",
      crmId: "Z0H-892451",
      lastSynced: "Apr 19, 2026 at 10:24 AM",
    },
  },

  "LD-1246": {
    id: "LD-1246",
    fullProjectName: "Healthcare Dashboard Platform",
    clientContact: "Priya Nair",
    source: "Direct",
    dateReceived: "Apr 19, 2026",
    status: "under-review",
    budget: "$62,000 – $75,000",
    timeline: "6–7 months",
    leadSummary:
      "Client requires a comprehensive dashboard for managing patient data, appointments, and billing workflows. The platform must be HIPAA-compliant with real-time analytics, role-based access control, and seamless integration with existing EHR systems.",
    aiQualification: {
      score: 68,
      label: "Moderate Lead - Needs Evaluation",
      description:
        "The project has solid requirements but HIPAA compliance needs and multi-system integration complexity require deeper evaluation. Budget appears tight for the scope described. Client is still comparing vendors.",
      nextAction:
        "Arrange a technical requirements workshop and prepare a HIPAA compliance assessment. Clarify integration points with their existing EHR system before advancing.",
      handoffNote:
        "Lead is currently under review. Additional qualification is needed before this can be handed off to the sales team.",
    },
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind CSS"],
      backend: ["Python", "FastAPI", "PostgreSQL"],
      integrations: ["HL7 FHIR API", "Twilio", "SendGrid"],
      hosting: ["AWS HIPAA-eligible", "Amazon RDS", "CloudFront"],
    },
    milestones: [
      { name: "Compliance & Discovery", duration: "2-3 weeks", cost: "$10,000 - $12,000" },
      { name: "Core Dashboard Development", duration: "10-12 weeks", cost: "$35,000 - $42,000" },
      { name: "Integration & Testing", duration: "4-5 weeks", cost: "$12,000 - $15,000" },
      { name: "Deployment & Training", duration: "2-3 weeks", cost: "$5,000 - $6,000" },
    ],
    suggestedQuestions: [
      "Which EHR system are you currently using?",
      "What level of HIPAA compliance certification is required?",
      "How many concurrent users do you expect on the platform?",
      "Do you need patient-facing features or is this internal-only?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 19, 2026 at 11:30 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 19, 2026 at 11:33 AM", actor: "AI Engine" },
      { label: "Flagged for manual review", date: "Apr 19, 2026 at 2:00 PM", actor: "Admin" },
    ],
  },

  "LD-1245": {
    id: "LD-1245",
    fullProjectName: "Real Estate Listing & Search Platform",
    clientContact: "James Mitchell",
    source: "Referral",
    dateReceived: "Apr 18, 2026",
    status: "qualified",
    budget: "$88,000 – $105,000",
    timeline: "8–10 months",
    leadSummary:
      "Client wants a full-featured real estate platform with advanced property search, map-based browsing, virtual tour integration, agent management, and a CMS for listings. The platform should support both buyers and sellers with separate dashboards and a mortgage calculator tool.",
    aiQualification: {
      score: 85,
      label: "Strong Lead - High Potential",
      description:
        "Well-defined requirements with realistic budget for the scope. The referral source increases trust. Client has prior digital product experience and understands development timelines. Clear revenue model makes conversion likely.",
      nextAction:
        "Schedule a discovery session to finalize the feature roadmap and confirm map API requirements. Begin drafting a phased delivery proposal.",
      handoffNote:
        "Lead qualifies for handoff to sales. Zoho sync active — sales team to follow up within 48 hours.",
    },
    techStack: {
      frontend: ["Next.js", "React", "Tailwind CSS"],
      backend: ["Node.js", "Express.js", "PostgreSQL"],
      integrations: ["Google Maps API", "Twilio", "Stripe", "Virtual Tour SDK"],
      hosting: ["AWS EC2", "RDS PostgreSQL", "S3 + CloudFront"],
    },
    milestones: [
      { name: "Discovery & Architecture", duration: "2-3 weeks", cost: "$12,000 - $15,000" },
      { name: "Core Platform Development", duration: "14-16 weeks", cost: "$52,000 - $60,000" },
      { name: "CMS & Agent Portal", duration: "4-5 weeks", cost: "$15,000 - $18,000" },
      { name: "QA & Launch", duration: "3-4 weeks", cost: "$9,000 - $12,000" },
    ],
    suggestedQuestions: [
      "Will the platform cover a specific region or multiple cities?",
      "Do you need MLS data integration?",
      "What is your expected listing volume at launch?",
      "Do agents manage their own listings or does an admin control them?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 18, 2026 at 10:05 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 18, 2026 at 10:08 AM", actor: "AI Engine" },
      { label: "Lead qualified by AI", date: "Apr 18, 2026 at 10:08 AM", actor: "AI Engine" },
      { label: "Assigned to James Mitchell", date: "Apr 18, 2026 at 11:00 AM", actor: "Admin" },
      { label: "Synced to Zoho CRM", date: "Apr 18, 2026 at 1:15 PM", actor: "System" },
      { label: "Proposal draft initiated", date: "Apr 18, 2026 at 3:40 PM", actor: "Pre-Sales" },
    ],
    zoho: {
      status: "Lead Created in Zoho",
      crmId: "Z0H-881239",
      lastSynced: "Apr 18, 2026 at 1:15 PM",
    },
  },

  "LD-1244": {
    id: "LD-1244",
    fullProjectName: "Inventory Management System for Manufacturing",
    clientContact: "Alex Thompson",
    source: "Upwork",
    dateReceived: "Apr 18, 2026",
    status: "proposal-sent",
    budget: "$34,000 – $42,000",
    timeline: "3–4 months",
    leadSummary:
      "Manufacturing client needs a web-based inventory management system to track raw materials, finished goods, and supplier orders. Key features include barcode scanning, automated reorder alerts, multi-warehouse support, and detailed reporting.",
    aiQualification: {
      score: 78,
      label: "Good Lead - Proposal Sent",
      description:
        "Clear and focused scope with a realistic budget. The Upwork source indicates the client has already been evaluating options. Proposal has been sent and client is in the decision phase.",
      nextAction:
        "Follow up on the sent proposal. Offer a live demo of similar work. Address any pricing or timeline concerns proactively.",
      handoffNote:
        "Proposal is with the client. Sales team should follow up within 3 business days if no response.",
    },
    techStack: {
      frontend: ["React", "TypeScript", "Ant Design"],
      backend: ["Node.js", "Express.js", "PostgreSQL", "Redis"],
      integrations: ["Barcode Scanner SDK", "Twilio Alerts", "Excel Export"],
      hosting: ["AWS EC2", "RDS", "ElastiCache"],
    },
    milestones: [
      { name: "Requirements & Design", duration: "1-2 weeks", cost: "$4,000 - $5,000" },
      { name: "Core System Development", duration: "7-8 weeks", cost: "$20,000 - $24,000" },
      { name: "Barcode & Reporting Module", duration: "3-4 weeks", cost: "$7,000 - $9,000" },
      { name: "UAT & Deployment", duration: "1-2 weeks", cost: "$3,000 - $4,000" },
    ],
    suggestedQuestions: [
      "How many warehouses / locations need to be managed?",
      "Are you integrating with an existing ERP system?",
      "What barcode scanner hardware do you currently use?",
      "Do you need a mobile app for floor staff?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 18, 2026 at 8:45 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 18, 2026 at 8:48 AM", actor: "AI Engine" },
      { label: "Lead qualified by AI", date: "Apr 18, 2026 at 8:48 AM", actor: "AI Engine" },
      { label: "Synced to Zoho CRM", date: "Apr 18, 2026 at 9:30 AM", actor: "System" },
      { label: "Proposal sent to client", date: "Apr 18, 2026 at 4:20 PM", actor: "Pre-Sales" },
    ],
    zoho: {
      status: "Lead Active in Zoho",
      crmId: "Z0H-875012",
      lastSynced: "Apr 18, 2026 at 9:30 AM",
    },
  },

  "LD-1243": {
    id: "LD-1243",
    fullProjectName: "SaaS Analytics Platform for B2B",
    clientContact: "Sarah Chen",
    source: "Direct",
    dateReceived: "Apr 17, 2026",
    status: "won",
    budget: "$125,000 – $145,000",
    timeline: "12–14 months",
    leadSummary:
      "Client is building a white-label SaaS analytics platform for B2B customers. The system requires multi-tenant architecture, customizable dashboards, real-time event tracking, anomaly detection using ML models, and a self-serve onboarding flow for enterprise clients.",
    aiQualification: {
      score: 94,
      label: "Strong Lead - Won",
      description:
        "Exceptional lead with a well-funded client, deep technical clarity, and long-term engagement potential. The budget is generous and the scope is well-matched to our capabilities. Contract has been signed.",
      nextAction:
        "Kick off the project. Schedule introductory call with the development team and begin sprint planning for Phase 1.",
      handoffNote:
        "Lead has been converted to a Won deal in Zoho CRM. Project kick-off in progress.",
    },
    techStack: {
      frontend: ["React", "D3.js", "TypeScript", "Tailwind CSS"],
      backend: ["Python", "FastAPI", "PostgreSQL", "Redis", "Kafka"],
      integrations: ["Segment", "Mixpanel API", "Slack Webhooks", "SendGrid"],
      hosting: ["AWS EKS", "RDS Aurora", "ElastiCache", "CloudFront"],
    },
    milestones: [
      { name: "Architecture & Sprint Planning", duration: "2-3 weeks", cost: "$15,000 - $18,000" },
      { name: "Core Analytics Engine", duration: "16-18 weeks", cost: "$70,000 - $80,000" },
      { name: "Multi-tenant & Onboarding", duration: "8-10 weeks", cost: "$28,000 - $32,000" },
      { name: "ML Models & QA", duration: "6-8 weeks", cost: "$12,000 - $15,000" },
    ],
    suggestedQuestions: [
      "How many tenants do you anticipate in the first year?",
      "Which ML frameworks are you already familiar with?",
      "What are your SLA requirements for real-time data freshness?",
      "Do you need white-label branding per tenant?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 17, 2026 at 9:00 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 17, 2026 at 9:03 AM", actor: "AI Engine" },
      { label: "Lead qualified by AI", date: "Apr 17, 2026 at 9:03 AM", actor: "AI Engine" },
      { label: "Synced to Zoho CRM", date: "Apr 17, 2026 at 10:00 AM", actor: "System" },
      { label: "Proposal accepted by client", date: "Apr 17, 2026 at 3:30 PM", actor: "Sales" },
      { label: "Marked as Won in Zoho", date: "Apr 17, 2026 at 4:00 PM", actor: "System" },
    ],
    zoho: {
      status: "Deal Won in Zoho",
      crmId: "Z0H-868741",
      lastSynced: "Apr 17, 2026 at 4:00 PM",
    },
  },

  "LD-1242": {
    id: "LD-1242",
    fullProjectName: "Mobile Banking App with Biometric Auth",
    clientContact: "David Kumar",
    source: "Alliance",
    dateReceived: "Apr 17, 2026",
    status: "new",
    budget: "$95,000 – $110,000",
    timeline: "9–11 months",
    leadSummary:
      "Fintech startup looking to build a mobile banking application with biometric authentication, account management, fund transfers, bill payments, and a financial insights module. The app must comply with RBI guidelines and support both Android and iOS.",
    aiQualification: {
      score: 62,
      label: "New Lead - Initial Review",
      description:
        "New lead with promising scope and budget. The regulatory compliance requirement adds complexity. Client is in early stages and has not yet confirmed vendor selection. Further discovery needed.",
      nextAction:
        "Schedule an initial discovery call to understand regulatory constraints and confirm budget authority. Assess fintech compliance requirements before proceeding.",
      handoffNote:
        "Lead is newly submitted. Complete AI qualification and assign to a pre-sales engineer before advancing.",
    },
    techStack: {
      frontend: ["React Native", "TypeScript", "React Navigation"],
      backend: ["Node.js", "Express.js", "PostgreSQL"],
      integrations: ["Biometric SDK", "RazorPay", "Firebase", "Twilio OTP"],
      hosting: ["AWS", "RDS", "CloudFront", "WAF"],
    },
    milestones: [
      { name: "Compliance & Architecture", duration: "3-4 weeks", cost: "$14,000 - $16,000" },
      { name: "Core Banking Features", duration: "14-16 weeks", cost: "$55,000 - $62,000" },
      { name: "Security Hardening & Testing", duration: "6-8 weeks", cost: "$18,000 - $22,000" },
      { name: "Audit & Deployment", duration: "2-3 weeks", cost: "$8,000 - $10,000" },
    ],
    suggestedQuestions: [
      "Is this for a licensed banking entity or a fintech product?",
      "Which regulatory framework applies — RBI, NPCI, or others?",
      "Do you have an existing core banking system to integrate with?",
      "What biometric methods are required — fingerprint, face ID, or both?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 17, 2026 at 2:10 PM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 17, 2026 at 2:13 PM", actor: "AI Engine" },
      { label: "Pending assignment", date: "Apr 17, 2026 at 2:13 PM", actor: "AI Engine" },
    ],
  },

  "LD-1241": {
    id: "LD-1241",
    fullProjectName: "E-learning Portal with Live Classes",
    clientContact: "Meera Patel",
    source: "Referral",
    dateReceived: "Apr 16, 2026",
    status: "qualified",
    budget: "$52,000 – $64,000",
    timeline: "5–6 months",
    leadSummary:
      "EdTech startup wants a learning portal supporting video courses, live classes, quizzes, progress tracking, and certificates. The platform needs an instructor dashboard, student profiles, subscription billing, and integrations with a video conferencing tool.",
    aiQualification: {
      score: 81,
      label: "Strong Lead - High Potential",
      description:
        "Clear scope with a growing EdTech market. Referral source adds credibility. Budget is appropriate for the feature set described. Client has a working product concept and understands phased delivery.",
      nextAction:
        "Send a preliminary proposal covering Phase 1 (course catalog + video streaming) and Phase 2 (live classes + billing). Request a discovery call to validate feature priorities.",
      handoffNote:
        "Lead qualifies for handoff. Zoho sync pending — assign to pre-sales before advancing to sales.",
    },
    techStack: {
      frontend: ["Next.js", "React", "Tailwind CSS"],
      backend: ["Node.js", "Express.js", "PostgreSQL"],
      integrations: ["Zoom SDK", "Stripe", "AWS S3 for Video", "Sendbird Chat"],
      hosting: ["AWS EC2", "RDS", "S3 + CloudFront"],
    },
    milestones: [
      { name: "Discovery & Design", duration: "2-3 weeks", cost: "$6,000 - $8,000" },
      { name: "Course & Video Module", duration: "8-10 weeks", cost: "$28,000 - $32,000" },
      { name: "Live Classes & Billing", duration: "5-6 weeks", cost: "$14,000 - $18,000" },
      { name: "QA & Launch", duration: "2-3 weeks", cost: "$4,000 - $6,000" },
    ],
    suggestedQuestions: [
      "What is the expected student capacity at launch?",
      "Will instructors upload pre-recorded content or host only live sessions?",
      "Do you require multi-language support?",
      "What payment model are you targeting — subscription or per-course?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 16, 2026 at 10:20 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 16, 2026 at 10:23 AM", actor: "AI Engine" },
      { label: "Lead qualified by AI", date: "Apr 16, 2026 at 10:23 AM", actor: "AI Engine" },
      { label: "Assigned to Meera Patel", date: "Apr 16, 2026 at 11:30 AM", actor: "Admin" },
    ],
  },

  "LD-1240": {
    id: "LD-1240",
    fullProjectName: "Restaurant Table Booking System",
    clientContact: "Marco Rossi",
    source: "Freelancer",
    dateReceived: "Apr 15, 2026",
    status: "rejected",
    budget: "$12,000 – $18,000",
    timeline: "2–3 months",
    leadSummary:
      "Small restaurant group wants a booking system for table reservations, waitlist management, and basic CRM for repeat customers. Budget is very limited and scope expectations appear to exceed available resources.",
    aiQualification: {
      score: 35,
      label: "Weak Lead - Not Viable",
      description:
        "Budget is insufficient for the described scope. The client expects a fully custom solution with CRM, notifications, and a mobile app — all within $12K. Misaligned expectations and a Freelancer source indicate low conversion probability.",
      nextAction:
        "Communicate budget constraints clearly and offer a scaled-down MVP option. If client is unwilling to adjust scope or budget, close the lead.",
      handoffNote:
        "Lead has been rejected. No further action required unless the client revises their requirements and budget.",
    },
    techStack: {
      frontend: ["React", "Tailwind CSS"],
      backend: ["Node.js", "MongoDB"],
      integrations: ["Twilio SMS", "Google Calendar API"],
      hosting: ["DigitalOcean", "MongoDB Atlas"],
    },
    milestones: [
      { name: "Design & Setup", duration: "1-2 weeks", cost: "$2,000 - $3,000" },
      { name: "Booking Core", duration: "4-5 weeks", cost: "$7,000 - $9,000" },
      { name: "Testing & Launch", duration: "1-2 weeks", cost: "$3,000 - $6,000" },
    ],
    suggestedQuestions: [
      "Are you open to a phased MVP delivery?",
      "Do you need a mobile app or is a mobile-responsive web app sufficient?",
      "Would you consider adjusting the budget for the full feature set?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 15, 2026 at 3:00 PM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 15, 2026 at 3:03 PM", actor: "AI Engine" },
      { label: "Lead rejected by AI", date: "Apr 15, 2026 at 3:03 PM", actor: "AI Engine" },
      { label: "Rejection confirmed by admin", date: "Apr 15, 2026 at 5:00 PM", actor: "Admin" },
    ],
  },

  "LD-1239": {
    id: "LD-1239",
    fullProjectName: "Fintech Investment & Portfolio Dashboard",
    clientContact: "Lisa Wang",
    source: "Direct",
    dateReceived: "Apr 14, 2026",
    status: "under-review",
    budget: "$78,000 – $92,000",
    timeline: "7–8 months",
    leadSummary:
      "Fintech client needs a web-based investment dashboard with portfolio tracking, real-time market data feeds, watchlists, trade history, tax reporting, and an advisor collaboration module for wealth management firms.",
    aiQualification: {
      score: 72,
      label: "Moderate Lead - Good Potential",
      description:
        "Well-scoped project with a realistic budget. Real-time data feed integration and SEBI/SEC compliance requirements add complexity. Client is evaluating two vendors and has not yet made a decision.",
      nextAction:
        "Prepare a technical feasibility document covering data feed integrations and compliance requirements. Present a comparison of phased vs. full delivery timelines.",
      handoffNote:
        "Lead is under active review. Assign a senior pre-sales engineer before advancing to sales team.",
    },
    techStack: {
      frontend: ["React", "TypeScript", "Recharts", "Tailwind CSS"],
      backend: ["Python", "FastAPI", "PostgreSQL", "Redis"],
      integrations: ["Alpha Vantage API", "Plaid", "SendGrid", "Twilio"],
      hosting: ["AWS EC2", "RDS", "ElastiCache", "CloudFront"],
    },
    milestones: [
      { name: "Discovery & Architecture", duration: "2-3 weeks", cost: "$10,000 - $12,000" },
      { name: "Portfolio & Market Data Module", duration: "12-14 weeks", cost: "$45,000 - $52,000" },
      { name: "Tax & Advisor Module", duration: "5-6 weeks", cost: "$16,000 - $20,000" },
      { name: "Compliance Review & Launch", duration: "3-4 weeks", cost: "$7,000 - $8,000" },
    ],
    suggestedQuestions: [
      "Which market data provider are you currently using?",
      "Do you need SEBI, SEC, or both regulatory compliance?",
      "How many advisors and clients will use the platform initially?",
      "Is mobile app support required in Phase 1?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 14, 2026 at 1:00 PM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 14, 2026 at 1:04 PM", actor: "AI Engine" },
      { label: "Flagged for compliance review", date: "Apr 14, 2026 at 3:30 PM", actor: "Admin" },
    ],
  },

  "LD-1238": {
    id: "LD-1238",
    fullProjectName: "Social Media Management & Scheduling Tool",
    clientContact: "Tom Bradley",
    source: "Upwork",
    dateReceived: "Apr 13, 2026",
    status: "lost",
    budget: "$45,000 – $55,000",
    timeline: "5–6 months",
    leadSummary:
      "Marketing agency wanted a multi-platform social media scheduling tool with AI-powered caption generation, analytics dashboard, team collaboration, and brand voice management. Lead was lost to a competitor after proposal stage.",
    aiQualification: {
      score: 45,
      label: "Closed - Lead Lost",
      description:
        "Lead progressed to proposal stage but was ultimately lost to a lower-priced competitor. Client prioritized cost over tech quality. Proposal was competitive but timeline didn't align with their immediate need.",
      nextAction:
        "Archive the lead and record feedback for future pricing strategy. Re-engage in 6 months when their current vendor contract may be up for review.",
      handoffNote:
        "Lead marked as Lost in Zoho. No further action unless client re-engages.",
    },
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "MongoDB", "Redis"],
      integrations: ["Twitter/X API", "Meta Graph API", "LinkedIn API", "OpenAI API"],
      hosting: ["AWS EC2", "MongoDB Atlas", "CloudFront"],
    },
    milestones: [
      { name: "Design & Core Scheduler", duration: "4-5 weeks", cost: "$12,000 - $14,000" },
      { name: "Platform Integrations", duration: "8-10 weeks", cost: "$22,000 - $26,000" },
      { name: "AI & Analytics Module", duration: "4-5 weeks", cost: "$8,000 - $10,000" },
      { name: "Beta & Launch", duration: "2-3 weeks", cost: "$3,000 - $5,000" },
    ],
    suggestedQuestions: [
      "What made you choose the competitor over our proposal?",
      "Would you consider a phased engagement starting with just scheduling?",
      "When does your current vendor contract expire?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 13, 2026 at 9:00 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 13, 2026 at 9:04 AM", actor: "AI Engine" },
      { label: "Synced to Zoho CRM", date: "Apr 13, 2026 at 10:00 AM", actor: "System" },
      { label: "Proposal sent to client", date: "Apr 14, 2026 at 2:00 PM", actor: "Pre-Sales" },
      { label: "Client selected competitor", date: "Apr 16, 2026 at 11:00 AM", actor: "Sales" },
      { label: "Marked as Lost in Zoho", date: "Apr 16, 2026 at 11:30 AM", actor: "System" },
    ],
    zoho: {
      status: "Deal Lost in Zoho",
      crmId: "Z0H-851038",
      lastSynced: "Apr 16, 2026 at 11:30 AM",
    },
  },

  "LD-1237": {
    id: "LD-1237",
    fullProjectName: "CRM Integration & Automation Suite",
    clientContact: "Aisha Johnson",
    source: "Direct",
    dateReceived: "Apr 12, 2026",
    status: "qualified",
    budget: "$67,000 – $80,000",
    timeline: "6–8 months",
    leadSummary:
      "Enterprise client needs a custom CRM integration layer that connects Salesforce, HubSpot, and their proprietary data warehouse. The suite must include automated lead scoring, bi-directional data sync, custom reporting, and a webhook-based event system.",
    aiQualification: {
      score: 83,
      label: "Strong Lead - High Potential",
      description:
        "High-value enterprise lead with a technical team in place. Direct outreach signals genuine intent. The integration complexity is within our capabilities and the budget is well-aligned. Strong conversion probability.",
      nextAction:
        "Arrange a technical deep-dive with the client's engineering lead. Draft a solution architecture document and begin proposal preparation.",
      handoffNote:
        "Lead qualifies for immediate handoff to sales. Ensure technical scope is validated before final proposal sign-off.",
    },
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "Express.js", "PostgreSQL", "Redis"],
      integrations: ["Salesforce API", "HubSpot API", "Zapier Webhooks", "SendGrid"],
      hosting: ["AWS Lambda", "RDS", "EventBridge", "CloudWatch"],
    },
    milestones: [
      { name: "Architecture & API Mapping", duration: "2-3 weeks", cost: "$9,000 - $11,000" },
      { name: "Core Integration Layer", duration: "10-12 weeks", cost: "$38,000 - $44,000" },
      { name: "Reporting & Automation Rules", duration: "5-6 weeks", cost: "$14,000 - $18,000" },
      { name: "Testing & Go-Live", duration: "2-3 weeks", cost: "$6,000 - $7,000" },
    ],
    suggestedQuestions: [
      "Which CRM is the primary system of record?",
      "Are there data privacy constraints we need to design around?",
      "What does your current data sync frequency need to be?",
      "Do you need a real-time event stream or batch processing?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 12, 2026 at 10:45 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 12, 2026 at 10:49 AM", actor: "AI Engine" },
      { label: "Lead qualified by AI", date: "Apr 12, 2026 at 10:49 AM", actor: "AI Engine" },
      { label: "Assigned to Aisha Johnson", date: "Apr 12, 2026 at 12:00 PM", actor: "Admin" },
    ],
  },

  "LD-1236": {
    id: "LD-1236",
    fullProjectName: "Logistics & Fleet Tracking Platform",
    clientContact: "Raj Malhotra",
    source: "Referral",
    dateReceived: "Apr 11, 2026",
    status: "new",
    budget: "$55,000 – $68,000",
    timeline: "5–7 months",
    leadSummary:
      "Logistics company needs a fleet tracking platform with real-time GPS monitoring, driver management, route optimization, delivery status updates, and customer-facing tracking links. Mobile apps required for drivers and dispatchers.",
    aiQualification: {
      score: 65,
      label: "Moderate Lead - Good Potential",
      description:
        "Solid use case with a clear operational need. Referral adds trust. Budget is slightly tight for the full mobile + web scope but could be addressed with a phased delivery model. Client is in early evaluation.",
      nextAction:
        "Conduct an initial scoping call to understand the fleet size and current pain points. Present a phased delivery plan splitting web dashboard and mobile apps.",
      handoffNote:
        "New lead — complete initial qualification before advancing to pre-sales.",
    },
    techStack: {
      frontend: ["React Native", "React", "Tailwind CSS"],
      backend: ["Node.js", "PostgreSQL", "WebSocket"],
      integrations: ["Google Maps Platform", "Firebase FCM", "Twilio", "HERE Maps"],
      hosting: ["AWS EC2", "RDS", "ElastiCache", "S3"],
    },
    milestones: [
      { name: "Discovery & Map Integration", duration: "2-3 weeks", cost: "$7,000 - $9,000" },
      { name: "Web Dashboard & Tracking", duration: "8-10 weeks", cost: "$28,000 - $34,000" },
      { name: "Driver & Dispatcher Apps", duration: "6-8 weeks", cost: "$16,000 - $20,000" },
      { name: "Testing & Deployment", duration: "2-3 weeks", cost: "$4,000 - $5,000" },
    ],
    suggestedQuestions: [
      "How many vehicles are in your current fleet?",
      "Do drivers use company devices or personal phones?",
      "Do you need route optimization or only real-time tracking?",
      "Are customer-facing delivery notifications required at launch?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 11, 2026 at 4:00 PM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 11, 2026 at 4:04 PM", actor: "AI Engine" },
      { label: "Pending assignment", date: "Apr 11, 2026 at 4:04 PM", actor: "AI Engine" },
    ],
  },

  "LD-1235": {
    id: "LD-1235",
    fullProjectName: "HR & Payroll Management System",
    clientContact: "Emma Wilson",
    source: "Alliance",
    dateReceived: "Apr 10, 2026",
    status: "proposal-sent",
    budget: "$40,000 – $50,000",
    timeline: "4–5 months",
    leadSummary:
      "Mid-size company needs a centralized HR and payroll platform covering employee records, leave management, attendance tracking, payroll processing, and compliance reporting. Integration with their existing accounting software is required.",
    aiQualification: {
      score: 76,
      label: "Good Lead - Proposal Sent",
      description:
        "Well-scoped with a realistic budget and a clear business need. Alliance source indicates pre-qualified intent. Proposal has been delivered and client is evaluating. Good probability of conversion.",
      nextAction:
        "Schedule a proposal review call to address any open questions. Highlight our payroll compliance experience and offer references from similar implementations.",
      handoffNote:
        "Proposal sent — sales team to follow up within 2 business days.",
    },
    techStack: {
      frontend: ["React", "Next.js", "Tailwind CSS"],
      backend: ["Node.js", "Express.js", "PostgreSQL"],
      integrations: ["QuickBooks API", "Twilio", "SendGrid", "DocuSign"],
      hosting: ["AWS EC2", "RDS", "S3", "CloudFront"],
    },
    milestones: [
      { name: "Discovery & Payroll Rules", duration: "1-2 weeks", cost: "$5,000 - $6,000" },
      { name: "HR Core & Employee Records", duration: "7-8 weeks", cost: "$22,000 - $26,000" },
      { name: "Payroll & Compliance Module", duration: "4-5 weeks", cost: "$10,000 - $13,000" },
      { name: "Integration & Testing", duration: "2-3 weeks", cost: "$3,000 - $5,000" },
    ],
    suggestedQuestions: [
      "How many employees will the system manage at launch?",
      "Which accounting software are you currently using?",
      "Do you need multi-country payroll or domestic only?",
      "Is a mobile app for employees required for leave requests?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 10, 2026 at 9:30 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 10, 2026 at 9:34 AM", actor: "AI Engine" },
      { label: "Lead qualified by AI", date: "Apr 10, 2026 at 9:34 AM", actor: "AI Engine" },
      { label: "Synced to Zoho CRM", date: "Apr 10, 2026 at 10:15 AM", actor: "System" },
      { label: "Proposal sent to client", date: "Apr 10, 2026 at 3:45 PM", actor: "Pre-Sales" },
    ],
    zoho: {
      status: "Lead Active in Zoho",
      crmId: "Z0H-839412",
      lastSynced: "Apr 10, 2026 at 10:15 AM",
    },
  },

  "LD-1234": {
    id: "LD-1234",
    fullProjectName: "EdTech Learning Management System",
    clientContact: "Carlos Rivera",
    source: "Upwork",
    dateReceived: "Apr 9, 2026",
    status: "won",
    budget: "$92,000 – $115,000",
    timeline: "10–12 months",
    leadSummary:
      "Well-funded EdTech company needs a full LMS with course authoring tools, adaptive learning paths, proctored assessments, real-time collaboration, gamification, and an enterprise reporting suite for corporate training programs.",
    aiQualification: {
      score: 91,
      label: "Strong Lead - Won",
      description:
        "Large-budget project with a sophisticated EdTech client. Clear requirements, experienced stakeholders, and a defined roadmap. The contract was won after a competitive evaluation. High long-term account value.",
      nextAction:
        "Project kick-off is scheduled. Finalize team allocation and begin sprint 1 planning.",
      handoffNote:
        "Deal marked as Won in Zoho. Project is in kick-off phase.",
    },
    techStack: {
      frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "PostgreSQL", "Redis", "WebSocket"],
      integrations: ["Zoom SDK", "AWS S3", "Stripe", "Twilio", "OpenAI API"],
      hosting: ["AWS ECS", "RDS Aurora", "S3 + CloudFront", "ElastiCache"],
    },
    milestones: [
      { name: "Architecture & LMS Core", duration: "3-4 weeks", cost: "$14,000 - $17,000" },
      { name: "Course Authoring & Delivery", duration: "14-16 weeks", cost: "$52,000 - $60,000" },
      { name: "Assessment & Proctoring", duration: "6-8 weeks", cost: "$18,000 - $22,000" },
      { name: "Reporting Suite & Launch", duration: "4-6 weeks", cost: "$8,000 - $16,000" },
    ],
    suggestedQuestions: [
      "What authoring tool formats do your instructors currently use?",
      "Do you need SCORM/xAPI compliance for existing course content?",
      "What is the expected concurrent user load during peak sessions?",
      "Do you require white-labeling for enterprise clients?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 9, 2026 at 8:00 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 9, 2026 at 8:04 AM", actor: "AI Engine" },
      { label: "Lead qualified by AI", date: "Apr 9, 2026 at 8:04 AM", actor: "AI Engine" },
      { label: "Synced to Zoho CRM", date: "Apr 9, 2026 at 9:00 AM", actor: "System" },
      { label: "Proposal accepted", date: "Apr 11, 2026 at 5:00 PM", actor: "Sales" },
      { label: "Marked as Won in Zoho", date: "Apr 11, 2026 at 5:30 PM", actor: "System" },
    ],
    zoho: {
      status: "Deal Won in Zoho",
      crmId: "Z0H-828053",
      lastSynced: "Apr 11, 2026 at 5:30 PM",
    },
  },

  "LD-1233": {
    id: "LD-1233",
    fullProjectName: "Healthcare Appointment Booking App",
    clientContact: "Sophie Turner",
    source: "Direct",
    dateReceived: "Apr 8, 2026",
    status: "under-review",
    budget: "$48,000 – $60,000",
    timeline: "5–6 months",
    leadSummary:
      "Multi-specialty clinic chain needs a patient-facing appointment booking app with doctor profiles, specialty filters, slot availability, teleconsultation, prescription management, and integration with their existing hospital management software.",
    aiQualification: {
      score: 69,
      label: "Moderate Lead - Needs Evaluation",
      description:
        "Decent scope with clear requirements but the HMS integration adds unknown complexity. Budget may need adjustment once the integration scope is clarified. Direct source is positive. Under review for technical feasibility.",
      nextAction:
        "Request the HMS integration API documentation and assess complexity. Schedule a technical call with the client's IT team to evaluate scope before advancing.",
      handoffNote:
        "Lead is under review pending HMS integration assessment. Do not advance to sales until technical feasibility is confirmed.",
    },
    techStack: {
      frontend: ["React Native", "TypeScript", "React Navigation"],
      backend: ["Node.js", "Express.js", "PostgreSQL"],
      integrations: ["Twilio Video", "Firebase FCM", "Razorpay", "HL7 HMS API"],
      hosting: ["AWS EC2", "RDS", "S3", "CloudFront"],
    },
    milestones: [
      { name: "Discovery & HMS Integration Audit", duration: "2-3 weeks", cost: "$7,000 - $9,000" },
      { name: "Booking & Doctor Profiles", duration: "8-10 weeks", cost: "$26,000 - $30,000" },
      { name: "Teleconsultation & Prescriptions", duration: "4-5 weeks", cost: "$12,000 - $15,000" },
      { name: "Testing & Launch", duration: "2-3 weeks", cost: "$3,000 - $6,000" },
    ],
    suggestedQuestions: [
      "Which HMS platform are you currently using?",
      "Does the HMS vendor provide a documented REST API?",
      "Will teleconsultation be video-based, chat-based, or both?",
      "Do you need a web portal for clinic staff alongside the patient app?",
    ],
    auditLog: [
      { label: "Lead submitted to portal", date: "Apr 8, 2026 at 11:00 AM", actor: "System" },
      { label: "AI analysis completed", date: "Apr 8, 2026 at 11:04 AM", actor: "AI Engine" },
      { label: "Flagged for technical review", date: "Apr 8, 2026 at 2:30 PM", actor: "Admin" },
    ],
  },
};

export function getLeadDetail(id: string): LeadDetail | null {
  return LEAD_DETAILS[id] ?? null;
}
