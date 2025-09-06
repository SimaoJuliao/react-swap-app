import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { bsc } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Lucrar Swap App",
  projectId: "9179ac4a77b1bebb263074ccaea63556",
  chains: [bsc],
  transports: {
    [bsc.id]: http("https://bsc-dataseed1.defibit.io/"), // BSC mainnet
  },
  ssr: false,
});

const queryClient = new QueryClient();

export const WagmiProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
