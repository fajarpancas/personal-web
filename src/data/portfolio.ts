export interface Project {
  title: string;
  desc: string;
  img: string;
  tags: string[];
  /** Client's country, shown as a flag badge on the card (e.g. "Indonesia"). */
  clientCountry?: string;
  appStore: string;
  playStore: string;
}

export interface ExperienceRole {
  type: "Full-time" | "Part-time";
  period: string;
  current?: boolean;
}

export interface Experience {
  company: string;
  initial: string;
  badge: string;
  desc: string;
  roles: ExperienceRole[];
  tags: string[];
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  sub?: string;
}

export interface PortfolioContent {
  hero: {
    name: string;
    roles: string[];
    bio: string;
    cta: string;
    floatBadge: { icon: string; value: string; label: string };
    profileImg: string;
  };
  stats: Stat[];
  skills: string[];
  about: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  experiences: Experience[];
  projectsEyebrow: string;
  projectsTitle: string;
  /** Countries the clients are from, shown as a strip under the Projects heading. */
  clientsCountries: string[];
  projects: Project[];
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    email: string;
    linkedinUrl: string;
    linkedinHandle: string;
    githubUrl: string;
    githubHandle: string;
  };
  footer: string;
}

export const DEFAULT_CONTENT: PortfolioContent = {
  hero: {
    name: "Fajar Panca",
    roles: ["Frontend Developer", "React Native Developer", "Mobile Engineer"],
    bio: "I'm Fajar Panca, a Mobile Engineer in Indonesia. Nineteen apps on the App Store and Google Play.",
    cta: "See the apps",
    floatBadge: { icon: "🚀", value: "19+", label: "apps shipped" },
    profileImg: "/portrait.png",
  },
  stats: [
    { value: 6, suffix: "+", label: "Years Experience" },
    { value: 19, suffix: "+", label: "Apps Shipped" },
    { value: 4, label: "Companies" },
    { value: 2, label: "Platforms", sub: "iOS & Android" },
  ],
  skills: [
    "React Native",
    "TypeScript",
    "JavaScript",
    "Redux",
    "Redux Saga",
    "Zustand",
    "Android Kotlin",
    "iOS Swift",
    "Firebase",
    "REST API",
    "Git",
    "Agile",
  ],
  about: {
    eyebrow: "01 · Career",
    title: "The studios",
    intro:
      "Frontend Developer focused on React Native across full-time and part-time roles since 2019, delivering mobile apps while balancing concurrent engagements.",
  },
  experiences: [
    {
      company: "VirtualSpirit",
      initial: "VS",
      badge: "13 apps",
      desc: "Mobile app studio building products across logistics, fintech, and productivity, spanning React Native, TypeScript, and real-time features.",
      roles: [
        { type: "Full-time", period: "Dec 2019 – Nov 2022" },
        { type: "Part-time", period: "Nov 2022 – Nov 2023" },
        { type: "Full-time", period: "Nov 2023 – Present", current: true },
      ],
      tags: [
        "React Native",
        "TypeScript",
        "Redux",
        "Redux Saga",
        "Zustand",
        "Android Kotlin",
        "iOS Swift",
      ],
    },
    {
      company: "Dagangan",
      initial: "DG",
      badge: "1 app",
      desc: "E-commerce platform connecting rural communities with FMCG products, built for low-bandwidth environments.",
      roles: [{ type: "Full-time", period: "Nov 2022 – Nov 2023" }],
      tags: ["React Native", "TypeScript", "Redux"],
    },
    {
      company: "AntriQue",
      initial: "AQ",
      badge: "4 apps",
      desc: "Smart queue management system with Bluetooth thermal printer integration for merchants and customers.",
      roles: [{ type: "Part-time", period: "Sep 2020 – Aug 2021" }],
      tags: ["React Native", "TypeScript", "Redux", "Bluetooth"],
    },
  ],
  projectsEyebrow: "02 · Portfolio",
  projectsTitle: "Shipped apps",
  clientsCountries: ["Indonesia", "Singapore", "China", "Malaysia"],
  projects: [
    {
      title: "JIFF Customer",
      desc: "Marketplace and on-demand express delivery in one consumer app, from browsing and checkout to live order tracking.",
      img: "/jiff-customer.png",
      tags: ["React Native", "TypeScript", "Marketplace", "Real-time"],
      appStore: "https://apps.apple.com/us/app/jiff-express-shopping/id6749932038",
      playStore: "https://play.google.com/store/apps/details?id=com.jiffcustomer.app",
    },
    {
      title: "JIFF Agent",
      desc: "Field operations for four roles — Merchant, Storage, Rider, and Reseller — each with its own permissions and workflow.",
      img: "/jiff-agent.png",
      tags: ["React Native", "TypeScript", "Roles & Permissions"],
      appStore: "https://apps.apple.com/us/app/jiff-agent-partners-app/id6749932298",
      playStore: "https://play.google.com/store/apps/details?id=com.jiffagent.app",
    },
    {
      title: "KohBus Driver",
      desc: "Turn-by-turn navigation across scheduled routes and waypoints, plus in-app messaging with riders on the same trip.",
      img: "/kohbus-driver.png",
      tags: ["React Native", "Maps", "Navigation", "Real-time"],
      appStore: "https://apps.apple.com/id/app/kohbus-driver/id6738333966?l=id",
      playStore: "https://play.google.com/store/apps/details?id=com.kohbus.driver.app.release",
    },
    {
      title: "KohBus Rider",
      desc: "Bus booking with live vehicle tracking and direct in-app chat with the driver.",
      img: "/kohbus-rider.png",
      tags: ["React Native", "Maps", "Booking", "Chat"],
      appStore: "https://apps.apple.com/id/app/kohbus-rider/id6738334250?l=id",
      playStore: "https://play.google.com/store/apps/details?id=com.kohbus.rider.app.release",
    },
    {
      title: "Madkhal",
      desc: "Qibla direction and prayer times for Malaysia and Singapore, with free and premium lessons delivered as video and documents.",
      img: "/madkhal.png",
      tags: ["React Native", "Offline", "Multimedia"],
      appStore: "https://apps.apple.com/id/app/madkhal/id6479597417?l=id",
      playStore: "https://play.google.com/store/apps/details?id=com.elmadhkhalmobile.app",
    },
    {
      title: "VirtualSpace",
      desc: "Chat and project management for teams, with real-time messaging over WebSocket.",
      img: "/virtualspace.png",
      tags: ["React Native", "Chat", "WebSocket", "Redux"],
      appStore: "https://apps.apple.com/id/app/virtualspace-work-smarter/id1513794884",
      playStore: "https://play.google.com/store/apps/details?id=me.virtualspirit.virtualspace",
    },
    {
      title: "KoolBuddy",
      desc: "Companion app that turns carbon-conscious habits into tracked, gamified daily actions.",
      img: "/koolbuddy.png",
      tags: ["React Native", "Gamification", "Tracking"],
      appStore: "https://apps.apple.com/mn/app/kool-buddy/id6450994509",
      playStore: "",
    },
    {
      title: "Achiever Dream+",
      desc: "Chemistry practical exam preparation for Singapore students, built with an NEA-approved practical lab.",
      img: "/achiever-dream-plus.png",
      tags: ["React Native", "Exam Platform", "Content"],
      appStore: "https://apps.apple.com/id/app/achievers-dream/id1662868706?l=id",
      playStore: "https://play.google.com/store/apps/details?id=com.achieversdream.app",
    },
    {
      title: "Moirai MomCare",
      desc: "Pregnancy companion covering each stage of the journey, with tracking and timely reminders.",
      img: "/momcare.png",
      tags: ["React Native", "Health", "Reminders"],
      appStore: "https://apps.apple.com/sg/app/moirai-momcare/id1663835824",
      playStore: "https://play.google.com/store/apps/details?id=com.momcare.app",
    },
    {
      title: "Together Living",
      desc: "Room-rental payments for residents, with in-app chat, a store, and rewards in the same app.",
      img: "/together-living.png",
      tags: ["React Native", "Payments", "Chat", "Rewards"],
      appStore: "https://apps.apple.com/us/app/together-living/id1583899658",
      playStore: "https://play.google.com/store/apps/details?id=com.togetherliving.app",
    },
    {
      title: "Tzu-Chi Volunteer Management",
      desc: "Volunteer management for Tzu Chi Malaysia, built to keep working offline in the field.",
      img: "/tzu-chi-vms.png",
      tags: ["React Native", "Volunteer Management", "Offline"],
      appStore: "",
      playStore: "",
    },
    {
      title: "WhatsDoc",
      desc: "Doctor-to-doctor and doctor-to-patient consultations over chat and video call.",
      img: "/whatsdoc.png",
      tags: ["React Native", "Video Call", "Telehealth"],
      appStore: "",
      playStore: "",
    },
    {
      title: "Duedi: The investor's toolkit",
      desc: "Investor toolkit that puts twelve free investing tools in one app.",
      img: "/duedi.png",
      tags: ["React Native", "Finance", "Charts"],
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue Merchant Operator",
      desc: "Merchant-side queue control, where operators create and manage queues for walk-in customers.",
      img: "/antrique-operator.png",
      tags: ["React Native", "Queue", "Admin"],
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue KIOSK",
      desc: "Self-service queue kiosk that prints numbered tickets through a Bluetooth thermal printer.",
      img: "/antrique-kiosk.png",
      tags: ["React Native", "Bluetooth", "Thermal Printing"],
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue Customer",
      desc: "Customer queue app to take a number remotely and follow the queue in real time.",
      img: "/antrique-customer.png",
      tags: ["React Native", "Queue", "Real-time"],
      appStore: "",
      playStore: "",
    },
    {
      title: "Medimate Malaysia",
      desc: "Helps individuals and families in Malaysia arrange trusted, non-medical companion support for hospital and clinic appointments.",
      img: "/medimate-malaysia.png",
      tags: ["React Native", "Companion", "Malaysia"],
      clientCountry: "Malaysia",
      appStore: "https://apps.apple.com/us/app/medimate-malaysia/id6812279991",
      playStore: "https://play.google.com/store/apps/details?id=my.medimate.patient",
    },
    {
      title: "Medimate Companion Malaysia",
      desc: "Guides patients through medical appointments — navigation, registration, and paperwork — and sends progress updates to authorised family members.",
      img: "/medimate-companion.png",
      tags: ["React Native", "Companion", "Appointments"],
      clientCountry: "Malaysia",
      appStore: "https://apps.apple.com/us/app/medimate-malaysia-companion/id6812143842",
      playStore: "https://play.google.com/store/apps/details?id=my.medimate.companion",
    },
  ],
  contact: {
    eyebrow: "03 · Contact",
    title: "Write me",
    intro:
      "A mobile app, a contract, or a question. The note opens in your mail app.",
    email: "fajarpancasaputra@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/fajarpancasaputra/",
    linkedinHandle: "in/fajarpancasaputra",
    githubUrl: "https://github.com/fajarpancas",
    githubHandle: "@fajarpancas",
  },
  footer: "© {year} Fajar Panca, Indonesia",
};
