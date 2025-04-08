import { NextResponse, NextRequest } from "next/server";
import { getPokemon } from "@/app/services/pokemon.service";
import { SortByType } from "@/types/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const limit = parseInt(searchParams.get("limit") ?? "30");
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const search = searchParams.get("search") ?? undefined;
  const typesParam = searchParams.get("types"); // Comma-separated
  const sort = (searchParams.get("sort") as SortByType) ?? "id_asc";

  if (isNaN(limit) || limit <= 0) {
    return NextResponse.json(
      { message: "Invalid 'limit' parameter." },
      { status: 400 }
    );
  }
  if (isNaN(offset) || offset < 0) {
    return NextResponse.json(
      { message: "Invalid 'offset' parameter." },
      { status: 400 }
    );
  }

  // Parse types string into array
  const types = typesParam
    ? typesParam
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : undefined;

  try {
    const results = await getPokemon({
      limit,
      offset,
      search,
      types,
      sort,
    });

    const responseData = {
      count: results.totalCount,
      next:
        offset + limit < results.totalCount
          ? `/api/pokemon?limit=${limit}&offset=${offset + limit}${
              search ? `&search=${search}` : ""
            }${typesParam ? `&types=${typesParam}` : ""}&sort=${sort}`
          : null,
      previous:
        offset > 0
          ? `/api/pokemon?limit=${limit}&offset=${Math.max(0, offset - limit)}${
              search ? `&search=${search}` : ""
            }${typesParam ? `&types=${typesParam}` : ""}&sort=${sort}`
          : null,
      results: results.pokemon,
    };

    return NextResponse.json(responseData);
  } catch (e: any) {
    console.error(`Error in /api/pokemon route:`, e);
    return NextResponse.json(
      { message: e.message || "Internal Server Error fetching Pokemon list" },
      { status: 500 }
    );
  }
}
