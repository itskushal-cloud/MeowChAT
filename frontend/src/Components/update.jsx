import { useState } from "react";
import { api } from "../api.js";

const GENDERS = ["female", "Non binary", "male", "others"];

const Update = ({ user, onUpdated }) => {
  const [form, setForm] = useState({
    fullname: user.fullname || "",
    bio: user.bio || "",
    pfp: user.pfp || "",
    gender: user.gender || "male",
  });
  const [pw, setPw] = useState({ oldPassword: "", newPassword: "", confmpassword: "" });
  const [msg, setmsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const input = "p-2 rounded-lg bg-white/80 text-black";

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await api("/auth/update", "PUT", form);
    setmsg(res.ok ? "Profile updated meow" : res.data.message || "Failed");
    if (res.ok) onUpdated(res.data.user);
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const res = await api("/auth/change-password", "PUT", pw);
    setPwMsg(res.ok ? "Password changed meow" : res.data.message || "Failed");
    if (res.ok) setPw({ oldPassword: "", newPassword: "", confmpassword: "" });
  };

  return (
    <div className="mx-auto w-96 mt-6 flex flex-col gap-6 text-white">
      <form onSubmit={saveProfile}
        className="p-6 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/35 flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#F4C979]">Edit profile</h2>
        <input className={input} placeholder="Full name" value={form.fullname}
          onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
        <input className={input} placeholder="Bio (max 150)" maxLength={150} value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <input className={input} placeholder="Profile picture URL" value={form.pfp}
          onChange={(e) => setForm({ ...form, pfp: e.target.value })} />
        <select className={input} value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        {msg && <p className="text-sm">{msg}</p>}
        <button className="meow-button" type="submit">Save</button>
      </form>

      <form onSubmit={savePassword}
        className="p-6 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/35 flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#F4C979]">Change password</h2>
        <input className={input} type="password" placeholder="Old password" value={pw.oldPassword}
          onChange={(e) => setPw({ ...pw, oldPassword: e.target.value })} required />
        <input className={input} type="password" placeholder="New password" value={pw.newPassword}
          onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
        <input className={input} type="password" placeholder="Confirm new password" value={pw.confmpassword}
          onChange={(e) => setPw({ ...pw, confmpassword: e.target.value })} required />
        {pwMsg && <p className="text-sm">{pwMsg}</p>}
        <button className="meow-button" type="submit">Change password</button>
      </form>
    </div>
  );
};

export default Update;
