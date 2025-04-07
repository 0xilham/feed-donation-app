// app/chains.ts
import { Chain } from "viem";

export const teaSepolia: Chain = {
  id: 10218,
  name: "Tea Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "TEA",
    symbol: "TEA",
  },
  rpcUrls: {
    default: { http: ["https://tea-sepolia.g.alchemy.com/public"] },
  },
  blockExplorers: {
    default: {
      name: "TeaExplorer",
      url: "https://sepolia.tea.xyz",
    },
  },
  testnet: true,
};
