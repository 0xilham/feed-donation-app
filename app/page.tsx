// app/page.tsx (final version)
"use client";
import { useState, useEffect, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useBlockNumber,
} from "wagmi";
import { CONTRACT_ADDRESS, KINDNESS_ABI } from "./contractConfig";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const CAT_FOODS = [
  {
    name: "Small Fish",
    emoji: "🐟",
    value: "0.001",
    description: "Perfect snack for a stray cat",
  },
  {
    name: "Milk Bottle",
    emoji: "🥛",
    value: "0.0025",
    description: "Classic cat favorite",
  },
  {
    name: "Chicken Bits",
    emoji: "🍗",
    value: "0.005",
    description: "Tasty protein-rich meal",
  },
  {
    name: "Salmon Feast",
    emoji: "🐠",
    value: "0.01",
    description: "Premium gourmet experience",
  },
  {
    name: "Tuna Platter",
    emoji: "🍣",
    value: "0.05",
    description: "Deluxe seafood treat",
  },
  {
    name: "Tea",
    emoji: "🍵",
    value: "1",
    description: "Premium green tea",
  },
];

// Custom error handler function
const handleContractError = (error: Error) => {
  const userRejectedErrors = [
    "User rejected",
    "User denied",
    "Request rejected",
  ];

  if (userRejectedErrors.some((e) => error.message.includes(e))) {
    toast("Transaction cancelled", {
      icon: "⚠️",
      duration: 15000, // 15 detik
    });
  } else {
    toast.error(`Transaction failed: ${error.message}`, {
      duration: 15000, // 15 detik
    });
  }
};

type TransactionHistory = {
  hash: string;
  foodName: string;
  amount: string;
  timestamp: number;
  message: string;
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [selectedFood, setSelectedFood] = useState(CAT_FOODS[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionHistory[]
  >([]);
  const notificationShownRef = useRef({
    success: false,
    error: false,
    cancelled: false,
  });
  const lastTxTimestampRef = useRef(0);

  // Watch for new blocks and refresh balance
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Read balance with auto-refresh
  const { data: treats, refetch: refetchTreats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: KINDNESS_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Write contract
  const {
    writeContract,
    isPending: isFeeding,
    error: feedError,
    data: hash,
  } = useWriteContract();

  // Wait for transaction
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Auto-refresh balance when new block is mined
  useEffect(() => {
    if (isConnected) {
      refetchTreats();
    }
  }, [blockNumber, isConnected, refetchTreats]);

  // Handle notifications and update history
  useEffect(() => {
    const now = Date.now();
    const canShowNotification = now - lastTxTimestampRef.current > 15000; // 15 detik cooldown

    if (canShowNotification) {
      if (feedError) {
        if (!notificationShownRef.current.error) {
          handleContractError(feedError);
          notificationShownRef.current = {
            success: false,
            error: true,
            cancelled: feedError?.message?.includes("User rejected") ?? false,
          };
          lastTxTimestampRef.current = now;
        }
      } else if (confirmError) {
        if (!notificationShownRef.current.error) {
          handleContractError(confirmError);
          notificationShownRef.current = {
            success: false,
            error: true,
            cancelled: confirmError?.message?.includes("User rejected") ?? false,
          };
          lastTxTimestampRef.current = now;
        }
      } else if (isConfirmed && hash) {
        if (!notificationShownRef.current.success) {
          toast.success(
            <span>
              {selectedFood.name} delivered successfully!{" "}
              <a
                href={`https://sepolia.tea.xyz/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                <br />
                View Tx
              </a>
            </span>,
            { duration: 15000 } // 15 detik
          );

          // Add to transaction history
          setTransactionHistory((prev) => [
            {
              hash: hash,
              foodName: selectedFood.name,
              amount: selectedFood.value,
              timestamp: Date.now(),
              message: message,
            },
            ...prev,
          ]);

          setMessage("");
          notificationShownRef.current = {
            success: true,
            error: false,
            cancelled: false,
          };
          lastTxTimestampRef.current = now;

          // Refresh balance after successful transaction
          refetchTreats();
        }
      }
    }

    // Reset notification flags when transaction state resets
    if (!isFeeding && !isConfirming && !hash) {
      notificationShownRef.current = {
        success: false,
        error: false,
        cancelled: false,
      };
    }
  }, [
    feedError,
    confirmError,
    isConfirmed,
    hash,
    isFeeding,
    isConfirming,
    selectedFood.name,
    message,
    refetchTreats,
    selectedFood.value,
  ]);

  const handleFeedCat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!message.trim()) {
      toast.error("Please leave a note for the cat");
      return;
    }

    try {
      // Reset notification flags when new transaction starts
      notificationShownRef.current = {
        success: false,
        error: false,
        cancelled: false,
      };
      lastTxTimestampRef.current = 0;

      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: KINDNESS_ABI,
        functionName: "sendKindness",
        args: [address, message],
        value: parseEther(selectedFood.value),
      });
    } catch (error) {
      handleContractError(error as Error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
        {/* Cat-themed header */}
        <div className="bg-gradient-to-r from-amber-400 to-pink-400 p-6 text-white relative">
          <div className="absolute -top-2 left-10 text-5xl">🐱</div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-2xl font-bold">Purrfect Donations</h1>
              <p className="mt-1 text-amber-100">
                Feed stray cats, earn Kindness NFT
              </p>
            </div>
            <ConnectButton
              accountStatus="avatar"
              chainStatus="icon"
              showBalance={true}
              label="Connect"
            />
          </div>
        </div>

        <div className="p-6">
          {isConnected ? (
            <>
              <form onSubmit={handleFeedCat} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Note for the Cat
                  </label>
                  <textarea
                    className="w-full p-4 border border-gray-200 rounded-xl transition-all duration-200"
                    placeholder="Write a sweet note to the cat..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Cat Food
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CAT_FOODS.map((food) => (
                      <button
                        key={food.name}
                        type="button"
                        onClick={() => setSelectedFood(food)}
                        className={`p-3 rounded-lg border transition-all flex flex-col items-center ${
                          selectedFood.name === food.name
                            ? "border-amber-400 bg-amber-50 shadow-inner"
                            : "border-gray-200 hover:border-amber-300 cursor-pointer"
                        }`}
                      >
                        <span className="text-2xl mb-1">{food.emoji}</span>
                        <span className="text-xs font-medium">{food.name}</span>
                        <span className="text-xs text-gray-500">
                          {food.value} TEA
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedFood.description}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isFeeding || isConfirming}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    isFeeding || isConfirming
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-lg hover:shadow-amber-200 cursor-pointer"
                  }`}
                >
                  {isFeeding || isConfirming ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Feeding...
                    </>
                  ) : (
                    `${selectedFood.emoji} Feed ${selectedFood.name}`
                  )}
                </button>
              </form>

              {/* Treats balance card with history */}
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-gradient-to-r from-amber-50 to-pink-50 rounded-xl border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Your Cat Treats
                      </p>
                      <p className="text-2xl font-bold text-amber-900 mt-1">
                        {isConnected ? Number(treats || 0) : 0}{" "}
                        <span className="text-amber-600">purrs</span>
                      </p>
                    </div>
                    <div className="text-4xl">😻</div>
                  </div>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="mt-2 text-xs text-amber-600 hover:text-amber-800 underline cursor-pointer"
                  >
                    {showHistory ? "Hide History" : "View History ⤵"}
                  </button>
                </div>

                {/* Transaction History */}
                {showHistory && (
                  <div className="p-4 bg-white rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Transaction History
                    </h3>
                    {transactionHistory.length === 0 ? (
                      <p className="text-xs text-gray-500">
                        No transactions yet
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {transactionHistory.map((tx, index) => (
                          <li
                            key={index}
                            className="text-xs border-b border-gray-100 pb-2"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">{tx.foodName}</span>
                              <span>{tx.amount} TEA</span>
                            </div>
                            <div className="text-gray-500 truncate">
                              {tx.message}
                            </div>
                            <a
                              href={`https://sepolia.tea.xyz/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-xs"
                            >
                              View on explorer
                            </a>
                            <div className="text-gray-400 text-xs mt-1">
                              {new Date(tx.timestamp).toLocaleString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-1 flex-wrap">
                <span className="text-sm font-medium text-gray-700">
                  Built by 🐱
                </span>
                <a
                  href="https://github.com/0xilham"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-green-400 hover:underline"
                >
                  NekoCrypt
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-10 space-y-6">
              <div className="inline-block p-4 bg-amber-100 rounded-full">
                <div className="text-4xl">🐾</div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600">
                Start feeding cats and earning purrs on the blockchain
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
