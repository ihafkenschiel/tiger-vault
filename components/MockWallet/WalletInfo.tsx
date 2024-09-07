import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import WalletController from "./WalletController";

const WalletInfo: React.FC = () => {
  const [walletStatus, setWalletStatus] = useState("Disconnected");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const checkWalletStatus = async () => {
      const wallet = await WalletController.getInstance().initializeWallet();
      if (wallet) {
        setWalletStatus("Connected");
        // Get the wallet address (this is a placeholder, implement the actual method)
        // setAddress(await wallet.getAddress());
      }
    };
    checkWalletStatus();
  }, []);

  return (
    <View>
      <Text>Wallet Status: {walletStatus}</Text>
      {address && <Text>Address: {address}</Text>}
    </View>
  );
};

export default WalletInfo;
