import { useState, useEffect, useCallback } from "react";
import Chatlist from "./Components/chatlist.jsx";
import Auth from "./Components/auth.jsx";
import Search from "./Components/search.jsx";
import Requests from "./Components/requests.jsx";
import Update from "./Components/update.jsx";
import Profile from "./Components/profile.jsx";
import { api } from "./api.js";
import "./App.css";

const TABS = [
  { key: "Clist", label: "Home", icon: "/home.png" },
  { key: "Search", label: "Search", icon: "/search.png" },
  { key: "Notifs", label: "Requests", icon: "/request.png" },
  { key: "Update", label: "Update", icon: "/update.png" },
  { key: "Profile", label: "Profile", icon: "/profile.png" },
];

const App = () => {
  const [status, setstatus] = useState("loading"); // loading | no_auth | yes_auth
  const [user, setuser] = useState(null);
  const [tab, settab] = useState("Clist");
  const [friends, setfriends] = useState([]);
  const [requests, setrequests] = useState({ received: [], sent: [] });

  // Fetch friends + requests (called after login and after any change)
  const loadSocial = useCallback(async () => {
    const [f, r] = await Promise.all([
      api("/users/friends"),
      api("/users/requests"),
    ]);
    if (f.ok) setfriends(f.data.friends);
    if (r.ok) setrequests({ received: r.data.received, sent: r.data.sent });
  }, []);

  // 1. On first load: is the cookie valid?
  useEffect(() => {
    // return ; // for testing 
    (async () => {
      const res = await api("/auth/me");
      if (res.ok) {
        setuser(res.data);
        setstatus("yes_auth");
      } else {
        setstatus("no_auth");
      }
    })();
  }, []);

  // 2. Once logged in: load the friend data
  useEffect(() => {
    if (status === "yes_auth") loadSocial();
  }, [status, loadSocial]);

  // Called by Auth.jsx after successful login/register
  const handleLogin = (loggedInUser) => {
    setuser(loggedInUser);
    setstatus("yes_auth");
    settab("Clist");
  };

  const resetApp = () => {
    setuser(null);
    setfriends([]);
    setrequests({ received: [], sent: [] });
    setstatus("no_auth");
  };

  const handleLogout = async () => {
    await api("/auth/logout", "POST");
    resetApp();
  };

  const bg = {
    className: "min-h-screen bg-cover bg-center bg-no-repeat p-10",
    style: { backgroundImage: "url('/meow-bg.png')" },
  };

  // Gate 1: still checking cookie
  if (status === "loading") {
    return (
      <div {...bg}>
        <div className="LOGO/TITLE flex flex-row justify-between">
        <h1 className="logo text-5xl font-extrabold text-center tracking-wider text-[#F4C979] leading-relaxed">
          MEOW CHAT
        </h1>
        <img src="/logo.png" className="TITLE h-50 w-50" />
      </div>
        <p className="text-center text-[#F4C979] text-2xl">Loading meow...</p>
      </div>
    );
  }

  // Gate 2: not logged in
  if (status === "no_auth") {
    return (
      <div {...bg}>
        <div className="LOGO/TITLE flex flex-row justify-between">
        <h1 className="logo text-5xl font-extrabold text-center tracking-wider text-[#F4C979] leading-relaxed">
          MEOW CHAT
        </h1>
        <img src="/logo.png" className="TITLE h-50 w-50" />
      </div>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  // Logged in: the real app
  return (
    <div {...bg}>
      <div className="LOGO/TITLE flex flex-row justify-between">
        <h1 className="logo text-5xl font-extrabold text-center tracking-wider text-[#F4C979] leading-relaxed">
          MEOW CHAT
        </h1>
        <img src="/logo.png" className="TITLE h-50 w-50" />
      </div>

      <div className="NAVBAR mx-auto w-220 rounded-2xl h-40 px-6 flex flex-row items-center justify-between bg-white/15 backdrop-blur-sm border border-white/35 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            className="meow-button relative"
            onClick={() => settab(t.key)}
          >
            <img src={t.icon} className="h-15 w-15" />
            <p>{t.label}</p>
            {/* red badge showing number of pending requests */}
            {t.key === "Notifs" && requests.received.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {requests.received.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "Clist" && <Chatlist friends={friends} />}
      {tab === "Search" && <Search onChange={loadSocial} />}
      {tab === "Notifs" && <Requests requests={requests} onChange={loadSocial} />}
      {tab === "Update" && <Update user={user} onUpdated={setuser} />}
      {tab === "Profile" && (
        <Profile
          user={user}
          friendsCount={friends.length}
          onLogout={handleLogout}
          onDeleted={resetApp}
        />
      )}
    </div>
  );
};

export default App;