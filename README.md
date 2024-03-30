## What is OnyxOne?

- OnyxOne is Onyx augmented with a scalable DApp configuration powered by a TanStack React Query and Wagmi SSR driven web3Modal integration that provides access to over 380 different web 3.0 wallets across all Ethereum virtual machine (EVM) interoperable blockchains. 
- OnyxOne is also a full stack web app written in Typescript that includes role based access control (RBAC),complete Supabase SSR Auth and Postgresql db integration, Zod and YUP! data validation, React Hook form, Shadcn-UI, TailwindCSS and more. Fork, customize, and deploy on Vercel or elsewhere to have your MVP up and running in a few days or less. Stack details are 
below. 

## Stack 
- NextJS 14 App Router
- Supabase 
  - SSR Auth with middleware and server actions
  - Postgres DB 
  - TanStack React Query Provider 
  - Configured cookies and storage
  - Admin dashboard with RBAC
- Shadcn UI 
- React hook form 
- Tailwind CSS 
- YUP! & Zod validation 
- Lucide React

## API 
- TODO

## Getting started with OnyxOne:
- First, configure your environment
  - Create a file named .env.local in project root
  - Create a Supabase account and add the following to your env file
    - NEXT_PUBLIC_SUPABASE_KEY="Your supabase anon key"
    - SUPABASE_JWT_SECRET="Your supabase JWT secret"
    - NEXT_PUBLIC_SUPABASE_URL="Your supabase project URL"
    - SUPABASE_SERVIC_ROLE_KEY="Your supabase service role key"
  - Ensure your Supabase tables match the tables and types found in '@/lib/supabase'.
  - Add authorized development and production URL's to Supabase URL config. 
## Run  
- Development server:

```bash
npm i && npm run dev
# or
yarn i && yarn run dev
# or
pnpm i && pnpm dev
# or
bun i && bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Reference/Credit
- @chensokheng 

## Tips/Support
<a href="https://www.buymeacoffee.com/rmoureyjr" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="51" width="217"></a>
