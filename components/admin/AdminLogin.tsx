"use client";
import Image from "next/image";
import { useState } from "react";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const d = await r.json();
      if (d.ok) { location.reload(); return; }
      setErr(d.message || "Wrong password.");
    } catch { setErr("Network problem."); }
    setBusy(false);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-oat px-4">
      <form onSubmit={go} className="w-full max-w-sm rounded-2xl bg-surface p-7 shadow-2xl">
        <Image src="/logo-light.png" alt="Canflare" width={148} height={52} className="h-10 w-auto" />
        <h1 className="mt-5 text-2xl">Admin login</h1>
        {!configured && <p className="mt-2 text-sm text-danger">ADMIN_PASSWORD is not set on the server.</p>}
        <label className="label mt-5" htmlFor="pw">Password</label>
        <input id="pw" type="password" autoFocus autoComplete="current-password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p role="alert" className="err">{err}</p>}
        <button className="btn btn-dark w-full mt-5" disabled={busy || !pw}>{busy ? "Checking…" : "Log in"}</button>
      </form>
    </div>
  );
}
