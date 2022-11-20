import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
        date: new Date(),
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getLogo: publicProcedure.query(async ({ ctx }) => {
    const techs = await ctx.prisma.technology.findMany()
    return techs.map(tech => tech.technology)
  }),
  addTech: publicProcedure
    .input(
      z.object({ technology: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.technology.create({
        data: {
          technology: input.technology
        }
      })
      return true
    }),
  deleteTech: publicProcedure
    .mutation(async ({ ctx }) => {
      await ctx.prisma.technology.deleteMany({})
    }
    )
});
