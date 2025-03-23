addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname;

  let targetPath = "/"; // default

  if (hostname === "tybird.de") {
    targetPath = "/start1";
  } else if (hostname === "tybird.eu") {
    targetPath = "/start2";
  }

  const targetUrl = `https://multidomainwebflow.webflow.io/${targetPath}`;
  const modifiedRequest = new Request(targetUrl, request);

  const response = await fetch(modifiedRequest);

  // OPTIONAL: override canonical tag in response if needed
  let html = await response.text();
  html = html.replace(
    /<link rel="canonical"[^>]+>/i,
    `<link rel="canonical" href="https://${hostname}/">`
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    }
  });
}
