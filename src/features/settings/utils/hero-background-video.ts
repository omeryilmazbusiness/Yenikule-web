const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const DIRECT_VIDEO_PATTERN = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export type HeroBackgroundVideoSource =
  | { kind: "youtube"; videoId: string }
  | { kind: "file"; src: string };

export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (YOUTUBE_VIDEO_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && YOUTUBE_VIDEO_ID_PATTERN.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com" || host.endsWith(".youtube.com")) {
    const fromQuery = url.searchParams.get("v");
    if (fromQuery && YOUTUBE_VIDEO_ID_PATTERN.test(fromQuery)) {
      return fromQuery;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const markerIndex = segments.findIndex((segment) =>
      ["embed", "shorts", "live", "v"].includes(segment),
    );

    if (markerIndex >= 0) {
      const id = segments[markerIndex + 1]?.split("?")[0];
      if (id && YOUTUBE_VIDEO_ID_PATTERN.test(id)) {
        return id;
      }
    }
  }

  return null;
}

export function isDirectVideoUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  if (DIRECT_VIDEO_PATTERN.test(trimmed)) {
    return true;
  }

  if (trimmed.startsWith("/") && DIRECT_VIDEO_PATTERN.test(trimmed)) {
    return true;
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return DIRECT_VIDEO_PATTERN.test(url.pathname);
  } catch {
    return false;
  }
}

export function resolveHeroBackgroundVideo(
  input: string,
): HeroBackgroundVideoSource | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const youtubeId = extractYouTubeVideoId(trimmed);
  if (youtubeId) {
    return { kind: "youtube", videoId: youtubeId };
  }

  if (isDirectVideoUrl(trimmed)) {
    return { kind: "file", src: trimmed };
  }

  return null;
}

export function buildYouTubeEmbedUrl(
  videoId: string,
  origin = "https://localhost",
): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    showinfo: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    cc_load_policy: "0",
    origin,
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function isValidHeroBackgroundVideoUrl(input: string): boolean {
  return resolveHeroBackgroundVideo(input) !== null;
}
