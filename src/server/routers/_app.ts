import { z } from "zod";
import { procedure, router } from "../trpc";
// import { PokemonClient } from "pokenode-ts";
import { prisma } from "@/server/utils/prisma";
import { TRPCError } from "@trpc/server";

// const api = new PokemonClient();

export const appRouter = router({
  pokemon: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      // const pokemon = await api.getPokemonById(input.id);
      const pokemon = await prisma.pokemon.findUnique({
        where: { pokemonId: input.id },
      });
      if (!pokemon) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: "no pokemon with this id",
        });
      }
      return {
        name: pokemon.name,
        sprites: pokemon.spriteUrl,
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
      console.log('input', input)
      const voteInDb = await prisma.vote.create({
        data: {
          ...input,
        },
      });

      return { success: true, vote: voteInDb };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
