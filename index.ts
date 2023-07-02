import { fetchFromWebOrCache } from './FetchFromWeb';
import { extractData } from './ExtractData';
import { saveData } from './SaveData';

async function getData() {
  const document = await fetchFromWebOrCache(
    'https://bcv.org.ve/',
    true,
  );
  const data = extractData(document);
  console.log(data)
  const valueUsd:any = data.valueUsdBcv;
  const parsedValueUsd: number = parseFloat(valueUsd.replace(",", "."));
  console.log(parsedValueUsd)
  //const day = data.dayEffect[0].day;

  //console.log(valueUsd) // 28,01620000
  //console.log(day) // Martes, 04 Julio  2023
  // opcional
  saveData('dolar-tasa-bcv', data);
}

getData();
