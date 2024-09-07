import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { W3mButton, useWeb3Modal } from "@web3modal/wagmi-react-native";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { Button } from "react-native";

export default function TabOneScreen() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

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
});
