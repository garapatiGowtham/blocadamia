import { NETWORK } from "./constants";

export const CONTRACT_ADDRESS = "0x9f5c1bc6345eeb5c7ee48e51c46143b82dbea8af58484a6d76da16164e7d7316";
export const MODULE_NAME = "blocadamia";

export const getContractAddress = () => {
  return CONTRACT_ADDRESS;
};

// Function to get the full function name for contract calls
export const getContractFunction = (functionName: string) => {
  return `${CONTRACT_ADDRESS}::${MODULE_NAME}::${functionName}`;
};

// Utility to format amount to Octas (APT * 10^8)
export const toOctas = (amount: number | string) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return Math.floor(value * 100_000_000).toString();
};

// Utility to format Octas to APT
export const fromOctas = (octas: string) => {
  return (parseInt(octas) / 100_000_000).toString();
};
