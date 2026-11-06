import { api } from "../api.js";

const Profile = ({ user, friendsCount, onLogout, onDeleted }) => {
  const handleDelete = async () => {
    if (!window.confirm("Delete your account permanently?")) return;
    const password = window.prompt("Enter your password to confirm:");
    if (!password) return;
    const res = await api("/auth/delete", "DELETE", { password });
    if (res.ok) onDeleted();
    else alert(res.data.message || "Could not delete account");
  };

  return (
    <div className="mx-auto w-96 mt-6 p-6 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/35 text-white text-center flex flex-col gap-3">
      <img src={user.pfp} className="h-24 w-24 rounded-full mx-auto object-cover" />
      <p className="text-xl font-bold">{user.fullname}</p>
      <p className="opacity-80">@{user.username}</p>
      {user.bio && <p className="opacity-70">{user.bio}</p>}
      <p>{friendsCount} {friendsCount === 1 ? "friend" : "friends"}</p>
      <button className="meow-button" onClick={onLogout}>Logout</button>
      <button className="text-red-300 text-sm underline" onClick={handleDelete}>Delete account</button>
    </div>
  );
};

export default Profile;
