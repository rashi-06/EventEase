"use client";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim().length || !password.trim().length) {
      alert("Please enter proper details");
      return;
    }
    await axios.post('http://localhost:5000/api/auth/login', { email, password })
      .then((res: any) => {
        if (res.data && res.data._id) {
          router.push('/home/allEvents');
        } else {
          alert(res.data.message || "Login failed");
        }

      }).catch((error) => {
        console.log(error);

      })



    // handle email/password login logic here
  };

  const handleGoogleLogin = () => {
    // Trigger Google login here (e.g., via NextAuth or Firebase)
    console.log("Google Login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">Welcome Back</h2>
        <p className="text-center text-gray-500">Login to your EventEase account</p>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleLogin}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200"
          >
            Log In
          </button>
        </form>
        <div className="flex items-center gap-4 my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <FcGoogle />
          Continue with Google
        </button>
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
