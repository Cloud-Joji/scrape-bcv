import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';

function fetchPage(url: string): Promise<string | undefined> {
  const HTMLData = axios
    .get(url)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error with ${error.config.url}.`);
      console.error(error.toJSON());
    });

  return HTMLData;
}

async function fetchFromWebOrCache(url: string, ignoreCache = false) {
  // If the cache folder doesn't exist, create it
  if (!existsSync(resolve(__dirname, '.cache'))) {
    mkdirSync('.cache');
  }
  console.log(`Getting data for ${url}...`);
  if (
    !ignoreCache &&
    existsSync(
      resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`),
    )
  ) {
    console.log(`I read ${url} from cache`);
    const HTMLData = await readFile(
      resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`),
      { encoding: 'utf8' },
    );
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  } else {
    console.log(`I fetched ${url} fresh`);
    const HTMLData = await fetchPage(url);
    if (!ignoreCache && HTMLData) {
      writeFile(
        resolve(
          __dirname,
          `.cache/${Buffer.from(url).toString('base64')}.html`,
        ),
        HTMLData,
        { encoding: 'utf8' },
      );
    }
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  }
}

function extractData(document: Document) {
  const valueUsdBcv: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll('#dolar > div > div > div.col-sm-6.col-xs-6.centrado > strong'),
  );
  const dayEffect: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll('#block-views-47bbee0af9473fcf0d6df64198f4df6b > div > div.view-content > div > div.pull-right.dinpro.center > span'),
  );
  return {
    valueUsdBcv: valueUsdBcv.map(link => ({
      valueUsd: link.textContent
    })),
    dayEffect: dayEffect.map(link => ({
          day: link.textContent
    }))
  }
}

function saveData(filename: string, data: any) {
  if (!existsSync(resolve(__dirname, 'data'))) {
    mkdirSync('data');
  }
  writeFile(resolve(__dirname, `data/${filename}.json`), JSON.stringify(data), {
    encoding: 'utf8',
  });
}

async function getData() {
  const document = await fetchFromWebOrCache(
    'https://bcv.org.ve/',
    true,
  );
  const data = extractData(document);
  saveData('dolar-tasa-bcv', data);
}

getData();
