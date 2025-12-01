import { create } from 'zustand';
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  authLoading: boolean;
  merging: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
}

const LOCAL_KEY = "local_todos";
const apiURL = "/api/todos/bulk-insert"
const supabase = createClient();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  authLoading: true,
  merging: false,
  initialized: false,
  initialize: async () => {
    if (get().initialized) return; // 現在の状態を参照し、initialized===trueで重複防止

    // ユーザ取得
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    set({ user: currentUser, authLoading: false });

    if (!currentUser) return;

    // リスナー設定
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, authLoading: false });
    });

    // localStorageのマージ
    const localStr = localStorage.getItem(LOCAL_KEY);
    if (!localStr) return;

    const local = JSON.parse(localStr);
    if (Array.isArray(local) && local.length > 0) {
      set({ merging: true });
      try {
        const todos = local.map((t: any) => ({
          ...t,
          user_id: currentUser.id,
        }));

        const res = await fetch(apiURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ todos }),
        })
        if (res.ok) {
          localStorage.removeItem(LOCAL_KEY);
        }
      } catch (error) {
        console.error(error);
      } finally {
        set({ merging: false });
      }
    }

    set({ initialized: true });
  }
}))