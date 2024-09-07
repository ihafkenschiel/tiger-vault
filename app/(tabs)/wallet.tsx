import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import WalletInfo from "../../components/MockWallet/WalletInfo";
import SendTransaction from "../../components/MockWallet/SendTransaction";
import WalletController from "../../components/MockWallet/WalletController";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useDisconnect,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { useWeb3Modal } from "@web3modal/wagmi-react-native";

interface Transaction {
  hash: string;
  to: string;
  from: string;
  value: string;
  timestamp: number;
}

export default function WalletScreen() {
  const { address, isConnected } = useAccount();
  const { data: wagmiBalance, isLoading: isBalanceLoading } = useBalance({
    address,
  });
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockWallet, setUseMockWallet] = useState(false);

  const { sendTransaction } = useSendTransaction();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const fetchBalance = async () => {
    if (isConnected && !useMockWallet) {
      setBalance(wagmiBalance?.formatted || "0");
    } else if (useMockWallet) {
      const walletController = WalletController.getInstance();
      const controllerBalance = await walletController.getBalance();
      setBalance(controllerBalance);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [isConnected, wagmiBalance, useMockWallet]);

  const handleSendTransaction = async (to: string, amount: string) => {
    setIsLoading(true);
    try {
      if (isConnected && !useMockWallet) {
        const result = await sendTransaction({
          to: to as `0x${string}`,
          value: parseEther(amount),
        });
        console.log("Transaction sent:", result);
        // Add the transaction to the list
        setTransactions((prev: any) => [
          {
            hash: result,
            to,
            from: address || "",
            value: amount,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      } else if (useMockWallet) {
        const walletController = WalletController.getInstance();
        await walletController.sendTransaction(to, amount);
        // Add the mock transaction to the list
        setTransactions((prev) => [
          {
            hash: `mock-${Date.now()}`,
            to,
            from: "MockWallet",
            value: amount,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      }
      Alert.alert("Success", "Transaction sent successfully");
      await fetchBalance();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to send transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    if (useMockWallet) {
      // Connect mock wallet
      const walletController = WalletController.getInstance();
      await walletController.initializeWallet();
    } else {
      // Open Web3Modal
      await open();
    }
  };

  const handleDisconnectWallet = async () => {
    if (useMockWallet) {
      // Disconnect mock wallet
      setBalance("0");
      setTransactions([]);
    } else {
      // Disconnect real wallet
      await disconnect();
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text>To: {item.to}</Text>
      <Text>From: {item.from}</Text>
      <Text>Amount: {formatEther(BigInt(item.value))} ETH</Text>
      <Text>Date: {new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setUseMockWallet(!useMockWallet)}
      >
        <Text>{useMockWallet ? "Use Real Wallet" : "Use Mock Wallet"}</Text>
      </TouchableOpacity>
      {isConnected || useMockWallet ? (
        <>
          <WalletInfo useMockWallet={useMockWallet} />
          {isBalanceLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text style={styles.balance}>Balance: {balance} ETH</Text>
          )}
          <SendTransaction
            onSend={handleSendTransaction}
            isLoading={isLoading}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleDisconnectWallet}
          >
            <Text>Disconnect Wallet</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Transaction History</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.hash}
            style={styles.transactionList}
          />
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleConnectWallet}>
          <Text>Connect Wallet</Text>
        </TouchableOpacity>
      )}
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
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  transactionList: {
    marginTop: 10,
  },
  transactionItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
});
