"use client";

import React, { useState } from "react";
import { useSessionContext } from "../components/ContextProvider";
import { createWeb3ProviderEvmKeyStore, createSingleSigAuthDescriptorRegistration, registerAccount, registrationStrategy, ttlLoginRule, hours } from "@chromia/ft4";
import { createClient } from "postchain-client";
import Link from "next/link";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function RegistrationPage() {
  const session = useSessionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (session) {
      setError("You are already registered.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: Initialize Client
      const client = await createClient(
        process.env.NEXT_PUBLIC_DEV === "true"
          ? {
              nodeUrlPool: "http://localhost:7740",
              blockchainIid: 0,
            }
          : {
              directoryNodeUrlPool: "https://testnet4-dapps.chromia.dev:7740",
              blockchainRid: "05893974893F4B030AF63DDF7F72564097903012802AB0B3DA6C126751DB90C4",
            }
      );

      // Step 2: Connect to MetaMask
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }
      const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);

      // Step 3: Generate Auth Descriptor and Register Account
      const authDescriptor = createSingleSigAuthDescriptorRegistration(
        ["A", "T"], // Permissions for account: Action and Transaction.
        evmKeyStore.id
      );
      await registerAccount(
        client,
        evmKeyStore,
        registrationStrategy.open(authDescriptor, {
          config: {
            rules: ttlLoginRule(hours(2)), // Session expires in 2 hours.
            flags: ["S"],
          },
        }),
        {
          name: "register_user",
          args: ["MyNewUser"], // Replace with dynamic username if needed.
        }
      );

      setSuccess("Registration successful! You can now log in.");
      alert("register success");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      alert("register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Register Your Wallet</h1>
        <p className="text-center text-gray-500">Connect your MetaMask wallet to register</p>

        {error && <div className="p-4 text-red-600 bg-red-100 rounded-md">{error}</div>}
        {success && <div className="p-4 text-green-600 bg-green-100 rounded-md">{success}</div>}

        <button
          onClick={handleRegister}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !!session}
        >
          {loading ? "Registering..." : session ? "Already Registered" : "Register with MetaMask"}
        </button>
        <div className="text-center text-gray-500 flex items-center justify-center">Already have an account?</div>
        <Link href="/Login">
          <button className="mx-auto px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Log In
          </button>
        </Link>
        </div>
      </div>
  );
}
