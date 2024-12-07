// import { Hash, Schema, U32, U64 } from "@truenetworkio/sdk"

// export const gamePlaySchema = Schema.create({
//   score: U32,
//   durationSpent: U64,
//   treesClimbedPerDay: U64,
//   villansKilled: U32
// })

import { Schema, Hash, U64, Text } from "@truenetworkio/sdk";

// Schema for the Ad Attestation
export const adAttestationSchema = Schema.create({
    rating: U64,
    signature: Hash,
    
});

// Schema for Chain Activity
export const chainActivitySchema = Schema.create({
    transactionCount: U64,
    totalValue: U64,
    lastActivity: U64,
    firstActivity: U64,
});

// Schema for Multi-Chain Reputation
export const multiChainReputationSchema = Schema.create({
    primaryChainScore: U64,
    relatedChainsScore: U64,
});

