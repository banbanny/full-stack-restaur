"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const LoginPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  // Redirect to homepage if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleEmailLogin = async () => {
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Invalid credentials, please try again.");
      setSuccessMessage("");
    } else {
      setError("");
      setSuccessMessage("Login successful! Redirecting...");
      router.push("/"); // Redirect to homepage on successful login
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccessMessage("");
      return;
    }

    // Extract default name from email 
    const defaultName = registerEmail.split('@')[0];

    try {
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          name: defaultName, // Pass the default name
        }),
      });

      if (response.ok) {
        setSuccessMessage("User registered successfully. Logging in...");
        setError("");
        await handleEmailLogin();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed, please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred, please try again.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  // Reset error and success messages when switching between login/register
  const toggleForm = () => {
    setShowRegister(!showRegister);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      <div className="h-full shadow-2xl rounded-md flex flex-col md:flex-row md:h-[75%] md:w-full lg:w-[60%] 2xl:w-1/2">
        <div className="relative h-1/3 w-full md:h-full md:w-1/2">
          <Image src="/loginBg.webp" alt="Login Background" fill className="object-cover" />
        </div>

        <div className="p-10 flex flex-col gap-8 md:w-1/2">
          <h1 className="font-bold text-xl xl:text-3xl">
            {showRegister ? "Create an Account" : "Welcome"}
          </h1>
          <p>
            {showRegister
              ? "Fill in your details to create a new account."
              : "Log into your account using your email"}
          </p>

          {/* Display error or success message */}
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          {showRegister ? (
            // Registration Form
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button
                onClick={handleRegister}
                className="p-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button className="underline text-blue-600" onClick={toggleForm}>
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
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 ring-1 ring-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button
                onClick={handleEmailLogin}
                className="p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text-sm">
                Dont have an account?{" "}
                <button className="underline text-blue-600" onClick={toggleForm}>
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
