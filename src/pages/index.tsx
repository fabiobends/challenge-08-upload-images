import { Box, Button, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { AxiosResponse } from 'axios';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

type getImagesParams = {
  pageParam?: string;
};

export interface ImagesResponse {
  after?: string;
  data: Card[];
}

export default function Home(): JSX.Element {
  const getImages = async ({
    pageParam = null,
  }: getImagesParams): Promise<AxiosResponse<ImagesResponse>> => {
    const response = await api.get<ImagesResponse>('/api/images');
    return response;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', getImages, {
    getNextPageParam(lastpage) {
      return lastpage?.data?.after;
    },
  });

  const formattedData = useMemo(() => {
    if (data) {
      const imagesInPages = data.pages.map(page => page.data.data);
      const images = imagesInPages.flat();
      return images;
    }
    return null;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
      </Box>
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Carregar mais
        </Button>
      )}
    </>
  );
}
