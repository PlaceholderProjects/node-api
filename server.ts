import express from 'express';
import cors from 'cors';
import {fetchTransactionsByChain, fetchChainId} from './transaction/transaction'
import { TrueApi } from '@truenetworkio/sdk'
import { adAttestationSchema, chainActivitySchema } from './true-network/schemas'
import { config, getTrueNetworkInstance } from './true-network/true.config'
import {runAlgo} from '@truenetworkio/sdk/dist/pallets/algorithms/extrinsic'



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
                firstTransactionHash: txInfo.firstTransactionHash,
                firstTransactionTimestamp: txInfo.firstTransactionTimestamp,
                firstBlockNumber: txInfo.firstBlockNumber,
                accountAgeDays: txInfo.accountAgeDays,
                lastTransactionTimestamp: txInfo.lastTransactionTimestamp,
                lastTransactionHash: txInfo.lastTransactionHash,
                lastBlockNumber: txInfo.lastBlockNumber

        };

        const api = await getTrueNetworkInstance();

        const adAttestationOutput =  await adAttestationSchema.attest(api, attestationData.userAddress, {
            publisherAddress: attestationData.publisherAddress,
            rating: attestationData.rating,
            signature: attestationData.signature
          })

          const chainActivitySchemaOutput =  await chainActivitySchema.attest(api, attestationData.userAddress, {
           ...chainActivityData
          })


  

  // Make sure to disconnect the network after operation(s) is done.
  await api.network.disconnect()
        res.json({
            success: true,
            chainId,
            transactionInfo: txInfo,
            attestationData,
            adAttestationOutput,
            chainActivitySchemaOutput
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