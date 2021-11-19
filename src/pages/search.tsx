import BrowseList from "@/components/seldom/BrowseList";
import { UseBrowseOptions } from "@/hooks/useBrowse";
import React from "react";

const browseQuery: UseBrowseOptions = {
  format: "",
  keyword: "",
  genre: "",
  season: "",
  seasonYear: "",
  sort: "popularity",
};

const SearchPage = () => {
  return (
    <div className="py-20">
      <BrowseList title="Tìm kiếm" defaultQuery={browseQuery} />
    </div>
  );
};

export default SearchPage;
