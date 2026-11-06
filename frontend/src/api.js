// One place for every backend call.
// credentials: "include" makes the browser send/receive the httpOnly jwt cookie.
export const API = "http://localhost:5000/"; // change if your server uses another port

export const api = async (path, method = "GET", body) => {
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { message: "cannot reach server" } };
  }
};
