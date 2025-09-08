interface Window {
  ethereum?: any;
}

export type AddressType = `0x${string}`;

export interface CoinType {
  value?: string | null;
  fiatValue?: string | null;
  image: string;
  name: string;
  blockchainName: string;
  address: AddressType;
  isNative: boolean;
}
