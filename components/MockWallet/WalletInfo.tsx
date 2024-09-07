import React from "react";
import { View, Text } from "react-native";
import { useAccount } from "wagmi";
import WalletController from "./WalletController";

interface WalletInfoProps {
  useMockWallet: boolean;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ useMockWallet }) => {
  const { address, isConnected } = useAccount();

  const getWalletStatus = () => {
    if (useMockWallet) {
      return WalletController.getInstance().getWeb3Wallet()
        ? "Connected"
        : "Disconnected";
    }
    return isConnected ? "Connected" : "Disconnected";
  };

  const getWalletAddress = () => {
    if (useMockWallet) {
      return "Mock Wallet Address";
    }
    return address || "Not connected";
  };

  return (
    <View>
      <Text>Wallet Status: {getWalletStatus()}</Text>
      <Text>Address: {getWalletAddress()}</Text>
    </View>
  );
};

export default WalletInfo;
