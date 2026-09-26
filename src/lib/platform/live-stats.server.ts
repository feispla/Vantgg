/**
 * Live stats from social platforms (Twitch, YouTube, Kick, TikTok).
 * Uses public APIs where available; falls back gracefully when API keys are missing.
 *
 * Env vars (optional, set via Vercel or .env):
 *   TWITCH_CLIENT_ID      - Twitch app client ID for API calls
 *   TWITCH_ACCESS_TOKEN   - Twitch app access token
 *   YOUTUBE_API_KEY       - YouTube Data API v3 key
 */
import { env } from "@/lib/env.server";

export type LiveStats = {
  twitch: {
    channel: string | null;
    followers: number | null;
    isLive: boolean;
    title: string | null;
    viewerCount: number | null;
    profileImageUrl: string | null;
  };
  youtube: {
    channel: string | null;
    subscribers: number | null;
    totalViews: number | null;
    videoCount: number | null;
  };
  kick: {
    channel: string | null;
    followers: number | null;
    isLive: boolean;
    viewerCount: number | null;
  };
  discord: {
    guildId: string | null;
    memberCount: number | null;
    onlineCount: number | null;
    inviteUrl: string | null;
  };
};

const TWITCH_HANDLE = "feispla";
const YOUTUBE_HANDLE = "@feispla";
const KICK_HANDLE = "feispla";
const DISCORD_GUILD_ID = env("DISCORD_GUILD_ID") ?? "1546641331927908472";
const DISCORD_INVITE = "https://discord.gg/5Ajb6w39Qy";

async function fetchTwitchStats(): Promise<LiveStats["twitch"]> {
  const clientId = env("TWITCH_CLIENT_ID");
  const accessToken = env("TWITCH_ACCESS_TOKEN");

  if (!clientId || !accessToken) {
    return {
      channel: TWITCH_HANDLE,
      followers: null,
      isLive: false,
      title: null,
      viewerCount: null,
      profileImageUrl: null,
    };
  }

  try {
    // Get user ID from login name
    const userRes = await fetch(
      `https://api.twitch.tv/helix/users?login=${TWITCH_HANDLE}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!userRes.ok) throw new Error("Twitch API error");
    const userData = await userRes.json();
    const userId = userData.data?.[0]?.id;
    if (!userId) throw new Error("Twitch user not found");

    const profileImageUrl = userData.data?.[0]?.profile_image_url ?? null;

    // Get followers
    const followRes = await fetch(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const followData = await followRes.json();
    const followers = followData.total ?? null;

    // Check if live
    const streamRes = await fetch(
      `https://api.twitch.tv/helix/streams?user_id=${userId}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const streamData = await streamRes.json();
    const stream = streamData.data?.[0];
    const isLive = Boolean(stream);
    const title = stream?.title ?? null;
    const viewerCount = stream?.viewer_count ?? null;

    return {
      channel: TWITCH_HANDLE,
      followers,
      isLive,
      title,
      viewerCount,
      profileImageUrl,
    };
  } catch {
    return {
      channel: TWITCH_HANDLE,
      followers: null,
      isLive: false,
      title: null,
      viewerCount: null,
      profileImageUrl: null,
    };
  }
}

async function fetchYouTubeStats(): Promise<LiveStats["youtube"]> {
  const apiKey = env("YOUTUBE_API_KEY");
  if (!apiKey) {
    return {
      channel: YOUTUBE_HANDLE,
      subscribers: null,
      totalViews: null,
      videoCount: null,
    };
  }

  try {
    // Search for channel by handle
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&forHandle=${YOUTUBE_HANDLE}&key=${apiKey}`,
    );
    if (!searchRes.ok) throw new Error("YouTube API error");
    const data = await searchRes.json();
    const channel = data.items?.[0];
    if (!channel) throw new Error("YouTube channel not found");

    const stats = channel.statistics ?? {};
    return {
      channel: YOUTUBE_HANDLE,
      subscribers: Number(stats.subscriberCount) || null,
      totalViews: Number(stats.viewCount) || null,
      videoCount: Number(stats.videoCount) || null,
    };
  } catch {
    return {
      channel: YOUTUBE_HANDLE,
      subscribers: null,
      totalViews: null,
      videoCount: null,
    };
  }
}

async function fetchKickStats(): Promise<LiveStats["kick"]> {
  try {
    // Kick has an unofficial public API
    const res = await fetch(`https://kick.com/api/v2/channels/${KICK_HANDLE}`);
    if (!res.ok) throw new Error("Kick API error");
    const data = await res.json();
    return {
      channel: KICK_HANDLE,
      followers: data.followers_count ?? null,
      isLive: Boolean(data.livestream?.is_live),
      viewerCount: data.livestream?.viewer_count ?? null,
    };
  } catch {
    return {
      channel: KICK_HANDLE,
      followers: null,
      isLive: false,
      viewerCount: null,
    };
  }
}

async function fetchDiscordStats(): Promise<LiveStats["discord"]> {
  const botToken = env("DISCORD_BOT_TOKEN");
  const guildId = DISCORD_GUILD_ID;

  if (!botToken) {
    return {
      guildId,
      memberCount: null,
      onlineCount: null,
      inviteUrl: DISCORD_INVITE,
    };
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
      {
        headers: { Authorization: `Bot ${botToken}` },
      },
    );
    if (!res.ok) throw new Error("Discord API error");
    const data = await res.json();
    return {
      guildId,
      memberCount: data.approximate_member_count ?? null,
      onlineCount: data.approximate_presence_count ?? null,
      inviteUrl: DISCORD_INVITE,
    };
  } catch {
    return {
      guildId,
      memberCount: null,
      onlineCount: null,
      inviteUrl: DISCORD_INVITE,
    };
  }
}

export async function getLiveStats(): Promise<LiveStats> {
  const [twitch, youtube, kick, discord] = await Promise.all([
    fetchTwitchStats(),
    fetchYouTubeStats(),
    fetchKickStats(),
    fetchDiscordStats(),
  ]);
  return { twitch, youtube, kick, discord };
}
