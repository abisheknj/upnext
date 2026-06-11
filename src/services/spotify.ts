const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const SPOTIFY_SEARCH_LIMIT = "10";
const MIN_SEARCH_QUERY_LENGTH = 2;
const TOKEN_EXPIRY_BUFFER_MS = 60_000;

export type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string | null;
};

type SpotifyTokenResponse = {
  access_token?: unknown;
  expires_in?: unknown;
};

type CachedSpotifyToken = {
  token: string;
  expiresAt: number;
};

type SpotifyImage = {
  url?: unknown;
  width?: unknown;
};

type SpotifyArtist = {
  name?: unknown;
};

type SpotifyTrackItem = {
  id: string;
  name: string;
  artists?: unknown;
  album?: {
    images?: unknown;
  };
};

type SpotifySearchResponse = {
  tracks?: {
    items?: unknown;
  };
};

let cachedToken: CachedSpotifyToken | null = null;
let pendingTokenRequest: Promise<CachedSpotifyToken> | null = null;

function getSpotifyCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials.");
  }

  return { clientId, clientSecret };
}

function getBasicAuthHeader(clientId: string, clientSecret: string): string {
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

function isTokenValid(
  token: CachedSpotifyToken | null,
): token is CachedSpotifyToken {
  return !!token && token.expiresAt > Date.now();
}

async function requestSpotifyAccessToken(): Promise<CachedSpotifyToken> {
  const { clientId, clientSecret } = getSpotifyCredentials();

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${getBasicAuthHeader(clientId, clientSecret)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not authenticate with Spotify.");
  }

  const data = (await response.json()) as SpotifyTokenResponse;
  const expiresIn =
    typeof data.expires_in === "number" && data.expires_in > 0
      ? data.expires_in
      : 3600;

  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new Error("Spotify did not return an access token.");
  }

  return {
    token: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000 - TOKEN_EXPIRY_BUFFER_MS,
  };
}

async function getCachedSpotifyToken(
  forceRefresh = false,
): Promise<CachedSpotifyToken> {
  if (!forceRefresh && isTokenValid(cachedToken)) {
    return cachedToken;
  }

  if (!forceRefresh && pendingTokenRequest) {
    return pendingTokenRequest;
  }

  pendingTokenRequest = requestSpotifyAccessToken();

  try {
    cachedToken = await pendingTokenRequest;
    return cachedToken;
  } finally {
    pendingTokenRequest = null;
  }
}

export async function getSpotifyAccessToken(): Promise<string> {
  const token = await getCachedSpotifyToken();
  return token.token;
}

function clearCachedSpotifyToken(): void {
  cachedToken = null;
}

function isSpotifyTrackItem(item: unknown): item is SpotifyTrackItem {
  if (!item || typeof item !== "object") return false;

  const track = item as SpotifyTrackItem;
  return typeof track.id === "string" && typeof track.name === "string";
}

function getArtistName(artists: unknown): string {
  if (!Array.isArray(artists)) return "Unknown artist";

  const names = artists
    .map((artist: SpotifyArtist) =>
      typeof artist?.name === "string" ? artist.name : null,
    )
    .filter((name): name is string => !!name);

  return names.length > 0 ? names.join(", ") : "Unknown artist";
}

function getArtworkUrl(images: unknown): string | null {
  if (!Array.isArray(images)) return null;

  const validImages = images.filter(
    (image: SpotifyImage): image is { url: string; width?: number } =>
      typeof image?.url === "string" &&
      (typeof image.width === "number" || image.width === undefined),
  );

  const smallestImage = validImages.sort(
    (a, b) =>
      (a.width ?? Number.MAX_SAFE_INTEGER) -
      (b.width ?? Number.MAX_SAFE_INTEGER),
  )[0];

  return smallestImage?.url ?? null;
}

async function fetchSpotifySearch(
  query: string,
  token: string,
): Promise<Response> {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: SPOTIFY_SEARCH_LIMIT,
  });

  return fetch(`${SPOTIFY_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

function mapSpotifySearchResponse(data: SpotifySearchResponse): SpotifyTrack[] {
  if (!Array.isArray(data.tracks?.items)) {
    throw new Error("Spotify returned an unexpected search response.");
  }

  return data.tracks.items.filter(isSpotifyTrackItem).map((track) => ({
    id: track.id,
    title: track.name,
    artist: getArtistName(track.artists),
    artworkUrl: getArtworkUrl(track.album?.images),
  }));
}

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
    return [];
  }

  const cachedAccessToken = await getCachedSpotifyToken();
  let response = await fetchSpotifySearch(
    trimmedQuery,
    cachedAccessToken.token,
  );

  if (response.status === 401) {
    clearCachedSpotifyToken();
    const refreshedAccessToken = await getCachedSpotifyToken(true);
    response = await fetchSpotifySearch(
      trimmedQuery,
      refreshedAccessToken.token,
    );
  }

  if (!response.ok) {
    throw new Error("Spotify search failed.");
  }

  const data = (await response.json()) as SpotifySearchResponse;
  return mapSpotifySearchResponse(data);
}
