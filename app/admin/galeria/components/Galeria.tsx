"use client";

import React from "react";
import Album from "./Album";
import NewAlbum from "./NewAlbum";

function Galeria() {
  const [newAlbum, setNewAlbum] = React.useState(true);

  return (
    <>
      <div className="px-4 sm:px-16 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl text-center">Galeria</h2>
          <button
            className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={() => {
              setNewAlbum(true);
            }}
          >
            Nowy album
          </button>
        </div>
        <div className="mt-8 flex flex-col gap-8">
          {/* {albums.map((album) => (
            <Album key={album.name} album={album} />
          ))} */}
        </div>
      </div>
      {newAlbum && <NewAlbum onClose={() => setNewAlbum(false)} />}
    </>
  );
}

export default Galeria;
