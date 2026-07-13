export interface GithubProfile {
  avatar_url: string;
  name: string;
  login: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export async function getGithubProfile(): Promise<GithubProfile | null> {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    console.warn("GITHUB_USERNAME is not set.");
    return null;
  }

  try {
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch GitHub profile: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return {
      avatar_url: data.avatar_url,
      name: data.name || data.login,
      login: data.login,
      bio: data.bio || "",
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      html_url: data.html_url,
    };
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    return null;
  }
}

export interface GithubContributions {
  totalContributions: number;
  weeks: {
    contributionDays: {
      contributionCount: number;
      date: string;
    }[];
  }[];
}

export async function getGithubContributions(): Promise<GithubContributions | null> {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    console.warn("GITHUB_USERNAME or GITHUB_TOKEN is not set.");
    return null;
  }

  // Keep the calendar anchored to the current day while retaining an hourly
  // cache bucket so each page request does not consume GitHub API quota.
  const contributionWindowEnd = new Date();
  contributionWindowEnd.setUTCMinutes(0, 0, 0);

  const query = `
    query($username: String!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          to: contributionWindowEnd.toISOString(),
        },
      }),
      next: { revalidate: 3600 }, // Refresh the current contribution day hourly
    });

    if (!response.ok) {
      console.error(`Failed to fetch GitHub contributions: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    if (json.errors) {
      console.error("GraphQL errors:", json.errors);
      return null;
    }

    return json.data.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return null;
  }
}
