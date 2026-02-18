import type { Fetcher } from "@cloudflare/workers-types";

type Env = { ASSETS: Fetcher };

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    const isFile =
      url.pathname.startsWith("/assets/") || url.pathname.includes(".");

    if (isFile) return env.ASSETS.fetch(url.toString());

    const indexUrl = new URL("/index.html", url);
    return env.ASSETS.fetch(indexUrl.toString());
  },
};
