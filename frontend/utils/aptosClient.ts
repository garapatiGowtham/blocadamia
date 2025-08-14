import { NETWORK, APTOS_API_KEY } from "@/constants";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Configure network settings
const getNetworkConfig = () => {
  switch (NETWORK) {
    case "mainnet":
      return Network.MAINNET;
    case "testnet":
      return Network.TESTNET;
    case "devnet":
      return Network.DEVNET;
    default:
      return Network.TESTNET;
  }
};

// Create Aptos client with fallback options
const createAptosClient = () => {
  try {
    const config = new AptosConfig({ 
      network: getNetworkConfig(),
      clientConfig: APTOS_API_KEY ? { API_KEY: APTOS_API_KEY } : undefined,
      // Add fallback nodes
      fullnode: NETWORK === "testnet" 
        ? "https://fullnode.testnet.aptoslabs.com/v1"
        : undefined,
    });
    return new Aptos(config);
  } catch (error) {
    console.error("Failed to create Aptos client:", error);
    throw error;
  }
};

const aptos = createAptosClient();

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}
