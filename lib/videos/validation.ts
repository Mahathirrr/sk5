type VideoProvider = "youtube" | "drive";

interface VideoMetadata {
  provider: VideoProvider;
  videoId: string;
  title?: string;
  duration?: number;
}

export function parseVideoUrl(url: string): VideoMetadata | null {
  try {
    const urlObj = new URL(url);

    // YouTube
    if (
      urlObj.hostname.includes("youtube.com") ||
      urlObj.hostname.includes("youtu.be")
    ) {
      let videoId = "";

      if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get("v") || "";
      }

      if (!videoId) return null;

      return {
        provider: "youtube",
        videoId,
      };
    }

    // Google Drive
    if (urlObj.hostname.includes("drive.google.com")) {
      const id = urlObj.pathname.includes("d/")
        ? urlObj.pathname.split("/d/")[1].split("/")[0]
        : urlObj.searchParams.get("id");

      if (!id) return null;

      return {
        provider: "drive",
        videoId: id,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function getEmbedUrl(metadata: VideoMetadata): string {
  switch (metadata.provider) {
    case "youtube":
      return `https://www.youtube.com/embed/${metadata.videoId}`;
    case "drive":
      return `https://drive.google.com/file/d/${metadata.videoId}/preview`;
    default:
      throw new Error("Unsupported video provider");
  }
}

