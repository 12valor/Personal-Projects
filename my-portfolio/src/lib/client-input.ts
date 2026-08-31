export interface ClientInput {
  name: string;
  logo_url: string;
  website_url: string | null;
  display_index: number;
  is_visible: boolean;
}

export function parseClientInput(value: unknown): ClientInput {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid client payload");
  }

  const body = value as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const logoUrl = typeof body.logo_url === "string" ? body.logo_url.trim() : "";
  const websiteUrl =
    typeof body.website_url === "string" ? body.website_url.trim() : "";
  const displayIndex = Number(body.display_index ?? 0);

  if (!name || name.length > 120) {
    throw new Error("Client name must be between 1 and 120 characters");
  }

  if (!logoUrl || logoUrl.length > 2048) {
    throw new Error("A valid client logo is required");
  }

  if (!Number.isInteger(displayIndex) || displayIndex < 0 || displayIndex > 10_000) {
    throw new Error("Display index must be a whole number between 0 and 10000");
  }

  if (websiteUrl) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(websiteUrl);
    } catch {
      throw new Error("Website URL must be a valid URL");
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error("Website URL must use http or https");
    }
  }

  return {
    name,
    logo_url: logoUrl,
    website_url: websiteUrl || null,
    display_index: displayIndex,
    is_visible: body.is_visible !== false,
  };
}
