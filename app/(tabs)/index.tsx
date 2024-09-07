import React, { useState } from "react";
import { StyleSheet, TextInput, Button, Alert } from "react-native";
import { Text, View } from "../../components/Themed";
import { W3mButton, useWeb3Modal } from "@web3modal/wagmi-react-native";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useSendTransaction,
} from "wagmi";
import { parseEther } from "viem";

export default function TabOneScreen() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const {
    sendTransaction,
    data: transactionData,
    isPending: isLoading,
    isSuccess,
  } = useSendTransaction();

  const handleSend = () => {
    if (!to || !amount) {
      Alert.alert("Error", "Please enter recipient address and amount");
      return;
    }
    sendTransaction({
      to: to as `0x${string}`,
      value: parseEther(amount),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TigerVault</Text>
      <View style={styles.separator} />
      {isConnected ? (
        <>
          <Text>Connected to {address}</Text>
          <Text>
            Balance: {balance?.formatted} {balance?.symbol}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Recipient Address"
            value={to}
            onChangeText={setTo}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Button
            title="Send Transaction"
            onPress={handleSend}
            disabled={isLoading}
          />
          {isLoading && <Text>Sending transaction...</Text>}
          {isSuccess && <Text>Transaction sent successfully!</Text>}
          <Button title="Disconnect" onPress={() => disconnect()} />
        </>
      ) : (
        <W3mButton />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
