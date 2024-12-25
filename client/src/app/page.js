"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/scrape/media?page=${page}&type=${typeFilter}&search=${searchFilter}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setMedia(data);
      });
  }, [page, typeFilter, searchFilter]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Search..."
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(page - 1)}
          className="disabled:opacity-50 rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-700"
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-700"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <div key={item.id} className="rounded-md shadow-md overflow-hidden">
            {item.type === "image" && (
              <Image
                src={item.url}
                alt="Scraped Image"
                className="w-full h-auto object-cover"
                width={50}
                height={50}
                priority={true}
                unoptimized={true}
              />
            )}
            {item.type === "video" && (
              <video src={item.url} controls className="w-full h-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
