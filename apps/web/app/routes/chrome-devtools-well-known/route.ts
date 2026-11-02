/** Chrome DevTools probes this URL; answer empty JSON so RR doesn't log 404 spam. */
export async function loader() {
  return Response.json({}, { status: 200 });
}

export default function ChromeDevtoolsWellKnown() {
  return null;
}
