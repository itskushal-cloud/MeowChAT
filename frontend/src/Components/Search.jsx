import { useState, useEffect } from "react";
import { api } from "../api.js";

const Search = ({ onChange }) => {
  const [q, setq] = useState("");
  const [results, setresults] = useState([]);
  const [error, setError] = useState("");

  // Search 400ms after the user stops typing
  useEffect(() => {
    if (!q.trim()) { setresults([]); return; }
    const t = setTimeout(async () => {
      const res = await api(`/users/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setresults(res.data.users);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  const actions = {
    none:     { label: "Add",            method: "POST",   path: (id) => `/users/request/${id}`,        next: "sent" },
    sent:     { label: "Cancel request", method: "DELETE", path: (id) => `/users/request/${id}`,        next: "none" },
    received: { label: "Accept",         method: "PUT",    path: (id) => `/users/request/${id}/accept`, next: "friend" },
  };

  const act = async (u) => {
    const a = actions[u.relation];
    if (!a) return;
    setError("");
    const res = await api(a.path(u._id), a.method);
    if (!res.ok) return setError(res.data.message || "Failed");
    // update just this row locally, then refresh friends/requests in App
    setresults((list) => list.map((x) => (x._id === u._id ? { ...x, relation: a.next } : x)));
    onChange();
  };

  return (
    <div className="mx-auto w-220 mt-6 p-6 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/35 text-white flex flex-col gap-4">
      <input value={q} onChange={(e) => setq(e.target.value)}
        placeholder="Search by name or username..."
        className="p-3 rounded-lg bg-white/80 text-black" />
      {error && <p className="text-red-300 text-sm">{error}</p>}

      {results.map((u) => (
        <div key={u._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/10">
          <img src={u.pfp} className="h-14 w-14 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-bold">{u.fullname}</p>
            <p className="text-sm opacity-80">@{u.username}</p>
            {u.bio && <p className="text-sm opacity-70">{u.bio}</p>}
          </div>
          {u.relation === "friend" ? (
            <span className="opacity-80">Friends ✓</span>
          ) : (
            <button className="meow-button" onClick={() => act(u)}>
              {actions[u.relation].label}
            </button>
          )}
        </div>
      ))}

      {q.trim() && results.length === 0 && <p className="text-center opacity-70">No users found</p>}
    </div>
  );
};

export default Search;