import type { AddressType } from "../types";

export const coinOne = {
  image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
  name: "BNB",
  blockchainName: "BNB Chain",
  // Used the WBNB token for estimation purposes only, as BNB does not have a token representation
  address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" as AddressType,
  isNative: true,
};

export const coinTwo = {
  image: "https://lucrar.pt/wp-content/uploads/2022/08/COIN-36x32.png",
  name: "LCR",
  blockchainName: "BNB Chain",
  address: "0x1510211e6dc81f5724a1beca33c5ac70dcca6ce0" as AddressType,
  isNative: false,
};

export const coinFiat = {
  image: "",
  name: "USD",
  blockchainName: "BNB Chain",
  address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" as AddressType,
  isNative: false,
};

export const PANCAKE_ROUTER_ADDRESS =
  "0x10ed43c718714eb63d5aa57b78b54704e256024e";
