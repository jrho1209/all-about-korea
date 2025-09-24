"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });
    if (res?.error) {
      setLoginError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center pb-20 bg-gray-900 px-4">
      <section className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* 아이콘 */}
        <div className="mb-6">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" stroke="#fff" strokeWidth="4" />
            <rect x="16" y="20" width="16" height="20" rx="8" fill="#fff" />
          </svg>
        </div>
        {/* 타이틀 */}
        <h1 className="text-2xl font-extrabold text-white mb-2">Log in to your account</h1>
        <p className="text-gray-300 mb-6 text-center">Welcome back! Please enter your details.</p>
        
        {/* 에러 메시지 - 로그인 폼 바로 위에 */}
        {loginError && (
          <div className="w-full mb-4 px-4 py-4 bg-red-700 text-white text-xl font-bold rounded-xl shadow-lg text-center border-2 border-red-300 animate-bounce">
            {loginError}
          </div>
        )}

        {/* 폼 시작 */}
        <form className="w-full" onSubmit={handleLogin}>
          {/* 이메일 입력 */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* 비밀번호 입력 */}
          <div className="w-full mb-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              className="absolute right-4 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {/* 눈 아이콘 (비밀번호 보기/숨기기) */}
              {showPassword ? (
                // 눈 감은 아이콘
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M2 10c2.5-4 7.5-4 10 0M2 10c2.5 4 7.5 4 10 0M2 10h16" stroke="#888" strokeWidth="2" />
                  <circle cx="10" cy="10" r="3" fill="#888" />
                </svg>
              ) : (
                // 눈 뜬 아이콘
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <ellipse cx="10" cy="10" rx="8" ry="5" stroke="#888" strokeWidth="2" />
                  <circle cx="10" cy="10" r="3" fill="#888" />
                </svg>
              )}
            </span>
          </div>
          {/* 로그인 버튼 */}
          <button className="w-full py-3 rounded-lg bg-gray-900 text-white font-bold mb-4 hover:bg-gray-700 transition">
            Sign in
          </button>
        </form>
        {/* 구글 로그인 */}
        <button
          className="w-full py-3 rounded-lg bg-gray-700 text-white font-bold flex items-center justify-center gap-2 mb-4 hover:bg-gray-600 transition"
          onClick={() => signIn("google")}
        >
          <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.93-6.93C35.61 2.36 30.13 0 24 0 14.61 0 6.27 0 2.44 14.09l8.51 6.62C13.13 14.13 18.13 9.5 24 9.5z"/><path fill="#34A853" d="M46.09 24.59c0-1.64-.15-3.22-.43-4.75H24v9.01h12.43c-.54 2.91-2.17 5.38-4.63 7.04l7.19 5.59C43.73 37.13 46.09 31.31 46.09 24.59z"/><path fill="#FBBC05" d="M10.95 28.71c-.48-1.44-.76-2.97-.76-4.71s.28-3.27.76-4.71l-8.51-6.62C1.09 16.87 0 20.29 0 24c0 3.71 1.09 7.13 2.44 10.33l8.51-6.62z"/><path fill="#EA4335" d="M24 48c6.13 0 11.61-2.36 15.93-6.45l-7.19-5.59c-2.01 1.35-4.59 2.15-7.74 2.15-5.87 0-10.87-4.63-12.95-10.91l-8.51 6.62C6.27 42.26 14.61 48 24 48z"/></g></svg>
          Sign in with Google
        </button>
        {/* 회원가입 링크 */}
        <p className="text-gray-400 text-sm mt-2">
          Don’t have an account? <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
        </p>
      </section>
    </main>
  );
}