declare module "@walletconnect/web3wallet" {
  export interface IWeb3Wallet {
    // Add any methods or properties you're using from Web3Wallet
    init(config: any): Promise<IWeb3Wallet>;
    pair(params: { uri: string }): Promise<any>;
    // Add other methods as needed
  }

  export const Web3Wallet: {
    init(config: any): Promise<IWeb3Wallet>;
  };
}

declare module "@walletconnect/core" {
  export class Core {
    constructor(opts: { projectId: string });
  }
}
