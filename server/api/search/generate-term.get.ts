import type { SearchGenerateTermResponse } from "~/lib/models";
import { generateSearchTerm } from "~/lib/search";

export default defineEventHandler(
  async (): Promise<SearchGenerateTermResponse> => {
    const searchTerm = await generateSearchTerm();

    return { searchTerm };
  },
);
