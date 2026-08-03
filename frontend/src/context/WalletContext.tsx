import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Standard API Base URL
const API_URL = "http://localhost:5000/api";

interface UserProfile {
  id: string;
  walletAddress: string;
  username: string;
  bio: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
}

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  keplrInstalled: boolean;
  user: UserProfile | null;
  token: string | null;
  connectWallet: (useMock?: boolean) => Promise<void>;
  disconnectWallet: () => void;
  refreshProfile: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [keplrInstalled, setKeplrInstalled] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Detect Keplr Wallet
    const detectKeplr = () => {
      const isInstalled = !!(window as any).keplr;
      setKeplrInstalled(isInstalled);
    };

    detectKeplr();
    window.addEventListener("keplr_keystorechange", detectKeplr);

    // Auto-restore login session from localStorage
    const savedToken = localStorage.getItem("studysprint_token");
    const savedWallet = localStorage.getItem("studysprint_wallet");
    
    if (savedToken && savedWallet) {
      setToken(savedToken);
      setWalletAddress(savedWallet);
      setIsConnected(true);
      fetchProfile(savedToken);
    }

    return () => {
      window.removeEventListener("keplr_keystorechange", detectKeplr);
    };
  }, []);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile, logging out:", error);
      disconnectWallet();
    }
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  const connectWallet = async (useMock = false) => {
    setIsConnecting(true);
    try {
      if (useMock) {
        // Mock Login for easy sandbox assessment
        const mockAddress = "inj15v634j9q3gq0k2vsl87834p7k3cllzn75fup9a"; // Seed Alice wallet
        
        // Request challenge
        const challengeRes = await axios.post(`${API_URL}/auth/challenge`, {
          walletAddress: mockAddress,
        });
        
        // Sign verification
        const verifyRes = await axios.post(`${API_URL}/auth/verify`, {
          walletAddress: mockAddress,
          message: challengeRes.data.challenge,
          signature: `mock_signature_${Date.now()}`,
        });

        const { token: authToken, user: userProfile } = verifyRes.data;
        setToken(authToken);
        setWalletAddress(mockAddress);
        setUser(userProfile);
        setIsConnected(true);
        localStorage.setItem("studysprint_token", authToken);
        localStorage.setItem("studysprint_wallet", mockAddress);
        setIsConnecting(false);
        return;
      }

      // Real Keplr Wallet connection
      if (!(window as any).keplr) {
        throw new Error("Keplr wallet is not installed. Please install Keplr extension.");
      }

      const keplr = (window as any).keplr;
      const chainId = "injective-888"; // Injective Testnet Chain ID

      // Suggest Injective Testnet to Keplr if not registered
      try {
        await keplr.experimentalSuggestChain({
          chainId,
          chainName: "Injective Testnet",
          rpc: "https://testnet.rpc.injective.network",
          rest: "https://testnet.lcd.injective.network",
          bip44: { coinType: 60 }, // Injective uses Ethereum-style BIP44 (60)
          bech32Config: {
            bech32PrefixAccAddr: "inj",
            bech32PrefixAccPub: "injpub",
            bech32PrefixValAddr: "injvaloper",
            bech32PrefixValPub: "injvaloperpub",
            bech32PrefixConsAddr: "injvalcons",
            bech32PrefixConsPub: "injvalconspub",
          },
          currencies: [
            {
              coinDenom: "INJ",
              coinMinimalDenom: "uinj",
              coinDecimals: 18,
            },
          ],
          feeCurrencies: [
            {
              coinDenom: "INJ",
              coinMinimalDenom: "uinj",
              coinDecimals: 18,
              gasPriceStep: { low: 5000000000, average: 25000000000, high: 50000000000 },
            },
          ],
          stakeCurrency: {
            coinDenom: "INJ",
            coinMinimalDenom: "uinj",
            coinDecimals: 18,
          },
        });
      } catch (err) {
        console.warn("Chain suggestion skipped or failed:", err);
      }

      await keplr.enable(chainId);
      const offlineSigner = keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      
      if (accounts.length === 0) {
        throw new Error("No Keplr accounts found.");
      }

      const walletAddr = accounts[0].address;

      // 1. Get challenge message from backend
      const challengeRes = await axios.post(`${API_URL}/auth/challenge`, {
        walletAddress: walletAddr,
      });
      const challengeMsg = challengeRes.data.challenge;

      // 2. Sign arbitrary message via Keplr
      const signatureObj = await keplr.signArbitrary(
        chainId,
        walletAddr,
        challengeMsg
      );

      // 3. Post signature back to backend for verification
      const verifyRes = await axios.post(`${API_URL}/auth/verify`, {
        walletAddress: walletAddr,
        message: challengeMsg,
        signature: signatureObj.signature,
      });

      const { token: authToken, user: userProfile } = verifyRes.data;

      setToken(authToken);
      setWalletAddress(walletAddr);
      setUser(userProfile);
      setIsConnected(true);
      localStorage.setItem("studysprint_token", authToken);
      localStorage.setItem("studysprint_wallet", walletAddr);
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      alert(error.message || "Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setUser(null);
    setToken(null);
    setIsConnected(false);
    localStorage.removeItem("studysprint_token");
    localStorage.removeItem("studysprint_wallet");
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected,
        isConnecting,
        keplrInstalled,
        user,
        token,
        connectWallet,
        disconnectWallet,
        refreshProfile,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
