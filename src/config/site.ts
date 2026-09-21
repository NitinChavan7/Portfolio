const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nitinchavan7.github.io/portfolio";

export const siteConfig = {
  name: "Nitin Chavan",
  shortName: "NC",
  title: "Full Stack Developer | React.js, Node.js, PostgreSQL",
  description:
    "I build production-ready React.js and Node.js web applications with reliable REST APIs, PostgreSQL-backed workflows, clean UI systems, and business-focused product delivery.",
  shareTitle: "Nitin Chavan | Full Stack Developer",
  shareDescription:
    "Full stack developer in Hyderabad with 2+ years of production experience across React.js, Redux, Node.js, Express.js, PostgreSQL, HRMS, payroll, admin panels, and API-driven business applications.",
  url: siteUrl,
  email: "nitin.k.chavan1001@gmail.com",
  emailMailto: "mailto:nitin.k.chavan1001@gmail.com",
  emailGmail:
    "https://mail.google.com/mail/?view=cm&fs=1&to=nitin.k.chavan1001@gmail.com",
  phone: "+91 9325997861",
  linkedin: "https://www.linkedin.com/",
  whatsapp: "https://wa.me/919325997861",
  messenger: "https://m.me/nitin.k.chavan1001",
  github: "https://github.com/NitinChavan7",
  leetcode: "",
  resume: "/resume/nitin-chavan-resume.pdf",
  resumeDownloadName: "Nitin-Chavan-Resume.pdf",
  nav: [
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
    { label: "Labs", href: "/#labs" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
