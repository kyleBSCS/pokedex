import { NextResponse, NextRequest } from "next/server";
import { SortByType } from "@/types/responses";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const limit = searchParams.get("limit") ?? "30";
  const offset = searchParams.get("offset") ?? "0";
  const search = searchParams.get("search") ?? undefined;
  const typesParam = searchParams.get("types");
  const sort = (searchParams.get("sort") as SortByType) ?? "id_asc";

  // Parse types string into array
  const types = typesParam
    ? typesParam
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : undefined;

  try {
    const apiUrl = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(apiUrl);

    // Check if it returns an erraor
    if (!response.ok) {
      console.error(`PokeAPI Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        {
          message: `Failed to fetch from PokeAPI: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(`Error fetching Pokemon list`, e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
