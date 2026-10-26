const visualThemeParameter = "__visualTheme";
const stylesheetLoadTimeoutMs = 10_000;
type StylesheetLoadResult = "load" | "error" | "timeout";

const visualThemeStylesheets = new Set([
  "css_blue.css",
  "css_green.css",
  "css_more_green.css",
  "css_summer.css",
  "css_autumn_orange.css",
  "css_autumn_red.css",
  "css_singleday.css",
  "css_mid_autumn_dark.css",
  "css_mid_autumn_light.css",
  "css_light_snow_dark.css",
  "css_light_snow_light.css",
  "css_spring_festival_dark.css",
  "css_spring_festival_light.css",
  "css_zhongchun.css",
  "css_dragon_boat_festival.css",
  "css_qingming.css",
  "css_autumn_2022_dark.css",
  "css_autumn_2022_light.css",
  "css_winter_2022_dark.css",
  "css_winter_2022_light.css",
  "css_spring_2023_dark.css",
  "css_spring_2023_light.css",
  "css_chongyang_dark.css",
  "css_chongyang_light.css",
  "css_spring_festival_2025_dark.css",
  "css_spring_festival_2025_light.css",
  "css_new_year_2026_dark.css",
  "css_new_year_2026_light.css",
  "css_cc98_23rd_light.css",
]);

function replaceStylesheetHref(
  stylesheet: HTMLLinkElement,
  href: string,
  timeoutMs: number,
): Promise<StylesheetLoadResult> {
  return new Promise((resolve) => {
    let timeoutId = 0;

    const finish = (result: StylesheetLoadResult) => {
      window.clearTimeout(timeoutId);
      stylesheet.removeEventListener("load", handleLoad);
      stylesheet.removeEventListener("error", handleError);
      resolve(result);
    };
    const handleLoad = () => finish("load");
    const handleError = () => finish("error");

    stylesheet.addEventListener("load", handleLoad);
    stylesheet.addEventListener("error", handleError);
    timeoutId = window.setTimeout(() => finish("timeout"), timeoutMs);
    stylesheet.setAttribute("href", href);
  });
}

export async function applyDevVisualThemeOverride(
  timeoutMs = stylesheetLoadTimeoutMs,
): Promise<boolean> {
  const requestedTheme = new URLSearchParams(window.location.search).get(
    visualThemeParameter,
  );
  if (!requestedTheme || !visualThemeStylesheets.has(requestedTheme)) {
    return false;
  }

  const stylesheet = document.querySelector<HTMLLinkElement>("#mainStylesheet");
  if (!stylesheet) return false;

  const previousHref = stylesheet.getAttribute("href");
  if (!previousHref) return false;

  const nextHref = `/static/content/${requestedTheme}`;
  const result = await replaceStylesheetHref(stylesheet, nextHref, timeoutMs);
  if (result === "load") return true;

  await replaceStylesheetHref(stylesheet, previousHref, timeoutMs);
  if (stylesheet.getAttribute("href") !== previousHref) {
    stylesheet.setAttribute("href", previousHref);
  }

  return false;
}
