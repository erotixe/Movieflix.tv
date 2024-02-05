"use client";
import React, { useEffect, useState } from "react";
import OPlayer from "../common/Player";
import { fetchMovieLinks, fetchVidSrc, fetchsusflixLinks } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { RotateCw } from "lucide-react";
import { Toggle } from "../ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EpisodeProps {
  episodeId: string;
  id: string;
  movieID?: any;
  type: string;
  episodeNumber?: any;
  seasonNumber?: any;
}

interface EpisodeData {
  sources: { src: string; name: string }[];
  subtitles: { lang: string; url: string }[];
}

export default function Episode(props: EpisodeProps) {
  const { episodeId, id, movieID, type, seasonNumber, episodeNumber } = props;
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [provider, setProvider] = useState("vidsrc");

  async function fetchVidSrcData() {
    setIsLoading(true);
    try {
      await fetchVidSrc(
        type,
        type === "movie" ? movieID : id,
        seasonNumber,
        episodeNumber,
        (err: any, res: any) => {
          console.log('err,res', err,res)
          if (err) {
            setProvider("consumet")
            fetchMovieLinks(episodeId, id, handleMovieLinksResponse);
          } else {
            handleVidSrcResponse(res);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching episode data:", error);
      setIsLoading(false);
    }
  }

  function fetchMovieLinksData() {
    setIsLoading(true);
    fetchMovieLinks(episodeId, id, handleMovieLinksResponse);
  }

  function handleVidSrcResponse(res: any) {
    const transformedData: EpisodeData = {
      sources: res.map((ep: any) => ({
        src: ep.data?.file,
        name: ep.name || "", // Adjust as per your actual data structure
      })),
      subtitles: res
        .flatMap((ep: any) =>
          ep.data?.sub?.map((sub: any) => ({
            lang: sub.lang,

            url: sub.file,
          }))
        )
        .filter(Boolean),
    };
    setEpisode(transformedData);

    setError(null);
    setIsLoading(false);
  }

  function handleMovieLinksResponse(err: any, res: any) {
    if (err) {
      setError("Error playing episode");
    } else {
      const transformedData: EpisodeData = {
        sources: res.sources.map((source: any) => ({
          src: source.url,
          name: source.quality || "", // Adjust as per your actual data structure
        })),
        subtitles: res.subtitles
          .map((sub: any) => ({ lang: sub.lang, url: sub.url }))
          .filter(Boolean),
      };
      setEpisode(transformedData);
      setError(null);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (provider === "vidsrc") {
      fetchVidSrcData();
    } else {
      fetchMovieLinksData();
    }
  }, [episodeId, id, provider, type, movieID, episodeNumber, seasonNumber]);
  if (isLoading) {
    return (
      <Skeleton className="aspect-video w-full lg:w-[600px]  mx-auto my-4" />
    );
  }

  if (error) {
    return (
      <>
        <div className="">
          <Select
            defaultValue={provider}
            onValueChange={(value) => setProvider(value)}
          >
            <SelectTrigger className="   w-fit">
              <SelectValue className="">
                <div className="pr-10">
                  Server {provider === "vidsrc" ? 1 : 2}{" "}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"vidsrc"} key={"vidsrc"}>
                <div className="mx-1 flex gap-2">Server 1</div>
              </SelectItem>
              <SelectItem value={"consumet"} key={"consumet"}>
                <div className="mx-1 flex gap-2">Server 2</div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="aspect-video an gap-2 text-xl flex-col items-center flex justify-center bg-destructive rounded-lg w-full lg:w-[600px] mx-auto my-4">
          <div> {error || "Something went wrong"} :/</div>
          <Button
            className="bg-primary text-sm gap-2"
            onClick={() =>
              provider === "vidsrc" ? fetchVidSrcData() : fetchMovieLinksData()
            }
          >
            Retry <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      <Select
        defaultValue={provider}
        onValueChange={(value) => setProvider(value)}
      >
        <SelectTrigger className="   w-fit">
          <SelectValue className="">
            <div className="pr-10">Server {provider === "vidsrc" ? 1 : 2} </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"vidsrc"} key={"vidsrc"}>
            <div className="mx-1 flex gap-2">Server 1</div>
          </SelectItem>
          <SelectItem value={"consumet"} key={"consumet"}>
            <div className="mx-1 flex gap-2">Server 2</div>
          </SelectItem>
        </SelectContent>
      </Select>
      {episode &&
        (provider === "vidsrc" ? (
          <OPlayer
            key={"vidsrc"}
            provider={"vidsrc"}
            sources={episode.sources}
            subtitles={episode.subtitles}
            type={type}
          />
        ) : (
          <OPlayer
            key={"consumet"}
            provider={"consumet"}
            sources={episode.sources}
            subtitles={episode.subtitles}
            type={type}
          />
        ))}
    </>
  );
}
