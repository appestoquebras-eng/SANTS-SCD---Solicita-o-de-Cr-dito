export async function onRequest(context) {
  const hostname = new URL(context.request.url).hostname;
  if (hostname === "santscredito.pages.dev" || hostname.endsWith(".santscredito.pages.dev")) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
  return context.next();
}
