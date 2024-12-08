import express from 'express';
import cors from 'cors';
import {fetchTransactionsByChain, fetchChainId} from './transaction/transaction'
import { TrueApi } from '@truenetworkio/sdk'
import { adAttestationSchema, chainActivitySchema } from './true-network/schemas'
import { config, getTrueNetworkInstance } from './true-network/true.config'
import {runAlgo} from '@truenetworkio/sdk/dist/pallets/algorithms/extrinsic'
import { ethers } from 'ethers';

const abi = [
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "publisher", type: "address" },
        { indexed: false, internalType: "string", name: "imageIpfsUrl", type: "string" },
        { indexed: false, internalType: "string", name: "name", type: "string" },
        { indexed: false, internalType: "string", name: "text", type: "string" },
        { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
        { indexed: false, internalType: "bool", name: "isActive", type: "bool" },
        { indexed: false, internalType: "uint256", name: "reputationScore", type: "uint256" },
      ],
      name: "AdPublished",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "publisher", type: "address" },
        { indexed: false, internalType: "string", name: "imageIpfsUrl", type: "string" },
        { indexed: false, internalType: "string", name: "name", type: "string" },
        { indexed: false, internalType: "string", name: "text", type: "string" },
        { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
        { indexed: false, internalType: "bool", name: "isActive", type: "bool" },
        { indexed: false, internalType: "uint256", name: "reputationScore", type: "uint256" },
      ],
      name: "AdStatusChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "publisher", type: "address" },
        { indexed: false, internalType: "string", name: "imageIpfsUrl", type: "string" },
        { indexed: false, internalType: "string", name: "name", type: "string" },
        { indexed: false, internalType: "string", name: "text", type: "string" },
        { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
        { indexed: false, internalType: "bool", name: "isActive", type: "bool" },
        { indexed: false, internalType: "uint256", name: "reputationScore", type: "uint256" },
      ],
      name: "ReputationScoreUpdated",
      type: "event",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "ads",
      outputs: [
        { internalType: "address", name: "publisher", type: "address" },
        { internalType: "string", name: "imageIpfsUrl", type: "string" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "text", type: "string" },
        { internalType: "uint256", name: "timestamp", type: "uint256" },
        { internalType: "bool", name: "isActive", type: "bool" },
        { internalType: "uint256", name: "reputationScore", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_adId", type: "uint256" }],
      name: "getAd",
      outputs: [
        { internalType: "address", name: "publisher", type: "address" },
        { internalType: "string", name: "imageIpfsUrl", type: "string" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "text", type: "string" },
        { internalType: "uint256", name: "timestamp", type: "uint256" },
        { internalType: "bool", name: "isActive", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllAds",
      outputs: [
        {
          components: [
            { internalType: "address", name: "publisher", type: "address" },
            { internalType: "string", name: "imageIpfsUrl", type: "string" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "text", type: "string" },
            { internalType: "uint256", name: "timestamp", type: "uint256" },
            { internalType: "bool", name: "isActive", type: "bool" },
            { internalType: "uint256", name: "reputationScore", type: "uint256" },
          ],
          internalType: "struct PlaceHolderAds.Ad[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_publisher", type: "address" }],
      name: "getPublisherAds",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_imageIpfsUrl", type: "string" },
        { internalType: "string", name: "_name", type: "string" },
        { internalType: "string", name: "_text", type: "string" },
      ],
      name: "publishAd",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "publisherAds",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_publisher", type: "address" }],
      name: "toggleAdStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_publisher", type: "address" },
        { internalType: "uint256", name: "_reputationScore", type: "uint256" },
      ],
      name: "updateReputationScore",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
const contractAddress = "0xE18148061bf2b4f404D7EaB11033f10D570b647e";
const RPC_URL = process.env.RPC_URL_BASE as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
// Define interfaces
interface AttestationData {
    publisherAddress: string;
    rating: number;
    userAddress: string;
    signature: string;
}
interface ChainData {
    totalTransactions : number,
    firstTransactionHash : string,
    firstTransactionTimestamp : Text,
    firstBlockNumber : Text,
    accountAgeDays : number,
    lastTransactionTimestamp : Text,
    lastTransactionHash : string,
    lastBlockNumber : Text,
}

interface ApiResponse {
    success: boolean;
    receivedData?: AttestationData;
    error?: string;
}

// Create Express app
const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(cors());



// Attestation endpoint
app.post('/api/attestation', async (req, res) => {
    try {
        const attestationData: AttestationData = req.body;
        
        // Log the received data
        console.log('Received attestation:', attestationData);
         // Fetch the chainId based on the publisher address
         const chainId = fetchChainId(attestationData.publisherAddress);
         console.log(`Determined chainId: ${chainId}`);
        // Fetch the transactions based on chainId
        const txInfo = await fetchTransactionsByChain(attestationData.userAddress, chainId);

        const chainActivityData = {
                totalTransactions: txInfo.totalTransactions,
                // firstTransactionHash: txInfo.firstTransactionHash,
                // firstTransactionTimestamp: txInfo.firstTransactionTimestamp,
                // firstBlockNumber: txInfo.firstBlockNumber,
                accountAgeDays: txInfo.accountAgeDays,
                // lastTransactionTimestamp: txInfo.lastTransactionTimestamp,
                // lastTransactionHash: txInfo.lastTransactionHash,
                // lastBlockNumber: txInfo.lastBlockNumber

        };

        const api = await getTrueNetworkInstance();

        const adAttestationOutput =  await adAttestationSchema.attest(api, attestationData.userAddress, {
            // publisherAddress: attestationData.publisherAddress,
            rating: attestationData.rating,
            // signature: attestationData.signature
          })

          const chainActivitySchemaOutput =  await chainActivitySchema.attest(api, attestationData.userAddress, {
           ...chainActivityData
          })

        //   const result = await getAlgorithmResult(attestationData.userAddress);
          const reputationScore = await runAlgo(api.network, config.issuer.hash, api.account, attestationData.userAddress, config.algorithm?.id!);
          console.log('reputationScore', reputationScore);

            const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
            const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
            const contract = new ethers.Contract(contractAddress, abi, wallet);
            const tx = await contract.updateReputationScore(attestationData.publisherAddress, reputationScore);
            const receipt = await tx.wait();
        //   await updatePublisherScore(attestationData.publisherAddress, reputationScore);
        //   console.log('Successfully updated reputation score');

        await api.network.disconnect()
        res.json({
            success: true,
            chainId,
            transactionInfo: txInfo,
            attestationData,
            adAttestationOutput,
            chainActivitySchemaOutput,
            reputationScore,
            hash:tx.hash
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error processing attestation:', errorMessage);
        
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

// Add a simple GET endpoint for testing
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log(`- POST http://localhost:${PORT}/api/attestation`);
    console.log(`- GET  http://localhost:${PORT}/api/health`);
});