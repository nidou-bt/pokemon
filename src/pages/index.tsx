import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import PokemonCard from "@/components/PokemonCard";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home = () => {
  const [ids, setIds] = useState<number[]>(() => getOptionsForVote());
  const [first, second] = ids;
  const {
    data: FPData,
    isLoading: FPLoading,
    isError: FPError,
  } = trpc.pokemon.useQuery({ id: first });
  const {
    data: SPData,
    isLoading: SPLoading,
    isError: SPError,
  } = trpc.pokemon.useQuery({ id: second });

  const { mutate } = trpc.vote.useMutation();

  const voteForRoundest = ({ selected }: { selected: number }) => {
    if (selected === first) {
      mutate({ votedFor: first, votedAgainst: second });
    } else {
      mutate({ votedFor: second, votedAgainst: first });
    }
    console.log('selected', selected)
    return setIds(getOptionsForVote());
  };

  if (FPLoading || SPLoading) {
    return <div>Loading...</div>;
  }

  if (FPError || SPError) {
    return <div>Error...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is Rounded?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!!FPData ? (
          <PokemonCard
            name={FPData.name}
            sprites={FPData.sprites}
            vote={voteForRoundest}
            selected={first}
          />
        ) : null}
        <div className="p-8">VS</div>
        {!!SPData ? (
          <PokemonCard
            name={SPData.name}
            sprites={SPData.sprites}
            vote={voteForRoundest}
            selected={second}
          />
        ) : null}
        <div className="p-2" />
      </div>
    </div>
  );
};

export default Home;
