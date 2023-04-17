import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import { NetworkUserConfig } from "hardhat/types";

const namedAccounts = {
  deployer: {
    default: 0,
    1: 0,
    3: 0,
    4: 0,
    5: 0,
    42: 0
  }
}

const config: HardhatUserConfig & {
  namedAccounts: {
    deployer: number;
  }
} = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    hyperspace: {
      url: "https://nd-100-754-541.p2pify.com/a75393e00bc50ce41ad2203683d34e70/rpc/v0",
      accounts: {
        mnemonic: "0x838F7871A1794A244bEfF83f4523ed01Df6728CC"
      }
    }
  },
  etherscan: {
    apiKey: "Y3QNKJW7Y112JB6TTR5MV5H4YTDQEFYJN7Z"
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v5"
  },
  tasks: {
    deploy: {
      defaultNetwork: "hardhat",
      // add your deploy task here
    }
  },
  namedAccounts: {
    deployer: 0
  },
  ...namedAccounts
};

export default config;
