import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@walletconnect/react-native-compat";
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from "@web3modal/wagmi-react-native";
import { WagmiProvider } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { CONFIG } from "../config";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Use the existing project ID
const projectId = "eb8227497ee1c71f4b99dcf36597ced3";

// 2. Use the existing metadata
const metadata = {
  name: "TigerVault",
  description: "A Web3 wallet for testing",
  url: "https://tigerbytestudio.com/tiger-vault",
  icons: [
    "https://blog.tigerbytestudio.com/wp-content/uploads/2023/11/TigerByteStudio-Logo-Clear-1-e1699342643644.png",
  ],
};

const chains = [mainnet, polygon, arbitrum] as const;

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: CONFIG.WALLET_CONNECT_PROJECT_ID ?? "",
  metadata: CONFIG.APP_METADATA,
});

// 3. Create modal
export const customWallets = [
  {
    id: "mockWallet",
    name: "Mock Test Wallet",
    homepage: "https://mockwallet.example",
    image_url: "https://mockwallet.example/icon.png",
    mobile_link: "tiger-vault://wc",
    webapp_link: "https://mockwallet.example",
  },
];

createWeb3Modal({
  projectId: CONFIG.WALLET_CONNECT_PROJECT_ID ?? "",
  wagmiConfig,
  defaultChain: mainnet,
  enableAnalytics: true,
  customWallets: customWallets,
  featuredWalletIds: ["mockWallet"],
  includeWalletIds: ["mockWallet"],
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Web3Modal />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
