import { useState } from "react";
import { api } from "../api.js";

const Requests = ({ requests, onChange }) => {
  const [error, setError] = useState("");

  const act = async (method, path) => {
    setError("");
    const res = await api(path, method);
    if (!res.ok) return setError(res.data.message || "Failed");
    onChange(); // reload friends + requests
  };

  const Row = ({ u, children }) => (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10">
      <img src={u.pfp} className="h-14 w-14 rounded-full object-cover" />
      <div className="flex-1">
        <p className="font-bold">{u.fullname}</p>
        <p className="text-sm opacity-80">@{u.username}</p>
      </div>
      {children}
    </div>
  );

  return (
    <div className="mx-auto w-220 mt-6 p-6 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/35 text-white flex flex-col gap-4">
      {error && <p className="text-red-300 text-sm">{error}</p>}

      <h2 className="text-xl font-bold text-[#F4C979]">Received ({requests.received.length})</h2>
      {requests.received.length === 0 && <p className="opacity-70">No pending requests</p>}
      {requests.received.map((u) => (
        <Row key={u._id} u={u}>
          <button className="meow-button" onClick={() => act("PUT", `/users/request/${u._id}/accept`)}>Accept</button>
          <button className="meow-button" onClick={() => act("PUT", `/users/request/${u._id}/reject`)}>Reject</button>
        </Row>
      ))}

      <h2 className="text-xl font-bold text-[#F4C979] mt-4">Sent ({requests.sent.length})</h2>
      {requests.sent.length === 0 && <p className="opacity-70">You haven't sent any requests</p>}
      {requests.sent.map((u) => (
        <Row key={u._id} u={u}>
          <button className="meow-button" onClick={() => act("DELETE", `/users/request/${u._id}`)}>Cancel</button>
        </Row>
      ))}
    </div>
  );
};

export default Requests;
