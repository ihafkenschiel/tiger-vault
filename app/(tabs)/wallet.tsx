import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import WalletInfo from "../../components/MockWallet/WalletInfo";
import SendTransaction from "../../components/MockWallet/SendTransaction";
import WalletController from "../../components/MockWallet/WalletController";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { parseEther } from "viem";

export default function WalletScreen() {
  const { address, isConnected } = useAccount();
  const { data: wagmiBalance } = useBalance({ address });
  const [balance, setBalance] = useState("0");
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const { sendTransaction } = useSendTransaction();

  const fetchBalance = async () => {
    if (isConnected && wagmiBalance) {
      setBalance(wagmiBalance.formatted);
    } else {
      const walletController = WalletController.getInstance();
      const controllerBalance = await walletController.getBalance();
      console.log(`Fetched balance: ${controllerBalance}`);
      setBalance(controllerBalance);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [isConnected, wagmiBalance]);

  const handleSendTransaction = async (to: string, amount: string) => {
    try {
      if (isConnected) {
        const result = await sendTransaction({
          to: to as `0x${string}`,
          value: parseEther(amount),
        });
        console.log("Transaction sent:", result);
      } else {
        const walletController = WalletController.getInstance();
        await walletController.sendTransaction(to, amount);
      }
      Alert.alert("Success", "Transaction sent successfully");
      await fetchBalance();
      forceUpdate(); // Force a re-render
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to send transaction");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Screen</Text>
      <WalletInfo />
      <Text style={styles.balance}>Balance: {balance}</Text>
      <SendTransaction onSend={handleSendTransaction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  balance: {
    fontSize: 18,
    marginVertical: 10,
  },
});
