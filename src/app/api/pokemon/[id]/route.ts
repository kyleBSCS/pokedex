import { getPokemonDetailsById } from "@/app/services/pokemon.service";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      {
        message: "Pokemon ID or name is required",
      },
      { status: 400 }
    );
  }

  try {
    const detailedData = await getPokemonDetailsById(id);

    if (!detailedData) {
      return NextResponse.json(
        { message: `Pokemon with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(detailedData);
  } catch (e: any) {
    console.error(`Error in api/pokemon/${id} route:`, e);
    return NextResponse.json(
      {
        message:
          e.message ||
          `Internal Server Error fetching details for Pokemon ${id}`,
      },
      { status: 500 }
    );
  }
}
