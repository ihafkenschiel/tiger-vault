import { REACT_APP_WALLETCONNECT_PROJECT_ID } from "@env";
import { Core } from "@walletconnect/core";
import { IWeb3Wallet, Web3Wallet } from "@walletconnect/web3wallet";
import { CONFIG } from "../../config";

const PROJECT_ID = REACT_APP_WALLETCONNECT_PROJECT_ID;

class WalletController {
  private static instance: WalletController;
  private web3wallet: IWeb3Wallet | undefined;
  private balance: number = 1000; // Initial balance for demo purposes

  private constructor() {}

  public static getInstance(): WalletController {
    if (!WalletController.instance) {
      WalletController.instance = new WalletController();
    }
    return WalletController.instance;
  }

  public async initializeWallet(): Promise<IWeb3Wallet> {
    if (!this.web3wallet) {
      console.log("Initializing Web3Wallet");
      this.web3wallet = await Web3Wallet.init({
        core: new Core({
          projectId: PROJECT_ID,
        }),
        metadata: CONFIG.APP_METADATA,
      });
      console.log("Web3Wallet initialized");
    }
    return this.web3wallet;
  }

  public getWeb3Wallet(): IWeb3Wallet | undefined {
    return this.web3wallet;
  }

  public async pair(uri: string): Promise<any> {
    console.log("Attempting to pair with URI:", uri);
    const web3wallet = await this.initializeWallet();
    const result = await web3wallet.pair({ uri });
    console.log("Pairing result:", result);
    return result;
  }

  // Add more wallet functions here
  public async getAddress(): Promise<string> {
    // Implement method to get wallet address
    return "0x..."; // Placeholder
  }

  public async sendTransaction(to: string, amount: string): Promise<void> {
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      throw new Error("Invalid amount");
    }
    if (amountNumber > this.balance) {
      throw new Error("Insufficient funds");
    }

    console.log(`Sending ${amount} to ${to}`);
    console.log(`Balance before transaction: ${this.balance}`);

    this.balance -= amountNumber;

    console.log(`Balance after transaction: ${this.balance}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  public async getBalance(): Promise<string> {
    console.log(`Current balance: ${this.balance}`);
    return this.balance.toString();
  }
}

export default WalletController;
