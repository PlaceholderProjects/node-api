// import { Hash, Schema, U32, U64 } from "@truenetworkio/sdk"

// export const gamePlaySchema = Schema.create({
//   score: U32,
//   durationSpent: U64,
//   treesClimbedPerDay: U64,
//   villansKilled: U32
// })

import { Schema, Hash, U64, Text, testnet } from "@truenetworkio/sdk";

// Schema for the Ad Attestation
export const adAttestationSchema = Schema.create({
    publisherAddress : Text,
    rating: U64,
    signature: Text,
});

// Schema for Chain Activity
export const chainActivitySchema = Schema.create({
    totalTransactions : U64,
    firstTransactionHash : Text,
    firstTransactionTimestamp : Text,
    firstBlockNumber : Text,
    accountAgeDays : U64,
    lastTransactionTimestamp : Text,
    lastTransactionHash : Text,
    lastBlockNumber : Text,
});
