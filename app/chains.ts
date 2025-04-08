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
    default: {
      http: [
        "https://tea-sepolia.g.alchemy.com/v2/L-44yy11gjQt3ZvowblQi2bvo9sp12D_",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "TeaExplorer",
      url: "https://sepolia.tea.xyz",
    },
  },
  testnet: true,
};
