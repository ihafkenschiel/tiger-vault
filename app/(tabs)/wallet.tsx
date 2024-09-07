import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import WalletInfo from "../../components/MockWallet/WalletInfo";
import SendTransaction from "../../components/MockWallet/SendTransaction";
import WalletController from "../../components/MockWallet/WalletController";

export default function WalletScreen() {
  const [balance, setBalance] = useState("0");
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const fetchBalance = async () => {
    const walletController = WalletController.getInstance();
    const balance = await walletController.getBalance();
    console.log(`Fetched balance: ${balance}`);
    setBalance(balance);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleSendTransaction = async (to: string, amount: string) => {
    try {
      const walletController = WalletController.getInstance();
      await walletController.sendTransaction(to, amount);
      Alert.alert("Success", "Transaction sent successfully");
      await fetchBalance();
      forceUpdate(); // Force a re-render
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send transaction");
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
