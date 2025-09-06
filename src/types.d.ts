interface Window {
  ethereum?: any;
}

export type AddressType = `0x${string}`;

export interface Coin {
  value?: string | null;
  image: string;
  name: string;
  blockchainName: string;
  address: AddressType;
}