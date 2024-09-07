import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@walletconnect/react-native-compat";
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from "@web3modal/wagmi-react-native";
import { WagmiProvider } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

import "@walletconnect/react-native-compat";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "eb8227497ee1c71f4b99dcf36597ced3";

// 2. Create config
const metadata = {
  name: "TigerVault Web3 Wallet",
  description: "TigerVault Web3 Wallet Example",
  url: "https://tigerbytestudio.com",
  icons: ["https://www.tigerbytestudio.com/images/logo.svg"],
  redirect: {
    native: "tiger-vault://",
    universal: "https://tigerbytestudio.com",
  },
};

const chains = [mainnet, polygon, arbitrum] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({
  projectId,
  wagmiConfig,
  defaultChain: mainnet, // Optional
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        // Rest of your app...
        <Web3Modal />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
