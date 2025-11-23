import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

// type Todo = { id: string; taskname: string; done: boolean; }

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
          } catch {

          }
        },
      },
    }
  );
}

async function getAuthenticationUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { user: null, error: NextResponse.json({ error: "Authentication error" }, { status: 401 }) };
  }

  return { user, error: null };
}


// Read(一覧取得)
export async function GET() {
  const supabase = await createSupabaseClient();
  const { user, error } = await getAuthenticationUser(supabase)
  if (error) return error;

  const { data, error: queryError } = await supabase
    .from("todos")
    .select("*")
    .order('created_at', {ascending: true});
  
  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

// Create(追加)
export async function POST(req: Request) {
  const supabase = await createSupabaseClient();
  const { user, error } = await getAuthenticationUser(supabase);
  if (error) return error;

  const body = await req.json();
  const { data, error: insertError } = await supabase
    .from("todos")
    .insert([{ taskname: body.text, user_id: user ? user.id : null }])
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// Update(更新)
export async function PUT(req: Request) {
  const supabase = await createSupabaseClient();
  const { user, error } = await getAuthenticationUser(supabase);
  if (error) return error;

  const body = await req.json();
  const { data, error: updateError } = await supabase
    .from("todos")
    .update({ taskname: body.taskname, done: body.done })
    .eq("id", body.id)
    .select()
    .single();
  if (updateError) return NextResponse.json({ error: updateError }, { status: 500 });
  return NextResponse.json(data);
}

// Delete(削除)
export async function DELETE(req: Request) {
  const supabase = await createSupabaseClient();
  const { user, error } = await getAuthenticationUser(supabase);
  if (error) return error;

  const body = await req.json();
  const { error: deleteError } = await supabase
  .from("todos")
  .delete()
  .eq("id", body.id);
  if (deleteError) return NextResponse.json({ error: deleteError }, { status: 500 });
  return NextResponse.json(null, { status: 200 });
}