import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { useWeb3Modal } from "@web3modal/wagmi-react-native";
import { Pressable } from "react-native";

export default function TabOneScreen() {
  const { open } = useWeb3Modal();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Pressable onPress={() => open()}>
        <Text>Connect Wallet</Text>
      </Pressable>
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
});
