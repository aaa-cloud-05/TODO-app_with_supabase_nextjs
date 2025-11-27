"use client";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const LOCAL_KEY = "local_todos";

export function useSupabaseUser() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setAuthLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const mergeLocalTodos = async () => {
      if (!user) return;

      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
      if (local.length === 0) return;

      setMerging(true);

      const todos = local.map((t: any) => ({
        ...t,
        user_id: user.id,
      }));

      const res = await fetch("/api/todos/bulk-insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todos }),
      });

      if (res.ok) {
        localStorage.removeItem(LOCAL_KEY);
      }

      setMerging(false);
    };

    mergeLocalTodos();
  }, [user]);

  return { user, authLoading, merging };

}
