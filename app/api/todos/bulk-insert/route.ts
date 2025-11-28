import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type IncomingTodo = {
  taskname: string;
  done: boolean;
};

async function createSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error("Cookie set error:", error);
          }
        },
      },
    }
  );
}

export async function POST(req: Request) {
  const supabase = await createSupabaseClient();

  // ユーザー認証
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // データ取得
  const { todos } = await req.json();
  if (!todos || !Array.isArray(todos)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // データ整形 (ローカルのidを削除し、DB側で自動生成させる)
  const cleanTodos = todos.map((t: IncomingTodo) => ({
    taskname: t.taskname,
    done: t.done,
    user_id: user.id,
  }));

  // 一括インサート
  const { error: insertError } = await supabase
    .from("todos")
    .insert(cleanTodos);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
