import { useWeb3ModalState } from "@web3modal/wagmi-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAccount, useChainId } from "wagmi";

const EthereumInfo: React.FC = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { open, selectedNetworkId } = useWeb3ModalState();

  const getNetworkName = (id: number | undefined) => {
    switch (id) {
      case 1:
        return "Ethereum Mainnet";
      case 11155111:
        return "Sepolia Testnet";
      default:
        return "Unknown Network";
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ethereum Network Info</Text>
      <Text>Chain ID: {chainId}</Text>
      <Text>Network Name: {getNetworkName(chainId)}</Text>
      <Text>Connected Address: {address}</Text>
      <Text>Web3Modal is open: {open ? "Yes" : "No"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default EthereumInfo;
