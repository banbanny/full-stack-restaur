"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false); // New state for toggling registration form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "authenticated") {
    router.push("/");
  }

  const handleEmailLogin = () => {
    signIn("credentials", { email, password });
  };

  const handleRegister = () => {
    // Here you would handle the registration logic, such as API calls
    console.log("Registering user:", registerEmail, registerPassword);
    
  };

  return (
    <div className="p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      {/* BOX */}
      <div className="h-full shadow-2xl rounded-md flex flex-col md:flex-row md:h-[75%] md:w-full lg:w-[60%] 2xl:w-1/2">
        {/* IMAGE CONTAINER */}
        <div className="relative h-1/3 w-full md:h-full md:w-1/2">
          <Image src="/loginBg.webp" alt="" fill className="object-cover" />
        </div>

        {/* FORM CONTAINER */}
        <div className="p-10 flex flex-col gap-8 md:w-1/2">
          <h1 className="font-bold text-xl xl:text-3xl">{showRegister ? "Create an Account" : "Welcome"}</h1>
          <p>
            {showRegister
              ? "Fill in your details to create a new account."
              : "Log into your account or create a new one using your email"}
          </p>

          {showRegister ? (
            // Registration Form
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleRegister}
                className="p-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Register
              </button>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  className="underline text-blue-600"
                  onClick={() => setShowRegister(false)}
                >
                  Sign in
                </button>
              </p>
            </div>
          ) : (
            // Login Form
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleEmailLogin}
                className="p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Login
              </button>

              <p className="text-sm">
                Don't have an account?{" "}
                <button
                  className="underline text-blue-600"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
