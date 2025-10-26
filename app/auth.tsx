//認証なしのroute.ts
// import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";

// // type Todo = { id: string; taskname: string; done: boolean; }

// // Read(一覧取得)
// export async function GET() {
//   const { data: todos, error } = await supabase.from("todos").select("*");
//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(todos);
// }

// // Create(追加)
// export async function POST(req: Request) {
//   const body = await req.json();
//   const { data, error } = await supabase
//     .from("todos")
//     .insert([ {taskname: body.text }])
//     .select()
//     .single();
//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(data, { status: 201 });
// }

// // Update(更新)
// export async function PUT(req: Request) {
//   const body = await req.json();
//   const { data, error } = await supabase
//   .from("todos")
//   .update({ taskname: body.taskname, done: body.done })
//   .eq("id", body.id)
//   .select()
//   .single()
//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(data);
// }

// // Delete(削除)
// export async function DELETE(req: Request) {
//   const { id } = await req.json();
//   const { error } = await supabase
//   .from("todos")
//   .delete()
//   .eq("id", id);
//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(null, { status: 200 });
// }




//認証ありのroute.ts
// import { NextResponse } from "next/server";
// // import { createClient } from "@/lib/supabaseServer";

// // Read(一覧取得)
// export async function GET() {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { data: todos, error } = await supabase
//     .from("todos")
//     .select("*")
//     .eq("user_id", user.id)
//     .order("id", { ascending: true });
//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(todos);
// }

// // Create(追加)
// export async function POST(req: Request) {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const body = await req.json();
//   const { data, error } = await supabase
//     .from("todos")
//     .insert([ {taskname: body.text, user_id: user.id}])
//     .select()
//     .single();
//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(data, { status: 201 });
// }

// // Update(更新)
// export async function PUT(req: Request) {
//   const supabase = await createClient();
//   const { data: { user }, } = await supabase.auth.getUser();
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const body = await req.json();
//   const { data, error } = await supabase
//     .from("todos")
//     .update({ taskname: body.taskname, done: body.done })
//     .eq("id", body.id)
//     .eq("user_id", user.id)
//     .select()
//     .single()

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(data);
// }

// // Delete(削除)
// export async function DELETE(req: Request) {
//   const supabase = await createClient();
//   const { data: { user }, } = await supabase.auth.getUser();
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { id } = await req.json();
//   const { error } = await supabase
//     .from("todos")
//     .delete()
//     .eq("id", id)
//     .eq("user_id", user.id);

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(null, { status: 200 });
// }