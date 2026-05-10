export type Category =
  | "Language"
  | "Frontend"
  | "Backend"
  | "Mobile"
  | "Database"
  | "DevOps"
  | "Cloud"
  | "AI/ML"
  | "Tool"
  | "Design"
  | "CMS"
  | "Testing"
  | "Blockchain"
  | "OS";

export type Skill = {
  iconKey: string;
  name: string;
  color: string;
  category: Category;
  enabled: boolean; // toggle this to show/hide on portfolio
};

export const SKILLS: Skill[] = [
  // ── Languages ────────────────────────────────────────────────
  { iconKey: "IoLogoJavascript",  name: "JavaScript",     color: "text-yellow-400", category: "Language",   enabled: true  },
  { iconKey: "SiTypescript",      name: "TypeScript",     color: "text-sky-600",    category: "Language",   enabled: true  },
  { iconKey: "FaHtml5",           name: "HTML5",          color: "text-orange-500", category: "Language",   enabled: true  },
  { iconKey: "IoLogoCss3",        name: "CSS3",           color: "text-sky-700",    category: "Language",   enabled: true  },
  { iconKey: "FaJava",            name: "Java",           color: "text-orange-500", category: "Language",   enabled: true  },
  { iconKey: "FaPhp",             name: "PHP",            color: "text-indigo-500", category: "Language",   enabled: true  },
  { iconKey: "IoLogoPython",      name: "Python",         color: "text-yellow-500", category: "Language",   enabled: false },
  { iconKey: "SiRust",            name: "Rust",           color: "text-orange-700", category: "Language",   enabled: false },
  { iconKey: "SiGo",              name: "Go",             color: "text-sky-400",    category: "Language",   enabled: false },
  { iconKey: "FaGolang",          name: "Golang",         color: "text-sky-500",    category: "Language",   enabled: false },
  { iconKey: "SiCplusplus",       name: "C++",            color: "text-blue-600",   category: "Language",   enabled: false },
  { iconKey: "SiC",               name: "C",              color: "text-blue-700",   category: "Language",   enabled: false },
  { iconKey: "SiRuby",            name: "Ruby",           color: "text-red-500",    category: "Language",   enabled: false },
  { iconKey: "SiKotlin",          name: "Kotlin",         color: "text-violet-500", category: "Language",   enabled: false },
  { iconKey: "SiSwift",           name: "Swift",          color: "text-orange-500", category: "Language",   enabled: false },
  { iconKey: "SiDart",            name: "Dart",           color: "text-sky-500",    category: "Language",   enabled: false },
  { iconKey: "SiElixir",          name: "Elixir",         color: "text-purple-500", category: "Language",   enabled: false },
  { iconKey: "SiHaskell",         name: "Haskell",        color: "text-indigo-400", category: "Language",   enabled: false },
  { iconKey: "SiScala",           name: "Scala",          color: "text-red-500",    category: "Language",   enabled: false },
  { iconKey: "SiLua",             name: "Lua",            color: "text-blue-500",   category: "Language",   enabled: false },
  { iconKey: "SiR",               name: "R",              color: "text-blue-600",   category: "Language",   enabled: false },
  { iconKey: "SiJulia",           name: "Julia",          color: "text-purple-500", category: "Language",   enabled: false },
  { iconKey: "SiPerl",            name: "Perl",           color: "text-sky-700",    category: "Language",   enabled: false },
  { iconKey: "SiWebassembly",     name: "WebAssembly",    color: "text-violet-600", category: "Language",   enabled: false },
  { iconKey: "SiSolidity",        name: "Solidity",       color: "text-gray-500",   category: "Language",   enabled: false },
  { iconKey: "IoLogoSass",        name: "Sass",           color: "text-pink-500",   category: "Language",   enabled: false },

  // ── Frontend ─────────────────────────────────────────────────
  { iconKey: "FaReact",           name: "React",          color: "text-sky-500",    category: "Frontend",   enabled: true  },
  { iconKey: "RiNextjsFill",      name: "Next.js",        color: "text-black dark:text-white", category: "Frontend", enabled: true },
  { iconKey: "RiTailwindCssFill", name: "Tailwind CSS",   color: "text-sky-500",    category: "Frontend",   enabled: true  },
  { iconKey: "FaVuejs",           name: "Vue",            color: "text-green-500",  category: "Frontend",   enabled: false },
  { iconKey: "SiNuxtdotjs",       name: "Nuxt.js",        color: "text-green-500",  category: "Frontend",   enabled: false },
  { iconKey: "SiAngular",         name: "Angular",        color: "text-red-600",    category: "Frontend",   enabled: false },
  { iconKey: "SiSvelte",          name: "Svelte",         color: "text-orange-600", category: "Frontend",   enabled: false },
  { iconKey: "SiAstro",           name: "Astro",          color: "text-orange-500", category: "Frontend",   enabled: false },
  { iconKey: "SiRemix",           name: "Remix",          color: "text-gray-200",   category: "Frontend",   enabled: false },
  { iconKey: "SiQwik",            name: "Qwik",           color: "text-sky-400",    category: "Frontend",   enabled: false },
  { iconKey: "SiSolid",           name: "SolidJS",        color: "text-blue-500",   category: "Frontend",   enabled: false },
  { iconKey: "SiJquery",          name: "jQuery",         color: "text-blue-500",   category: "Frontend",   enabled: true  },
  { iconKey: "SiRedux",           name: "Redux",          color: "text-purple-500", category: "Frontend",   enabled: false },
  { iconKey: "SiZustand",         name: "Zustand",        color: "text-amber-600",  category: "Frontend",   enabled: false },
  { iconKey: "SiReactquery",      name: "React Query",    color: "text-red-500",    category: "Frontend",   enabled: false },
  { iconKey: "SiJotai",           name: "Jotai",          color: "text-gray-400",   category: "Frontend",   enabled: false },
  { iconKey: "SiRecoil",          name: "Recoil",         color: "text-sky-500",    category: "Frontend",   enabled: false },
  { iconKey: "SiXstate",          name: "XState",         color: "text-gray-200",   category: "Frontend",   enabled: false },
  { iconKey: "SiAxios",           name: "Axios",          color: "text-purple-500", category: "Frontend",   enabled: false },
  { iconKey: "SiSocketdotio",     name: "Socket.io",      color: "text-gray-200",   category: "Frontend",   enabled: false },
  { iconKey: "SiThreejs",         name: "Three.js",       color: "text-gray-200",   category: "Frontend",   enabled: false },
  { iconKey: "SiD3Dotjs",         name: "D3.js",          color: "text-orange-500", category: "Frontend",   enabled: false },
  { iconKey: "SiChartdotjs",      name: "Chart.js",       color: "text-pink-500",   category: "Frontend",   enabled: false },
  { iconKey: "TbBrandFramerMotion", name: "Framer Motion", color: "text-pink-500",  category: "Frontend",   enabled: false },
  { iconKey: "SiFramer",          name: "Framer",         color: "text-sky-500",    category: "Frontend",   enabled: false },
  { iconKey: "SiStyledcomponents", name: "Styled Comp.",  color: "text-pink-400",   category: "Frontend",   enabled: false },
  { iconKey: "SiEmotion",         name: "Emotion",        color: "text-pink-400",   category: "Frontend",   enabled: false },
  { iconKey: "SiChakraui",        name: "Chakra UI",      color: "text-teal-400",   category: "Frontend",   enabled: false },
  { iconKey: "SiMui",             name: "MUI",            color: "text-blue-500",   category: "Frontend",   enabled: false },
  { iconKey: "SiAntdesign",       name: "Ant Design",     color: "text-blue-500",   category: "Frontend",   enabled: false },
  { iconKey: "SiPrimefaces",      name: "PrimeFaces",     color: "text-blue-500",   category: "Frontend",   enabled: false },
  { iconKey: "SiPrimeng",         name: "PrimeNG",        color: "text-green-500",  category: "Frontend",   enabled: false },
  { iconKey: "SiPrimereact",      name: "PrimeReact",     color: "text-sky-500",    category: "Frontend",   enabled: false },
  { iconKey: "SiPrimevue",        name: "PrimeVue",       color: "text-emerald-500",category: "Frontend",   enabled: false },
  { iconKey: "SiBootstrap",       name: "Bootstrap",      color: "text-purple-600", category: "Frontend",   enabled: false },
  { iconKey: "SiDaisyui",         name: "DaisyUI",        color: "text-green-500",  category: "Frontend",   enabled: false },
  { iconKey: "SiShadcnui",        name: "shadcn/ui",      color: "text-gray-200",   category: "Frontend",   enabled: false },
  { iconKey: "SiRadixui",         name: "Radix UI",       color: "text-gray-200",   category: "Frontend",   enabled: false },
  { iconKey: "SiLeaflet",         name: "Leaflet",        color: "text-green-600",  category: "Frontend",   enabled: false },
  { iconKey: "SiMapbox",          name: "Mapbox",         color: "text-sky-500",    category: "Frontend",   enabled: false },
  { iconKey: "SiStorybook",       name: "Storybook",      color: "text-pink-500",   category: "Frontend",   enabled: false },

  // ── Backend ──────────────────────────────────────────────────
  { iconKey: "IoLogoNodejs",      name: "Node.js",        color: "text-green-600",  category: "Backend",    enabled: true  },
  { iconKey: "SiExpress",         name: "Express",        color: "text-gray-400",   category: "Backend",    enabled: false },
  { iconKey: "SiNestjs",          name: "NestJS",         color: "text-red-500",    category: "Backend",    enabled: false },
  { iconKey: "FaLaravel",         name: "Laravel",        color: "text-red-500",    category: "Backend",    enabled: true  },
  { iconKey: "SiDjango",          name: "Django",         color: "text-green-800",  category: "Backend",    enabled: false },
  { iconKey: "SiFlask",           name: "Flask",          color: "text-gray-200",   category: "Backend",    enabled: false },
  { iconKey: "SiFastapi",         name: "FastAPI",        color: "text-teal-500",   category: "Backend",    enabled: false },
  { iconKey: "SiRubyonrails",     name: "Rails",          color: "text-red-600",    category: "Backend",    enabled: false },
  { iconKey: "SiSpring",          name: "Spring",         color: "text-green-600",  category: "Backend",    enabled: false },
  { iconKey: "SiDotnet",          name: ".NET",           color: "text-purple-600", category: "Backend",    enabled: false },
  { iconKey: "SiPhoenixframework", name: "Phoenix",       color: "text-orange-500", category: "Backend",    enabled: false },
  { iconKey: "TbBrandDeno",       name: "Deno",           color: "text-gray-200",   category: "Backend",    enabled: false },
  { iconKey: "SiGraphql",         name: "GraphQL",        color: "text-pink-500",   category: "Backend",    enabled: true  },
  { iconKey: "SiPrisma",          name: "Prisma",         color: "text-sky-400",    category: "Backend",    enabled: false },
  { iconKey: "SiDrizzle",         name: "Drizzle",        color: "text-green-500",  category: "Backend",    enabled: false },
  { iconKey: "TbBrandSocketIo",   name: "Socket.io",      color: "text-gray-200",   category: "Backend",    enabled: false },
  { iconKey: "SiStripe",          name: "Stripe",         color: "text-violet-500", category: "Backend",    enabled: false },
  { iconKey: "SiTwilio",          name: "Twilio",         color: "text-red-500",    category: "Backend",    enabled: false },
  { iconKey: "SiSendgrid",        name: "SendGrid",       color: "text-sky-500",    category: "Backend",    enabled: false },
  { iconKey: "SiAuth0",           name: "Auth0",          color: "text-orange-500", category: "Backend",    enabled: false },

  // ── Mobile ───────────────────────────────────────────────────
  { iconKey: "FaReact",           name: "React Native",   color: "text-sky-500",    category: "Mobile",     enabled: true  },
  { iconKey: "SiExpo",            name: "Expo",           color: "text-gray-200",   category: "Mobile",     enabled: false },
  { iconKey: "SiFlutter",         name: "Flutter",        color: "text-sky-500",    category: "Mobile",     enabled: false },
  { iconKey: "SiElectron",        name: "Electron",       color: "text-sky-400",    category: "Mobile",     enabled: false },
  { iconKey: "SiTauri",           name: "Tauri",          color: "text-amber-500",  category: "Mobile",     enabled: false },
  { iconKey: "IoLogoAndroid",     name: "Android",        color: "text-green-500",  category: "Mobile",     enabled: false },
  { iconKey: "IoLogoApple",       name: "iOS",            color: "text-gray-200",   category: "Mobile",     enabled: false },

  // ── Database ─────────────────────────────────────────────────
  { iconKey: "SiMongodb",         name: "MongoDB",        color: "text-green-600",  category: "Database",   enabled: true  },
  { iconKey: "GrMysql",           name: "MySQL",          color: "text-blue-500",   category: "Database",   enabled: true  },
  { iconKey: "SiPostgresql",      name: "PostgreSQL",     color: "text-sky-600",    category: "Database",   enabled: false },
  { iconKey: "SiRedis",           name: "Redis",          color: "text-red-500",    category: "Database",   enabled: false },
  { iconKey: "IoLogoFirebase",    name: "Firebase",       color: "text-amber-500",  category: "Database",   enabled: true  },
  { iconKey: "SiSupabase",        name: "Supabase",       color: "text-green-500",  category: "Database",   enabled: false },
  { iconKey: "SiPlanetscale",     name: "PlanetScale",    color: "text-gray-200",   category: "Database",   enabled: false },
  { iconKey: "SiSqlite",          name: "SQLite",         color: "text-sky-500",    category: "Database",   enabled: false },
  { iconKey: "SiMariadb",         name: "MariaDB",        color: "text-amber-700",  category: "Database",   enabled: false },
  { iconKey: "SiCassandra",       name: "Cassandra",      color: "text-sky-400",    category: "Database",   enabled: false },
  { iconKey: "SiElasticsearch",   name: "Elasticsearch",  color: "text-yellow-500", category: "Database",   enabled: false },
  { iconKey: "SiNeo4J",           name: "Neo4j",          color: "text-sky-500",    category: "Database",   enabled: false },
  { iconKey: "SiInfluxdb",        name: "InfluxDB",       color: "text-violet-500", category: "Database",   enabled: false },

  // ── DevOps ───────────────────────────────────────────────────
  { iconKey: "FaGitAlt",          name: "Git",            color: "text-orange-600", category: "DevOps",     enabled: true  },
  { iconKey: "FaGithub",          name: "GitHub",         color: "text-gray-200",   category: "DevOps",     enabled: false },
  { iconKey: "FaGitlab",          name: "GitLab",         color: "text-orange-500", category: "DevOps",     enabled: false },
  { iconKey: "FaBitbucket",       name: "Bitbucket",      color: "text-blue-500",   category: "DevOps",     enabled: false },
  { iconKey: "IoLogoDocker",      name: "Docker",         color: "text-sky-500",    category: "DevOps",     enabled: false },
  { iconKey: "SiKubernetes",      name: "Kubernetes",     color: "text-sky-500",    category: "DevOps",     enabled: false },
  { iconKey: "SiTerraform",       name: "Terraform",      color: "text-violet-500", category: "DevOps",     enabled: false },
  { iconKey: "SiAnsible",         name: "Ansible",        color: "text-red-500",    category: "DevOps",     enabled: false },
  { iconKey: "SiJenkins",         name: "Jenkins",        color: "text-red-400",    category: "DevOps",     enabled: false },
  { iconKey: "SiGithubactions",   name: "GH Actions",     color: "text-sky-500",    category: "DevOps",     enabled: false },
  { iconKey: "SiCircleci",        name: "CircleCI",       color: "text-gray-200",   category: "DevOps",     enabled: false },
  { iconKey: "SiNginx",           name: "Nginx",          color: "text-green-600",  category: "DevOps",     enabled: false },
  { iconKey: "SiWebpack",         name: "Webpack",        color: "text-sky-400",    category: "DevOps",     enabled: false },
  { iconKey: "SiVite",            name: "Vite",           color: "text-violet-500", category: "DevOps",     enabled: false },
  { iconKey: "SiTurbo",           name: "Turborepo",      color: "text-red-500",    category: "DevOps",     enabled: false },
  { iconKey: "SiBun",             name: "Bun",            color: "text-amber-500",  category: "DevOps",     enabled: false },
  { iconKey: "FaNpm",             name: "npm",            color: "text-red-500",    category: "DevOps",     enabled: false },
  { iconKey: "SiPnpm",            name: "pnpm",           color: "text-amber-500",  category: "DevOps",     enabled: false },
  { iconKey: "SiYarn",            name: "Yarn",           color: "text-sky-500",    category: "DevOps",     enabled: false },
  { iconKey: "SiEslint",          name: "ESLint",         color: "text-indigo-500", category: "DevOps",     enabled: false },
  { iconKey: "SiPrettier",        name: "Prettier",       color: "text-gray-400",   category: "DevOps",     enabled: false },
  { iconKey: "SiSentry",          name: "Sentry",         color: "text-violet-500", category: "DevOps",     enabled: false },
  { iconKey: "SiGrafana",         name: "Grafana",        category: "DevOps",       color: "text-orange-500", enabled: false },
  { iconKey: "SiPrometheus",      name: "Prometheus",     color: "text-orange-600", category: "DevOps",     enabled: false },

  // ── Cloud ────────────────────────────────────────────────────
  { iconKey: "FaAws",             name: "AWS",            color: "text-amber-500",  category: "Cloud",      enabled: false },
  { iconKey: "SiMicrosoftazure",  name: "Azure",          color: "text-sky-500",    category: "Cloud",      enabled: false },
  { iconKey: "SiGooglecloud",     name: "GCP",            color: "text-sky-400",    category: "Cloud",      enabled: false },
  { iconKey: "SiVercel",          name: "Vercel",         color: "text-gray-200",   category: "Cloud",      enabled: false },
  { iconKey: "SiNetlify",         name: "Netlify",        color: "text-teal-500",   category: "Cloud",      enabled: false },
  { iconKey: "SiCloudflare",      name: "Cloudflare",     color: "text-orange-500", category: "Cloud",      enabled: false },
  { iconKey: "SiDigitalocean",    name: "DigitalOcean",   color: "text-sky-500",    category: "Cloud",      enabled: false },
  { iconKey: "SiHeroku",          name: "Heroku",         color: "text-violet-500", category: "Cloud",      enabled: false },
  { iconKey: "SiRailway",         name: "Railway",        color: "text-gray-200",   category: "Cloud",      enabled: false },
  { iconKey: "SiAwsamplify",      name: "Amplify",        color: "text-amber-500",  category: "Cloud",      enabled: false },

  // ── AI / ML ──────────────────────────────────────────────────
  { iconKey: "SiOpenai",          name: "OpenAI",         color: "text-gray-200",   category: "AI/ML",      enabled: false },
  { iconKey: "SiHuggingface",     name: "HuggingFace",    color: "text-amber-400",  category: "AI/ML",      enabled: false },
  { iconKey: "SiLangchain",       name: "LangChain",      color: "text-green-500",  category: "AI/ML",      enabled: false },
  { iconKey: "SiTensorflow",      name: "TensorFlow",     color: "text-orange-500", category: "AI/ML",      enabled: false },
  { iconKey: "SiPytorch",         name: "PyTorch",        color: "text-orange-600", category: "AI/ML",      enabled: false },
  { iconKey: "SiPandas",          name: "Pandas",         color: "text-sky-600",    category: "AI/ML",      enabled: false },
  { iconKey: "SiNumpy",           name: "NumPy",          color: "text-sky-500",    category: "AI/ML",      enabled: false },
  { iconKey: "SiScikitlearn",     name: "Scikit-learn",   color: "text-orange-400", category: "AI/ML",      enabled: false },
  { iconKey: "SiOpencv",          name: "OpenCV",         color: "text-green-600",  category: "AI/ML",      enabled: false },

  // ── Testing ──────────────────────────────────────────────────
  { iconKey: "SiJest",            name: "Jest",           color: "text-red-600",    category: "Testing",    enabled: false },
  { iconKey: "SiVitest",          name: "Vitest",         color: "text-green-500",  category: "Testing",    enabled: false },
  { iconKey: "SiCypress",         name: "Cypress",        color: "text-gray-200",   category: "Testing",    enabled: false },
  { iconKey: "SiPlaywright",      name: "Playwright",     color: "text-green-600",  category: "Testing",    enabled: false },

  // ── CMS ──────────────────────────────────────────────────────
  { iconKey: "SiWordpress",       name: "WordPress",      color: "text-sky-600",    category: "CMS",        enabled: false },
  { iconKey: "SiShopify",         name: "Shopify",        category: "CMS",          color: "text-green-600", enabled: false },
  { iconKey: "SiWebflow",         name: "Webflow",        color: "text-sky-500",    category: "CMS",        enabled: false },
  { iconKey: "SiStrapi",          name: "Strapi",         color: "text-indigo-500", category: "CMS",        enabled: false },
  { iconKey: "SiSanity",          name: "Sanity",         color: "text-red-500",    category: "CMS",        enabled: false },
  { iconKey: "SiContentful",      name: "Contentful",     color: "text-sky-400",    category: "CMS",        enabled: false },

  // ── Design ───────────────────────────────────────────────────
  { iconKey: "SiFigma",           name: "Figma",          color: "text-pink-500",   category: "Design",     enabled: false },
  { iconKey: "SiAdobexd",         name: "Adobe XD",       color: "text-pink-600",   category: "Design",     enabled: false },
  { iconKey: "SiSketch",          name: "Sketch",         color: "text-amber-500",  category: "Design",     enabled: false },
  { iconKey: "SiInvision",        name: "InVision",       color: "text-pink-500",   category: "Design",     enabled: false },

  // ── Tool ─────────────────────────────────────────────────────
  { iconKey: "SiPostman",         name: "Postman",        color: "text-orange-500", category: "Tool",       enabled: false },
  { iconKey: "SiInsomnia",        name: "Insomnia",       color: "text-violet-500", category: "Tool",       enabled: false },
  { iconKey: "SiNotion",          name: "Notion",         color: "text-gray-200",   category: "Tool",       enabled: false },
  { iconKey: "SiJira",            name: "Jira",           color: "text-sky-500",    category: "Tool",       enabled: false },
  { iconKey: "SiAsana",           name: "Asana",          color: "text-red-500",    category: "Tool",       enabled: false },
  { iconKey: "SiSlack",           name: "Slack",          color: "text-violet-500", category: "Tool",       enabled: false },
  { iconKey: "SiObsidian",        name: "Obsidian",       color: "text-violet-600", category: "Tool",       enabled: false },

  // ── OS ───────────────────────────────────────────────────────
  { iconKey: "FaUbuntu",          name: "Ubuntu",         color: "text-orange-500", category: "OS",         enabled: true  },
  { iconKey: "SiDebian",          name: "Debian",         color: "text-red-500",    category: "OS",         enabled: false },
  { iconKey: "SiArchlinux",       name: "Arch Linux",     color: "text-sky-400",    category: "OS",         enabled: false },
  { iconKey: "SiAlpinelinux",     name: "Alpine",         color: "text-sky-500",    category: "OS",         enabled: false },
  { iconKey: "IoLogoLinux",       name: "Linux",          color: "text-amber-400",  category: "OS",         enabled: false },
  { iconKey: "IoLogoApple",       name: "macOS",          color: "text-gray-400",   category: "OS",         enabled: false },

  // ── Blockchain ───────────────────────────────────────────────
  { iconKey: "SiEthereum",        name: "Ethereum",       color: "text-indigo-400", category: "Blockchain", enabled: false },
  { iconKey: "SiIpfs",            name: "IPFS",           color: "text-sky-500",    category: "Blockchain", enabled: false },
];