// Native JWT support for Tezz
export function sign(payload, secret) {
  // Simplified for example purposes
  return "header." + btoa(JSON.stringify(payload)) + ".signature";
}

export function verify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error("Invalid token");
  return JSON.parse(atob(parts[1]));
}
