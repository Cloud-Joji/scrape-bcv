import { readFile, writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";
import { fetchPage } from "./FetchPage";

export const fetchFromWebOrCache = async (url: string, ignoreCache = false) => {
  const cachedFile = `${__dirname}, .cache/${Buffer.from(url).toString("base64")}.html`
  // Create cache folder if not exists
  !existsSync(resolve(__dirname, ".cache")) ? mkdirSync(".cache") : null;
  console.log(`Getting data from ${url}...`);
  
  if ( !ignoreCache && existsSync(resolve(cachedFile)) ) {
    console.log(`Reading ${url} from cache`);

    const HTMLData = await readFile(resolve(cachedFile),{ encoding: "utf8" });
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  } else {
    console.log(`Fetched ${url} `);

    const HTMLData = await fetchPage(url);
    (!ignoreCache && HTMLData) ? writeFile(resolve(cachedFile),HTMLData,{ encoding: "utf8" }) : null;
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  }
};
