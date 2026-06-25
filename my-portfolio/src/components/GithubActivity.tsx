import React, { Suspense } from "react";
import Image from "next/image";
import { getGithubProfile, getGithubContributions } from "../lib/github";
import { ArrowUpRight, Github } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";

function getIntensityClass(count: number) {
  if (count === 0) return "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50";
  if (count <= 3) return "bg-zinc-300 dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-600/50";
  if (count <= 6) return "bg-zinc-500 dark:bg-zinc-500 border border-zinc-600 dark:border-zinc-400/50";
  return "bg-black dark:bg-white border border-black dark:border-white";
}

function GithubActivitySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 md:gap-8 animate-pulse">
      <Card className="rounded-2xl border-border/80 bg-card shadow-sm h-[350px]">
        <CardContent className="p-6 md:p-8 flex flex-col h-full gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-col gap-2">
              <div className="w-32 h-5 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-24 h-4 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          <div className="w-full h-12 rounded-md bg-zinc-200 dark:bg-zinc-800 mt-2" />
          <div className="grid grid-cols-3 gap-4 border-y border-border py-4 mt-auto">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-border/80 bg-card shadow-sm h-[350px]">
        <CardContent className="p-6 md:p-8 flex flex-col h-full justify-between gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="w-40 h-6 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-48 h-4 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="w-full h-40 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}

async function GithubContent() {
  const [profile, contributions] = await Promise.all([
    getGithubProfile(),
    getGithubContributions()
  ]);

  if (!profile || !contributions) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
        <Github className="h-8 w-8 opacity-50" />
        <p>Unable to load GitHub activity at the moment.</p>
      </div>
    );
  }

  // Extract month labels based on the first day of each month
  const months: { label: string; colIndex: number }[] = [];
  contributions.weeks.forEach((week, index) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const date = new Date(firstDay.date);
      // Only push if it's roughly the first week of the month, or we haven't tracked this month recently
      if (date.getDate() <= 7) {
        const monthLabel = date.toLocaleString("default", { month: "short" });
        if (!months.length || months[months.length - 1].label !== monthLabel) {
          months.push({ label: monthLabel, colIndex: index });
        }
      }
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 md:gap-8">
      {/* Profile Card */}
      <Card className="rounded-2xl border-border/80 bg-card shadow-sm overflow-hidden flex flex-col">
        <CardContent className="p-6 md:p-8 flex flex-col h-full gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border">
              <Image
                src={profile.avatar_url}
                alt={`${profile.login} avatar`}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">@{profile.login}</p>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="grid grid-cols-3 gap-4 border-y border-border py-4 mt-auto">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-foreground">{profile.public_repos}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Repos</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-foreground">{profile.followers}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-foreground">{profile.following}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Following</span>
            </div>
          </div>

          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground text-background px-4 py-3 text-sm font-medium transition-transform hover:scale-[1.02]"
          >
            View Profile
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </CardContent>
      </Card>

      {/* Heatmap Card */}
      <Card className="rounded-2xl border-border/80 bg-card shadow-sm overflow-hidden flex flex-col">
          <CardContent className="p-6 md:p-8 flex flex-col h-full justify-between gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Contributions</h3>
                <p className="text-sm text-muted-foreground">
                  {contributions.totalContributions} contributions in the last year
                </p>
              </div>
              <Github className="w-6 h-6 text-muted-foreground opacity-50" />
            </div>

            <div className="w-full overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 md:mx-0 md:px-0">
              <div className="min-w-[700px] flex flex-col gap-2">
                {/* Months Header */}
                <div className="flex text-[10px] text-muted-foreground/70 uppercase tracking-widest relative h-4">
                  {months.map((month, i) => (
                    <div 
                      key={i} 
                      className="absolute"
                      style={{ left: `calc(${month.colIndex} * (10px + 4px))` }} // 10px width + 4px gap
                    >
                      {month.label}
                    </div>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div className="flex gap-1">
                  {contributions.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.contributionDays.map((day, dayIndex) => {
                        const date = new Date(day.date);
                        const formattedDate = date.toLocaleDateString(undefined, { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        });
                        
                        return (
                          <div
                            key={dayIndex}
                            className={`w-2.5 h-2.5 rounded-[2px] transition-colors hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 hover:ring-offset-background ${getIntensityClass(day.contributionCount)}`}
                            title={`${day.contributionCount} contributions on ${formattedDate}`}
                            aria-label={`${day.contributionCount} contributions on ${formattedDate}`}
                            role="tooltip"
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-300 dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-600/50" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-500 dark:bg-zinc-500 border border-zinc-600 dark:border-zinc-400/50" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-black dark:bg-white border border-black dark:border-white" />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}

export default function GithubActivity() {
  return (
    <section className="relative border-t border-border bg-background px-4 py-16 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col mb-12">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
            GitHub Activity
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            A snapshot of my coding activity and consistency.
          </p>
        </div>

        <Suspense fallback={<GithubActivitySkeleton />}>
          <GithubContent />
        </Suspense>
      </div>
    </section>
  );
}
