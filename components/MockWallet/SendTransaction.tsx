import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface SendTransactionProps {
  onSend: (to: string, amount: string) => Promise<void>;
  isLoading: boolean; // Add this line
}

const SendTransaction: React.FC<SendTransactionProps> = ({
  onSend,
  isLoading,
}) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = async () => {
    if (!to || !amount) {
      Alert.alert("Error", "Please enter both recipient address and amount");
      return;
    }
    console.log(`Sending ${amount} to ${to}`);
    await onSend(to, amount);
    setTo("");
    setAmount("");
  };

  return (
    <View style={styles.container}>
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
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button title="Send" onPress={handleSend} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default SendTransaction;
