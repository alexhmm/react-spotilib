import { useFetch } from '../../shared/hooks/use-fetch.hook';
import { SearchGetParams, SearchGetResponse } from './search.types';

const useSearchHttp = () => {
  const { fetchData } = useFetch();

  /**
   * GET Search by query and spotify item types.
   * @param params SearchGetParams
   * @returns SearchGetResponse
   */
  const searchGet = async (
    params: SearchGetParams
  ): Promise<SearchGetResponse | undefined> => {
    return await fetchData(`search`, {
      params: new URLSearchParams({
        q: params.q,
        type: params.type.toString(),
      }),
    });
  };

  return {
    searchGet,
  };
};

export default useSearchHttp;
