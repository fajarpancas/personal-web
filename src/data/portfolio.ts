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
    bio: "6+ years building mobile apps people actually use — 17+ apps shipped on the App Store and Google Play.",
    cta: "See My Work →",
    floatBadge: { icon: "🚀", value: "17+", label: "apps shipped" },
    profileImg: "/profile.png",
  },
  stats: [
    { value: 6, suffix: "+", label: "Years Experience" },
    { value: 17, suffix: "+", label: "Apps Shipped" },
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
    title: "Work Experiences",
    intro:
      "Frontend Developer focused on React Native across full-time and part-time roles since 2019, delivering mobile apps while balancing concurrent engagements.",
  },
  experiences: [
    {
      company: "VirtualSpirit",
      initial: "VS",
      badge: "11 apps",
      desc: "Mobile app studio building products across logistics, fintech, and productivity — spanning React Native, TypeScript, and real-time features.",
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
  projectsTitle: "Projects",
  clientsCountries: ["Indonesia", "Singapore", "China", "Malaysia"],
  projects: [
    {
      title: "JIFF Customer",
      desc: "A consumer super app that combines a marketplace with on-demand express delivery.",
      img: "/jiff-customer.png",
      tags: ["React Native", "TypeScript", "Marketplace", "Real-time"],
      appStore: "https://apps.apple.com/us/app/jiff-express-shopping/id6749932038",
      playStore: "https://play.google.com/store/apps/details?id=com.jiffcustomer.app",
    },
    {
      title: "JIFF Agent",
      desc: "A field-operations super app supporting four roles: Merchant, Storage, Rider, and Reseller agents.",
      img: "/jiff-agent.png",
      tags: ["React Native", "TypeScript", "Roles & Permissions"],
      appStore: "https://apps.apple.com/us/app/jiff-agent-partners-app/id6749932298",
      playStore: "https://play.google.com/store/apps/details?id=com.jiffagent.app",
    },
    {
      title: "KohBus Driver",
      desc: "A driver app with turn-by-turn navigation across scheduled routes and waypoints, plus in-app messaging with riders on the same route.",
      img: "/kohbus-driver.png",
      tags: ["React Native", "Maps", "Navigation", "Real-time"],
      appStore: "https://apps.apple.com/id/app/kohbus-driver/id6738333966?l=id",
      playStore: "https://play.google.com/store/apps/details?id=com.kohbus.driver.app.release",
    },
    {
      title: "KohBus Rider",
      desc: "A rider app for bus booking, live vehicle tracking, and in-app chat with drivers.",
      img: "/kohbus-rider.png",
      tags: ["React Native", "Maps", "Booking", "Chat"],
      appStore: "https://apps.apple.com/id/app/kohbus-rider/id6738334250?l=id",
      playStore: "https://play.google.com/store/apps/details?id=com.kohbus.rider.app.release",
    },
    {
      title: "Madkhal",
      desc: "An Islamic app with Qibla direction, prayer times (currently Malaysia & Singapore), and free/premium learning content via videos and documents.",
      img: "/madkhal.png",
      tags: ["React Native", "Offline", "Multimedia"],
      appStore: "https://apps.apple.com/id/app/madkhal/id6479597417?l=id",
      playStore: "https://play.google.com/store/apps/details?id=com.elmadhkhalmobile.app",
    },
    {
      title: "VirtualSpace",
      desc: "Mobile based chat and project management application",
      img: "/virtualspace.png",
      tags: ["React Native", "Chat", "WebSocket", "Redux"],
      appStore: "https://apps.apple.com/id/app/virtualspace-work-smarter/id1513794884",
      playStore: "https://play.google.com/store/apps/details?id=me.virtualspirit.virtualspace",
    },
    {
      title: "KoolBuddy",
      desc: "A digital companion app for carbon-conscious generation",
      img: "/koolbuddy.png",
      tags: ["React Native", "Gamification", "Tracking"],
      appStore: "https://apps.apple.com/mn/app/kool-buddy/id6450994509",
      playStore: "",
    },
    {
      title: "Achiever Dream+",
      desc: "Mobile based for chemistry practical examination in Singapore with an NEA-approved Chemistry Practical Lab",
      img: "/achiever-dream-plus.png",
      tags: ["React Native", "Exam Platform", "Content"],
      appStore: "https://apps.apple.com/id/app/achievers-dream/id1662868706?l=id",
      playStore: "https://play.google.com/store/apps/details?id=com.achieversdream.app",
    },
    {
      title: "Moirai MomCare",
      desc: "Mobile based to assist every step of pregnancy journey",
      img: "/momcare.png",
      tags: ["React Native", "Health", "Reminders"],
      appStore: "https://apps.apple.com/sg/app/moirai-momcare/id1663835824",
      playStore: "https://play.google.com/store/apps/details?id=com.momcare.app",
    },
    {
      title: "Together Living",
      desc: "Mobile base payment for room rental with features chat, store, reward.",
      img: "/together-living.png",
      tags: ["React Native", "Payments", "Chat", "Rewards"],
      appStore: "https://apps.apple.com/us/app/together-living/id1583899658",
      playStore: "https://play.google.com/store/apps/details?id=com.togetherliving.app",
    },
    {
      title: "Tzu-Chi Volunteer Management",
      desc: "Mobile based application volunteer management for Tzu-Chi Malaysia",
      img: "/tzu-chi-vms.png",
      tags: ["React Native", "Volunteer Management", "Offline"],
      appStore: "",
      playStore: "",
    },
    {
      title: "WhatsDoc",
      desc: "Mobile based doctor-to-doctor and doctor-to-patient consultation via chat or video call",
      img: "/whatsdoc.png",
      tags: ["React Native", "Video Call", "Telehealth"],
      appStore: "",
      playStore: "",
    },
    {
      title: "Duedi: The investor's toolkit",
      desc: "Mobile based toolkits for investor, this app provide 12 free tools for investor",
      img: "/duedi.png",
      tags: ["React Native", "Finance", "Charts"],
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue Merchant Operator",
      desc: "Mobile based queue used by the admin of the merchant to create new queue",
      img: "/antrique-operator.png",
      tags: ["React Native", "Queue", "Admin"],
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue KIOSK",
      desc: "Mobile based queue thats connects to a Bluetooth thermal printer device for retrieval and printing the queue tickets",
      img: "/antrique-kiosk.png",
      tags: ["React Native", "Bluetooth", "Thermal Printing"],
      appStore: "",
      playStore: "",
    },
    {
      title: "AntriQue Customer",
      desc: "Mobile based queue used by user for queue retrieval and monitoring",
      img: "/antrique-customer.png",
      tags: ["React Native", "Queue", "Real-time"],
      appStore: "",
      playStore: "",
    },
  ],
  contact: {
    eyebrow: "03 · Contact",
    title: "Let's Connect",
    intro:
      "Have a project idea or just want to chat? I'd love to hear from you — my inbox is always open.",
    email: "fajarpancasaputra@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/fajarpancasaputra/",
    linkedinHandle: "in/fajarpancasaputra",
    githubUrl: "https://github.com/fajarpancas",
    githubHandle: "@fajarpancas",
  },
  footer: "© {year} Fajar Panca · crafted with ♥ in Indonesia",
};
