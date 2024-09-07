import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { Text } from "./Themed";

export default function WalletConnect() {
  const { open, isConnected, address, provider } = useWalletConnectModal();

  const handleConnect = React.useCallback(() => {
    if (isConnected) {
      provider?.disconnect();
    } else {
      open();
    }
  }, [open, isConnected, provider]);

  return (
    <View style={styles.container}>
      <Button
        title={isConnected ? "Disconnect" : "Connect a wallet"}
        onPress={handleConnect}
      />
      {isConnected && address && <Text>Connected to: {address}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});
