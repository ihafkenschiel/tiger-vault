import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { W3mButton } from "@web3modal/wagmi-react-native";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TigerVault</Text>
      <View style={styles.separator} />
      <W3mButton />
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
