import Details from "@/components/common/Details";
import { fetchDetails, fetchDetailsTMDB } from "@/lib/utils";
import React from "react";

export default async function TVDetails({
  params,
}: {
  params: { tv: string };
}) {
  const tmdb = await fetchDetailsTMDB(params.tv, "tv");

  return (
    <div>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <Details data={tmdb} type={"tv"} />
    </div>
  );
}
