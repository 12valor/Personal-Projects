import React, { Suspense } from "react";
import Image from "next/image";
import { getGithubProfile, getGithubContributions } from "../lib/github";
import { ArrowUpRight, Github } from "lucide-react";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "./ScrollReveal";

function getIntensityClass(count: number) {
  if (count === 0) return "bg-muted border-border/70";
  if (count <= 3) return "bg-zinc-300 border-zinc-300 dark:bg-zinc-700 dark:border-zinc-700";
  if (count <= 6) return "bg-zinc-400 border-zinc-400 dark:bg-zinc-500 dark:border-zinc-500";
  if (count < 50) return "bg-zinc-600 border-zinc-600 dark:bg-zinc-300 dark:border-zinc-300";
  return "bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white";
}

function GithubActivitySkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-4 lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,2fr)]">
      <div className="min-h-[268px] border border-border p-6 sm:p-7">
        <div className="flex items-center gap-4"><div className="size-14 rounded-full bg-muted" /><div className="space-y-2"><div className="h-5 w-32 bg-muted" /><div className="h-4 w-20 bg-muted" /></div></div>
        <div className="mt-6 h-9 w-4/5 bg-muted" /><div className="mt-6 h-12 border-t border-border bg-muted/40" />
      </div>
      <div className="min-h-[268px] border border-border p-6 sm:p-7"><div className="h-5 w-40 bg-muted" /><div className="mt-3 h-4 w-48 bg-muted" /><div className="mt-9 h-28 w-full bg-muted/40" /></div>
    </div>
  );
}

async function GithubContent() {
  const [profile, contributions] = await Promise.all([getGithubProfile(), getGithubContributions()]);

  if (!profile || !contributions) {
    return <div className="flex min-h-[268px] flex-col items-center justify-center gap-4 border border-dashed border-border text-muted-foreground"><Github className="h-7 w-7" /><p>Unable to load GitHub activity at the moment.</p></div>;
  }

  const months: { label: string; colIndex: number }[] = [];
  contributions.weeks.forEach((week, index) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const date = new Date(`${firstDay.date}T00:00:00Z`);
    if (date.getUTCDate() <= 7) {
      months.push({ label: date.toLocaleString("en", { month: "short", timeZone: "UTC" }), colIndex: index });
    }
  });

  return (
    <ScrollStagger className="grid gap-4 lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,2fr)]">
      <ScrollStaggerItem className="h-full">
        <div className="group flex h-full min-h-[268px] flex-col border border-border p-6 transition-colors duration-300 hover:border-foreground/40 sm:p-7">
          <div className="flex items-center gap-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-border">
              <Image src={profile.avatar_url} alt="" fill className="object-cover" sizes="56px" unoptimized />
            </div>
            <div className="min-w-0"><h3 className="text-lg font-semibold tracking-tight text-foreground">{profile.name}</h3><p className="text-sm text-muted-foreground">@{profile.login}</p></div>
          </div>
          {profile.bio && <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>}
          <div className="mt-auto pt-6">
            <dl className="grid grid-cols-3 gap-2 border-t border-border pt-4">
              {[['Repositories', profile.public_repos], ['Followers', profile.followers], ['Following', profile.following]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</dd></div>)}
            </dl>
            <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              View GitHub profile <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </ScrollStaggerItem>
      <ScrollStaggerItem className="min-w-0 h-full">
        <div className="flex h-full min-h-[268px] flex-col border border-border p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div><h3 className="text-lg font-semibold tracking-tight">Contribution activity</h3><p className="mt-1 text-sm text-muted-foreground"><strong className="font-semibold tabular-nums text-foreground">{contributions.totalContributions.toLocaleString("en-US")}</strong> contributions in the last year</p></div>
            <Github aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          </div>
          <div className="mt-7 min-w-0 overflow-x-auto pb-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" tabIndex={0} role="region" aria-label="Contribution calendar, scroll horizontally to see all dates">
            <div className="w-max min-w-full">
              <div className="relative h-5 text-[11px] text-muted-foreground" aria-hidden="true">{months.map((month) => <span key={`${month.label}-${month.colIndex}`} className="absolute" style={{ left: `${month.colIndex * 13}px` }}>{month.label}</span>)}</div>
              <div className="flex gap-[3px]">
                {contributions.weeks.map((week, weekIndex) => <div key={weekIndex} className="flex flex-col gap-[3px]" style={{ paddingTop: week.contributionDays[0] ? new Date(`${week.contributionDays[0].date}T00:00:00Z`).getUTCDay() * 13 : 0 }}>{week.contributionDays.map((day) => {
                  const date = new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
                  const label = `${day.contributionCount} ${day.contributionCount === 1 ? "contribution" : "contributions"} on ${date}`;
                  return <div key={day.date} role="img" aria-label={label} title={label} className={`size-2.5 rounded-[2px] border transition-colors hover:ring-2 hover:ring-foreground/50 hover:ring-offset-1 hover:ring-offset-background ${getIntensityClass(day.contributionCount)}`} />;
                })}</div>)}
              </div>
              <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-muted-foreground"><span>Less</span><div className="flex gap-[3px]" aria-hidden="true">{[0, 1, 4, 7, 50].map((count) => <span key={count} className={`size-2.5 rounded-[2px] border ${getIntensityClass(count)}`} />)}</div><span>More</span></div>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground lg:hidden">Scroll horizontally to explore the full year.</p>
        </div>
      </ScrollStaggerItem>
    </ScrollStagger>
  );
}

export default function GithubActivity() {
  return (
    <section className="relative border-t border-border bg-background px-4 py-16 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <ScrollReveal className="mb-10 flex flex-col md:mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">GitHub Activity</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">A snapshot of my coding activity and consistency.</p>
        </ScrollReveal>
        <Suspense fallback={<GithubActivitySkeleton />}><GithubContent /></Suspense>
      </div>
    </section>
  );
}
