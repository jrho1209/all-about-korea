"use client";

import { useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import emailValidator from "email-validator";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameTouched, setNameTouched] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [role, setRole] = useState("user");

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const router = useRouter();

  const handlePhoneChange = (value) => {
    setPhone(value);
    if (value && !isValidPhoneNumber("+" + value)) {
      setPhoneError("Invalid phone number");
    } else {
      setPhoneError("");
    }
  };

  const handlePhoneBlur = () => setPhoneTouched(true);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !emailValidator.validate(value)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => setEmailTouched(true);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!value.trim()) {
      setNameError("Name is required");
    } else {
      setNameError("");
    }
  };

  const handleNameBlur = () => setNameTouched(true);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordBlur = () => setPasswordTouched(true);

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordBlur = () => setConfirmPasswordTouched(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await fetch("/api/manual-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess("Signup successful! Logging you in...");
        // 자동 로그인 및 홈페이지 이동
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        router.push("/");
      } else {
        setSubmitError(data.message || "Signup failed.");
      }
    } catch (err) {
      setSubmitError("Server error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <section className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-2xl font-extrabold text-white mb-2">Sign up for an account</h1>
        <p className="text-gray-300 mb-6 text-center">Create your account to get started.</p>

        {/* 에러/성공 메시지 - 폼 바로 위에 표시 */}
        {submitError && (
          <div className="w-full mb-4 px-4 py-4 bg-red-700 text-white text-xl font-bold rounded-xl shadow-lg text-center border-2 border-red-300 animate-bounce">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="w-full mb-4 px-4 py-4 bg-green-700 text-white text-xl font-bold rounded-xl shadow-lg text-center border-2 border-green-300 animate-bounce">
            {submitSuccess}
          </div>
        )}

        {/* 이름 */}
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {nameTouched && nameError && (
            <p className="text-red-400 text-xs mt-2">{nameError}</p>
          )}
        </div>

        {/* Account Type Selection */}
        <div className="w-full mb-4">
          <label className="block text-white text-sm font-medium mb-2">Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
              role === 'user' 
                ? 'border-blue-400 bg-blue-900/30 text-white' 
                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
            }`}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={(e) => setRole(e.target.value)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-1">👤</div>
                <div className="text-sm font-medium">Traveler</div>
                <div className="text-xs text-gray-400">Book trips</div>
              </div>
            </label>
            <label className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
              role === 'agency' 
                ? 'border-red-400 bg-red-900/30 text-white' 
                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
            }`}>
              <input
                type="radio"
                name="role"
                value="agency"
                checked={role === 'agency'}
                onChange={(e) => setRole(e.target.value)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-1">🏢</div>
                <div className="text-sm font-medium">Travel Agency</div>
                <div className="text-xs text-gray-400">Provide services</div>
              </div>
            </label>
          </div>
        </div>

        <div className="w-full flex items-center mb-4">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-3 text-gray-500 text-xs">Account Info</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>
        
        {/* 이메일 & 비밀번호 */}
        <div className="w-full mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {emailTouched && emailError && (
            <p className="text-red-400 text-xs mt-2">{emailError}</p>
          )}
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {passwordTouched && passwordError && (
            <p className="text-red-400 text-xs mt-2">{passwordError}</p>
          )}
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {confirmPasswordTouched && confirmPasswordError && (
            <p className="text-red-400 text-xs mt-2">{confirmPasswordError}</p>
          )}
        </div>
        <div className="w-full flex items-center mb-4">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-3 text-gray-500 text-xs">Optional</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>
        
        {/* 전화번호 */}
        <div className="w-full mb-6">
          <PhoneInput
            country="kr"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            inputClass="!w-full !bg-gray-700 !text-white !rounded-lg !py-3 !px-4 !placeholder-gray-400"
            buttonClass="!bg-gray-700"
            dropdownClass="!bg-gray-800 !text-white"
            enableSearch
            inputProps={{
              placeholder: "000-0000-0000"
            }}
          />
          {phoneTouched && phoneError && (
            <p className="text-red-400 text-xs mt-2">{phoneError}</p>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-gray-900 text-white font-bold mb-4 hover:bg-gray-700 transition"
        >
          Sign up
        </button>
        <button
          type="button"
          className="w-full py-3 rounded-lg bg-gray-700 text-white font-bold flex items-center justify-center gap-2 mb-4 hover:bg-gray-600 transition"
          onClick={() => signIn("google")}
        >
          <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.93-6.93C35.61 2.36 30.13 0 24 0 14.61 0 6.27 0 2.44 14.09l8.51 6.62C13.13 14.13 18.13 9.5 24 9.5z"/><path fill="#34A853" d="M46.09 24.59c0-1.64-.15-3.22-.43-4.75H24v9.01h12.43c-.54 2.91-2.17 5.38-4.63 7.04l7.19 5.59C43.73 37.13 46.09 31.31 46.09 24.59z"/><path fill="#FBBC05" d="M10.95 28.71c-.48-1.44-.76-2.97-.76-4.71s.28-3.27.76-4.71l-8.51-6.62C1.09 16.87 0 20.29 0 24c0 3.71 1.09 7.13 2.44 10.33l8.51 6.62z"/><path fill="#EA4335" d="M24 48c6.13 0 11.61-2.36 15.93-6.45l-7.19-5.59c-2.01 1.35-4.59 2.15-7.74 2.15-5.87 0-10.87-4.63-12.95-10.91l-8.51 6.62C6.27 42.26 14.61 48 24 48z"/></g></svg>
          Sign up with Google
        </button>
        <p className="text-gray-400 text-sm mt-2">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Log in</a>
        </p>
      </section>
    </main>
  );
}