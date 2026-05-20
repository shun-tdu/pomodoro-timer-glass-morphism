"use client";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-mono text-4xl mb-8">Pomodoro Timer</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </main>
  );
}
