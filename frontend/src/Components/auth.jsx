import { useState } from "react";
import { api } from "../api.js";

const GENDERS = ["female", "Non binary", "male", "others"]; // must match your schema enum

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    fullname: "", username: "", password: "", confmpassword: "", gender: "male",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const body = isLogin
      ? { username: form.username, password: form.password }
      : form;
    const res = await api(`/auth/${isLogin ? "login" : "register"}`, "POST", body);
    setLoading(false);
    if (!res.ok) return setError(res.data.message || "Something went wrong");
    onLogin(res.data.user); // cookie is already set by the backend
  };

  const input = "p-2 rounded-lg bg-white/80 text-black";

  return (
    <div className="mx-auto w-96 rounded-2xl p-8 bg-white/15 backdrop-blur-sm border border-white/35 flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold text-[#F4C979] text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {!isLogin && (
          <input name="fullname" placeholder="Full name" value={form.fullname}
            onChange={handleChange} className={input} required />
        )}
        <input name="username" placeholder="Username" value={form.username}
          onChange={handleChange} className={input} required />
        <input name="password" type="password" placeholder="Password" value={form.password}
          onChange={handleChange} className={input} required />
        {!isLogin && (
          <>
            <input name="confmpassword" type="password" placeholder="Confirm password"
              value={form.confmpassword} onChange={handleChange} className={input} required />
            <select name="gender" value={form.gender} onChange={handleChange} className={input}>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </>
        )}
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <button type="submit" className="meow-button" disabled={loading}>
          {loading ? "..." : isLogin ? "Login" : "Create account"}
        </button>
      </form>

      <p className="text-center text-white cursor-pointer"
        onClick={() => { setIsLogin(!isLogin); setError(""); }}>
        {isLogin ? "New here? Sign up" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default Auth;