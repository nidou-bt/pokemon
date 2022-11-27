import React from "react";
import Image from "next/image";
import { InferQueryResponse } from "@/pages/api/trpc/[trpc]";

type PokemonFromServer = InferQueryResponse;

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

interface IPokemonVote {
  vote: ({ selected }: { selected: number }) => void;
}
interface IPokemonCard extends PokemonFromServer, IPokemonVote {
  selected: number;
}

const PokemonCard = ({ name, sprites, vote, selected }: IPokemonCard) => {
  return (
    <div className="w-64 h-64 flex flex-col items-center">
      <Image src={sprites!} alt="seconde pokemon" width={256} height={256} />
      <p className="text-xl text-center capitalize mt-[-2rem]">{name}</p>
      <button className={btn} onClick={() => vote({ selected })}>
        Rounder
      </button>
    </div>
  );
};

export default PokemonCard;
