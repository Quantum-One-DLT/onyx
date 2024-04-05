## What is OnyxOne?
Indent mode

Spaces
Indent size

2
Line wrap mode

Soft wrap
Editing README.md file contents
Selection deleted
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56


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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fquantum-one-dlt%2Fonyx-one%2Ftree%2Fquantumone)

## Reference/Credit
- @chensokheng 
