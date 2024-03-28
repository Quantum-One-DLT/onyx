export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Onyx",
  description:
    "Embedded systems",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    { 
      title: "Dashboard",
      href: "/dashboard",
    },
    
    { 
      title: "OpenAI",
      href: "/playground",
    },
  ],
  links: {
    twitter: "https://twitter.com/r_mourey_jr",
    github: "https://github.com/rmourey26/onyx",
    login: "https://onyx-one-two.vercel.app/auth",
    signup: "https://onyx-one-two.vercel.app/auth-server-action",
  },
}