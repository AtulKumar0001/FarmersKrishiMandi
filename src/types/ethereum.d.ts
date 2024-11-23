export interface MetaMaskEthereumProvider {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (eventName: string, handler: (message: string) => void) => void;
    removeListener: (eventName: string, handler: (message: string) => void) => void;
    isMetaMask?: boolean;
  }
  
  declare global {
    interface Window {
      ethereum?: MetaMaskEthereumProvider;
    }
  }