import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import MockWallet from "../MockWallet";

const WalletConnect: React.FC = () => {
  const [uri, setUri] = useState("");

  const handleConnect = async () => {
    try {
      const result = await MockWallet.getInstance().pair(uri);
      console.log("Pairing result:", result);
      // Handle successful pairing
    } catch (error) {
      console.error("Pairing error:", error);
      // Handle pairing error
    }
  };

  return (
    <View>
      <TextInput
        value={uri}
        onChangeText={setUri}
        placeholder="Enter WalletConnect URI"
      />
      <Button title="Connect" onPress={handleConnect} />
    </View>
  );
};

export default WalletConnect;
