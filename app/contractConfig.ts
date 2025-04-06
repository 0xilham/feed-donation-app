// app/contractConfig.ts
export const CONTRACT_ADDRESS = "0x27031B89BEEfEbA582D16DCD00969875a207eC8F";
export const KINDNESS_ABI = [
  {
    inputs: [
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "string", name: "message", type: "string" },
    ],
    name: "sendKindness",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
