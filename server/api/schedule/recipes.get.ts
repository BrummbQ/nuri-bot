import { fetchRecipesForCurrentSchedule } from "~/lib/db";
import type { ScheduleRecipesResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<ScheduleRecipesResponse> => {
    const recipes = await fetchRecipesForCurrentSchedule();
    return { recipes };
  },
);
