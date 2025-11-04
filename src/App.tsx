import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

type UserCtx = {
  fid: number;
  username?: string;
  displayName?: string;
  bio?: string;
  pfpUrl?: string;
};

export default function App() {
  const [user, setUser] = useState<UserCtx | null>(null);
  const [msg, setMsg] = useState("Memuat…");

  useEffect(() => {
    (async () => {
      try {
        const inMini = await sdk.isInMiniApp();
        if (!inMini)
          return setMsg("Buka dari Farcaster/Base, bukan dari browser.");

        const ctx = await sdk.context;
        setUser(ctx.user);

        await sdk.actions.setTitle?.("Profil Saya");
        await sdk.actions.ready(); // sembunyikan splash
      } catch (e: any) {
        setMsg("ERROR: " + e.message);
      }
    })();
  }, []);

  if (!user)
    return <div style={{ padding: 20, textAlign: "center" }}>{msg}</div>;

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui",
        background: "#f6f7fb",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px 28px",
          borderRadius: 16,
          boxShadow: "0 6px 24px rgba(0,0,0,.08)",
          textAlign: "center",
          width: 280,
        }}
      >
        {/* Foto profil */}
        <img
          src={user.pfpUrl || "/default-pfp.png"}
          alt="Profile"
          width={96}
          height={96}
          style={{
            borderRadius: "50%",
            marginBottom: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        />

        {/* Username + FID */}
        <h2 style={{ margin: 0 }}>@{user.username ?? "unknown"}</h2>
        <p style={{ margin: "4px 0", color: "#555" }}>FID: {user.fid}</p>

        {/* Tambahan displayName & bio kalau ada */}
       {user.displayName && user.displayName !== user.username && (
  <p style={{ fontWeight: 500, color: "#333", margin: "6px 0" }}>
    {user.displayName}
  </p>
)}
        {user.bio && (
          <p style={{ fontSize: 14, color: "#777", marginTop: 6 }}>
            {user.bio}
          </p>
        )}
      </div>
    </div>
  );
}
