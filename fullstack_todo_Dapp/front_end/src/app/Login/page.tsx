"use client";

import { useSessionContext } from "../components/ContextProvider";

export default function LoginPage() {
    const session = useSessionContext();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">🔑 Chromia + MetaMask Login</h1>
            
            {session ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-green-500 font-semibold">✅ Logged in successfully!</p>
                    <p className="mt-2 text-sm text-gray-600">Session ID: {session.session?.account.id}</p>
                </div>
            ) : (
                <p className="text-red-500">🔴 Not logged in. Please connect your MetaMask wallet.</p>
            )}
        </div>
    );
}
