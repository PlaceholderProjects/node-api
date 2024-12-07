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
    rating: Date;
    userAddress: string;
    signature: string;

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

        const api = await getTrueNetworkInstance();

        // const output =  await adAttestationSchema.attest(api, attestationData.userAddress, {
        //     rating: attestationData.rating,
        //     signature: '0x626de3958ca7d11cfba36f22c6967309789fd75d6abf159f0ced0f4b0ae42957'
        //   })
        
        res.json({
            success: true,
            chainId,
            transactionInfo: txInfo,
            attestationData
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