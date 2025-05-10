# Feed Donation DApp

Welcome to the **Feed Donation DApp**! This is the web application for the Purrfect Donations project, a Web3 crowdfunding platform designed to enable cat food donations with transparency and blockchain-based security. 🐾✨

## Features

- **Donation System**: Users can donate funds and leave messages for recipients.
- **Blockchain Integration**: Interacts seamlessly with the deployed smart contract.
- **NFT Minting**: Every donation is represented by a unique "Kindness Certificate" NFT.
- **Transaction History**: Displays donation history stored on the blockchain.

## Smart Contract Integration

This DApp uses the smart contract implemented in the [Feed Donation Smart Contract repository](https://github.com/0xilham/feed-donation-smartcontract). The contract is deployed on the Sepolia testnet and manages the core functionalities, such as minting NFTs and handling donations securely.

### Contract Details

- **Repository**: [Feed Donation Smart Contract](https://github.com/0xilham/feed-donation-smartcontract)
- **Deployed Address**: [0x27031B89BEEfEbA582D16DCD00969875a207eC8F](https://sepolia.tea.xyz/address/0x27031B89BEEfEbA582D16DCD00969875a207eC8F)

## Getting Started

Follow these instructions to set up and run the DApp locally.

### Prerequisites

- Node.js and npm installed
- Metamask or any Ethereum wallet
- Sepolia testnet credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0xilham/feed-donation-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd feed-donation-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Go to a `app/contractConfig.ts` file in the directory.
2. Add your contract address value the following variables:

   ```typescript
   CONTRACT_ADDRESS = "your_contract_address";
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

## Deployment

The application is deployed at [https://feed-donation.vercel.app/](https://feed-donation.vercel.app/).

## Technologies Used

- **Frontend**: Next.js, Tailwind CSS
- **Blockchain Libraries**: wagmi, viem, RainbowKit
- **Backend**: Smart Contract Solidity (OpenZeppelin)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

## DApp Information

- **Name**: Purrfect Donations
- **Type**: Web3 Crowdfunding
- **Demo**: [https://feed-donation.vercel.app](https://feed-donation.vercel.app)
- **Contract Address**: [https://sepolia.tea.xyz/address/0x27031B89BEEfEbA582D16DCD00969875a207eC8F](https://sepolia.tea.xyz/address/0x27031B89BEEfEbA582D16DCD00969875a207eC8F)

## About the Author

- **Name**: Ilham Nur Hermawan
- **Contributor**: [Tea Protocol](https://tea.xyz)
- **Contact Discord**: [NekoCrypt](https://discord.com/users/356814179925098518)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
