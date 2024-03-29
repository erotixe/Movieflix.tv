import Navbar from "@/components/common/Navbar";
import SearchPageContainer from "@/components/common/SearchPageContainer";
import React from "react";

export default function SearchPage() {
  
 
  return (
    <div>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <Navbar text="Search" />
      <div className="w-[95%] mx-auto">
        <div className="flex pt-[5rem] mb-4 font-bold justify-between mx-auto text-xl md:text-2xl items-center py-1 flex-row">
          <div className="mx-1 flex gap-2 items-center">
            Search
          </div>
        </div>
        <SearchPageContainer />
      </div>
    </div>
  );
}
