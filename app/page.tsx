import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { readUserSession } from "@/utils/actions";
import { redirect } from "next/navigation";
import ConnectButton from "@/components/connect-button";

export default async function IndexPage() {
  const { data: userSession } = await readUserSession();

	if (userSession.session) {
		return redirect("/dashboard");
	}
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          DeFi ONE<br className="hidden sm:inline" />
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
        Learn how you can buy our token and help launch DeFi ONE.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.login}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Login
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.signup}
          className={buttonVariants({ variant: "outline" })}
        >
          Sign Up
        </Link>
	       <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.defione}
          className={buttonVariants({ variant: "outline" })}
        >
          
        </Link>
      </div>
    </section>
  )
}
