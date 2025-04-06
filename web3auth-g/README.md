# Web3Auth (React Application)

This container provides the blockchain authentication and certification interface.

## Features

- **Web3Auth Integration**: Secure blockchain wallet authentication
- **Smart Contract Interaction**: Interact with the TestEvaluator contract
- **Certificate Management**: View and verify blockchain certificates
- **User Profile**: Display wallet and certification information
- **SIWE (Sign-In With Ethereum)**: Cryptographically secure authentication

## Technology Stack

- **React**: Frontend library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next generation frontend tooling
- **Web3Auth**: Blockchain wallet authentication
- **ethers.js**: Ethereum blockchain interaction
- **Tailwind CSS**: Utility-first CSS framework

## Architecture

The application consists of several components:

- `App.tsx`: Main application component and routing
- `components/`: UI components (buttons, forms, etc.)
- `pages/`: Page components (HomePage, Certificate, etc.)
- `services/`: Service functions for Web3Auth and blockchain interactions
- `config/`: Configuration files for Web3Auth and smart contracts
- `smartContract.sol`: TestEvaluator contract definition

## Smart Contract

The application interacts with the TestEvaluator smart contract which:
- Manages exam sessions
- Records exam results
- Issues blockchain certificates
- Verifies certification status

## Docker Configuration

The React application runs in a Docker container with:
- Node.js 20 Alpine as the base image
- Vite dev server on port 5173 (mapped to 8503)
- Volume mounted app directory for development

## Environment Variables

The application uses the following environment variables:
- `VITE_DEV_SERVER_HOST`: Host for the Vite dev server (0.0.0.0)
- `VITE_DEV_SERVER_PORT`: Port for the Vite dev server (5173)

## Usage

The Web3Auth container will be started automatically with the `run.sh restart-project` command.

Access the Web3Auth UI at: http://localhost:8503

## Web3Auth Configuration

The application uses Web3Auth for secure blockchain wallet authentication:
- Multiple authentication options (social logins, email, etc.)
- Customizable UI
- Supports mainstream wallets and EIP-1193 compliant providers

## Dependencies

Key dependencies include:
```json
{
  "@web3auth/auth-adapter": "^9.7.0",
  "@web3auth/base": "^9.7.0",
  "@web3auth/ethereum-provider": "^9.7.0",
  "@web3auth/modal": "^9.7.0",
  "@web3auth/modal-react-hooks": "^9.7.0",
  "ethers": "^6.13.2",
  "react": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "siwe": "^3.0.0",
  "web3": "^4.13.0"
}
```

See `package.json` for the complete list of dependencies.

## Important Links

- [Web3Auth Website](https://web3auth.io)
- [Web3Auth Documentation](https://web3auth.io/docs)
- [Web3Auth SDK References](https://web3auth.io/docs/sdk)