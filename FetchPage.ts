import axios, { AxiosError } from 'axios';

export const  fetchPage= (url: string): Promise<string | undefined> => {
  const HTMLData = axios
    .get(url)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error with ${error.config.url}.`);
      console.error(error.toJSON());
    });

  return HTMLData;
}