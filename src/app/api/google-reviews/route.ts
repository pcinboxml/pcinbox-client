export async function GET() {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.NEXT_PUBLIC_PLACE_ID_GOOGLE_REVIEWS}&fields=name,rating,reviews&key=${process.env.NEXT_PUBLIC_API_KEY_GOOGLE_REVIEWS}&language=es`,
    );

    if (!res.ok) {
      return Response.json(
        { error: "Error fetching Google Places API" },
        { status: res.status },
      );
    }

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
