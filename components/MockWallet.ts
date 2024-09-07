import { Core } from "@walletconnect/core";
import { Web3Wallet, IWeb3Wallet } from "@walletconnect/web3wallet";

class MockWallet {
  private static instance: MockWallet;
  private web3wallet: IWeb3Wallet | undefined;

  private constructor() {}

  public static getInstance(): MockWallet {
    if (!MockWallet.instance) {
      MockWallet.instance = new MockWallet();
    }
    return MockWallet.instance;
  }

  public async initializeWallet(): Promise<IWeb3Wallet> {
    if (!this.web3wallet) {
      console.log("Initializing Web3Wallet");
      this.web3wallet = await Web3Wallet.init({
        core: new Core({
          projectId: "eb8227497ee1c71f4b99dcf36597ced3",
        }),
        metadata: {
          name: "Mock Test Wallet",
          description: "A mock wallet for testing",
          url: "https://mockwallet.example",
          icons: ["https://mockwallet.example/icon.png"],
        },
      });
      console.log("Web3Wallet initialized");
    }
    return this.web3wallet;
  }

  public getWeb3Wallet() {
    return this.web3wallet;
  }

  public async pair(uri: string) {
    console.log("Attempting to pair with URI:", uri);
    const web3wallet = await this.initializeWallet();
    const result = await web3wallet.pair({ uri });
    console.log("Pairing result:", result);
    return result;
  }
}

export default MockWallet;
