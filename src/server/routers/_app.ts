import { z } from "zod";
import { procedure, router } from "../trpc";
import { PokemonClient } from "pokenode-ts";
import { prisma } from "@/server/utils/prisma";

const api = new PokemonClient();

export const appRouter = router({
  pokemon: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const pokemon = await api.getPokemonById(input.id);
      return {
        name: pokemon.name,
        sprites: pokemon.sprites.front_default,
      };
    }),
  vote: procedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({data: {
        ...input,
      }})
      
      return { success: true, vote: voteInDb };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
