import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-32 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        О проекте
      </h1>
      <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Эта страница находится по пути{" "}
        <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
          src/app/about/page.tsx
        </code>{" "}
        и появилась в роутинге автоматически благодаря файловой структуре
        Next.js App Router.
      </p>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        На главную
      </Link>
    </div>
  );
}
