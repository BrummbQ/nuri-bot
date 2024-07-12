import type {
  SearchGenerateTermQuery,
  SearchGenerateTermResponse,
} from "~/lib/models";
import { generateSearchTerm } from "~/lib/search";

export default defineEventHandler(
  async (event): Promise<SearchGenerateTermResponse> => {
    const query = await getQuery<SearchGenerateTermQuery>(event);

    const searchTerm = await generateSearchTerm(query);

    return { searchTerm };
  },
);
