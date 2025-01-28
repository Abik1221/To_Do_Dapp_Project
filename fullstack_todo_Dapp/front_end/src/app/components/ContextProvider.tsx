import { 
    Session, 
    createKeyStoreInteractor, 
    createSingleSigAuthDescriptorRegistration, 
    createWeb3ProviderEvmKeyStore, 
    hours, 
    registerAccount, 
    registrationStrategy, 
    ttlLoginRule 
} from "@chromia/ft4";
import { createClient } from "postchain-client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

const ChromiaContext = createContext<{ session: Session | undefined; evmKeyStore: any } | undefined>(undefined);

declare global {
    interface Window { ethereum: any; }
}

export function ContextProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | undefined>(undefined);
    const [evmKeyStore, setEvmKeyStore] = useState<any>(null); // Track the evmKeyStore

    useEffect(() => {
        const initSession = async () => {
            try {
                console.log("🔹 Initializing Chromia Session...");

                // 1️⃣ Create Chromia Client
                const client = process.env.NEXT_PUBLIC_DEV === "true" 
                    ? await createClient({ nodeUrlPool: "http://localhost:7740", blockchainIid: 0}) 
                    : await createClient({ directoryNodeUrlPool: "https://testnet4-dapps.chromia.dev:7740", blockchainRid: "BAF086DC73CCB6D0235E6B8CACF4AA25815A9BB6A8F0A66C521FCCB40B925AEF" });

                // 2️⃣ Connect with MetaMask
                // if (!window.ethereum) {
                //     console.error("🛑 MetaMask is not installed!");
                //     return;
                // }
                const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
                const evmKeyStoreInteractor = createKeyStoreInteractor(client, evmKeyStore);
                const accounts = await evmKeyStoreInteractor.getAccounts();

                if (accounts.length > 0) {
                    console.log("✅ Existing account found. Logging in...");

                    // 3️⃣ Login with existing account
                    const { session } = await evmKeyStoreInteractor.login({
                        accountId: accounts[0].id,
                        config: { rules: ttlLoginRule(hours(2)), flags: ["S"] }
                    });
                    setSession(session);
                    setEvmKeyStore(evmKeyStore); // Store the evmKeyStore
                } else {
                    console.log("🆕 No existing account. Registering new user...");

                    // 4️⃣ Register a new account
                    const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);
                    const { session } = await registerAccount(client, evmKeyStore, registrationStrategy.open(authDescriptor, {
                        config: { rules: ttlLoginRule(hours(2)), flags: ["S"] }
                    }), {
                        name: "register_user", 
                        args: [evmKeyStore.id] // Using wallet address as identifier
                    });

                    setSession(session);
                    setEvmKeyStore(evmKeyStore); // Store the evmKeyStore
                    console.log("✅ New user registered successfully!");
                }
            } catch (error) {
                console.error("⚠️ Error initializing session:", error);
            }
        };

        initSession();
    }, []);

    return (
        <ChromiaContext.Provider value={{ session, evmKeyStore }}>
            {children}
        </ChromiaContext.Provider>
    );
}

export function useSessionContext() {
    return useContext(ChromiaContext);
}
