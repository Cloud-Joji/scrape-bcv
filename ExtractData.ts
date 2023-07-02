export const extractData = (document: Document) => {
  const valueUsdBcv: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll(
      "#dolar > div > div > div.col-sm-6.col-xs-6.centrado > strong"
    )
  );
  const dayEffect: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll(
      "#block-views-47bbee0af9473fcf0d6df64198f4df6b > div > div.view-content > div > div.pull-right.dinpro.center > span"
    )
  );
  const rawValueUsd: any = valueUsdBcv[0].textContent?.trim();
  const valueUsd: number = parseFloat(rawValueUsd.replace(",", "."));
    return {
    valueUsd: valueUsd, 
    dayEffect: dayEffect[0].textContent?.trim(),
  };
};
