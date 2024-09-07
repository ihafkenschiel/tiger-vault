import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useSendTransaction,
} from "wagmi";
import EthereumInfo from "../../components/EthereumInfo";
import SendTransaction from "../../components/MockWallet/SendTransaction";
import WalletController from "../../components/MockWallet/WalletController";
import WalletInfo from "../../components/MockWallet/WalletInfo";

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
  const { selectedNetworkId } = useWeb3ModalState();

  const fetchBalance = async () => {
    try {
      if (isConnected && !useMockWallet) {
        setBalance(wagmiBalance?.formatted || "0");
      } else if (useMockWallet) {
        const walletController = WalletController.getInstance();
        const controllerBalance = await walletController.getBalance();
        setBalance(controllerBalance);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch balance",
      });
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
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Transaction sent successfully",
        });
      } else if (useMockWallet) {
        const walletController = WalletController.getInstance();
        await walletController.sendTransaction(to, amount);
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
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Mock transaction sent successfully",
        });
      }
      await fetchBalance();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Failed to send transaction",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      if (useMockWallet) {
        const walletController = WalletController.getInstance();
        await walletController.initializeWallet();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Mock wallet connected",
        });
      } else {
        await open();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Failed to connect wallet",
      });
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      if (useMockWallet) {
        setBalance("0");
        setTransactions([]);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Mock wallet disconnected",
        });
      } else {
        await disconnect();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Wallet disconnected",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Failed to disconnect wallet",
      });
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
      <Text>Selected Network ID: {selectedNetworkId}</Text>
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
          {!useMockWallet && <EthereumInfo />}
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
