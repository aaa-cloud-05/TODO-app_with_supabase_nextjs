//ログインページ

// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabase";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithOtp({ email });
//     if (error) {
//       alert(error.message);
//     } else {
//       alert("Check your email for a login link!");
//     }
//   };

//   return (
//     <div className="p-32">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin} className="flex flex-col">
//         <input
//           type="email"
//           placeholder="Your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border"
//         />
//         <button type="submit" className="border">Send Magic Link</button>
//       </form>
//     </div>
//   );
// }
