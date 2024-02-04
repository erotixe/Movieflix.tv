import React, { Suspense } from "react";
import RowComponent from "./Row";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRowData } from "@/lib/utils";
import { FetchAndRenderRow } from "./FetchAndRenderRow";
import Row from "./Row";
import WatchList from "../common/WatchList";

export default async function RowContainer() {
  const trendingMovies = FetchAndRenderRow(
    "trending/movie/week",
    "Top Movies",
    false,
    "movie"
  );
  const trendingTVShows = FetchAndRenderRow(
    "trending/tv/week",
    "Top TV Shows",
    false,
    "tv"
  );
  const topRatedMovies = FetchAndRenderRow(
    "movie/top_rated",
    "Top Rated Movies",
    true,
    "movie"
  );
  const topRatedTVShows = FetchAndRenderRow(
    "tv/top_rated",
    "Top Rated TV Shows",
    true,
    "tv"
  );

  return (
    <div className="flex flex-col gap-[2rem]">
      <WatchList />
      {topRatedMovies}
      {trendingTVShows}
      {topRatedTVShows}
      {trendingMovies}
    </div>
  );
}