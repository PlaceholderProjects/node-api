import { ethers } from 'ethers';
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()
import {runAlgo} from '@truenetworkio/sdk/dist/pallets/algorithms/extrinsic'
import { config, getTrueNetworkInstance } from '../true-network/true.config'
interface chainInfo{
    chainId : number
}
// Define interfaces
interface TransactionInfo {
    totalTransactions: number;
    // accountBalance: string;
    // firstTransaction?: Transaction;
    // lastTransaction?: Transaction;
}

interface Transaction {
    hash: string;
    timestamp: number;
    value: string;
    from: string;
    to: string;
}

interface ChainConfig {
    name: string;
    rpcUrl: string;
    explorerUrl: string;
}

// Chain configurations
const chainConfigs: Record<number, ChainConfig> = {
    1: {
        name: 'Ethereum',
        rpcUrl: `https://young-dimensional-haze.quiknode.pro/${process.env.RPC_ETHEREUM}`,
        explorerUrl: 'https://api.etherscan.io/api'
    },
    2: {
        name: 'Polygon',
        rpcUrl: 'https://polygon-rpc.com',
        explorerUrl: 'https://api.polygonscan.com/api'
    },
    3: {
        name: 'BSC',
        rpcUrl: 'https://bsc-dataseed.binance.org',
        explorerUrl: 'https://api.bscscan.com/api'
    },
    4: {
        name: 'Arbitrum',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        explorerUrl: 'https://api.arbiscan.io/api'
    },
    5: {
        name: 'Default Chain',
        rpcUrl: 'YOUR-DEFAULT-RPC',
        explorerUrl: 'YOUR-DEFAULT-EXPLORER'
    }
};


// Function to determine chainId based on publisher address
function fetchChainId(publisherAddress: string): number {
    const address1 = '0x5a0AC559B917CF10fC40EA8484AEccA303a599cC'; 

    const publisherAddr = publisherAddress.toLowerCase();

    switch (publisherAddr) {
        case address1.toLowerCase():
            return 1; // Ethereum
        case '0x5678...'.toLowerCase(): // Replace with actual address
            return 2; // Polygon
        case '0x9abc...'.toLowerCase(): // Replace with actual address
            return 3; // BSC
        case '0xdef0...'.toLowerCase(): // Replace with actual address
            return 4; // Arbitrum
        default:
            return 5; // Default chain
    }
}

async function getAlgorithmResult (userWallet: string): Promise<number> {
    const api = await getTrueNetworkInstance();
    const result = await runAlgo(api.network, config.issuer.hash, api.account, userWallet, config.algorithm?.id!);
    return result;
  }


// Function to fetch transactions based on chainId
async function fetchTransactionsByChain(userAddress: string, chainId: number): Promise<any> {
    const config = chainConfigs[chainId];

    if (!config) {
        throw new Error(`Chain configuration not found for chainId: ${chainId}`);
    }

    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

    try {
        const baseURL = 'https://api.etherscan.io/api';

        // Get normal transactions
        const txListResponse = await axios.get(baseURL, {
            params: {
                module: 'account',
                action: 'txlist',
                address: userAddress,
                startblock: '0',
                endblock: '99999999',
                sort: 'asc',
                apikey: `${process.env.ETHERSCAN_APIKEY}`
            }
        });

        // Get transactions and validate response
        const transactions = txListResponse.data.result;
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return {
                totalTransactions: 0,
                accountAge: null,
                accountAgeDays: 0,
                lastTransactionDate: null
            };
        }

        const firstTx = transactions[0];
        const lastTx = transactions[transactions.length - 1];
        const totalTxCount = transactions.length;
        
        // Calculate account age in days
        const firstTxDate = new Date(firstTx.timeStamp * 1000);
        const currentDate = new Date();
        const accountAgeDays = Math.floor((currentDate.getTime() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24));

        // Format last transaction date
        const lastTxDate = new Date(lastTx.timeStamp * 1000);
        
        return {
            totalTransactions: totalTxCount,
            firstTransactionHash: firstTx.hash,
            firstTransactionTimestamp: firstTxDate.toISOString(),
            firstBlockNumber: firstTx.blockNumber,
            accountAgeDays,
            lastTransactionTimestamp: lastTxDate.toISOString(),
            lastTransactionHash: lastTx.hash,
            lastBlockNumber: lastTx.blockNumber
        };
    } catch (error) {
        console.error('Error details:', error);
        throw new Error(`Error fetching transactions for ${config.name}: ${error}`);
    }
}


// Export the functions and interfaces
export {
    fetchChainId,
    fetchTransactionsByChain,
    getAlgorithmResult,
    TransactionInfo,
    Transaction,
    ChainConfig
};