import { searchTracks } from "@/services/spotify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return Response.json([]);
  }

  try {
    const tracks = await searchTracks(query);
    return Response.json(tracks);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Unable to search songs right now. Please try again." },
      { status: 502 },
    );
  }
}
