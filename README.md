## Placeholder
TRUE Network for giving on-chain attestations for Ad publishers from users and providing a reputation score from ACM.


## Installation

Install the Reputation CLI:
npm i -g reputation-cli

## Integrating True Network Project
Run the following command in the existing Node.JS or Next.JS project:
reputation-cli init


## Registering Issuer On-Chain
reputation-cli register


## Running the application
npm run start

# Ad Attestation-Reputation System
## Overview

The **Ad Attestation-Reputation System** is a robust framework designed to evaluate and rank ad publishers based on their credibility and on-chain activities within the **TrueNetwork** ecosystem. By leveraging attestations and blockchain activity metrics, the system ensures a fair and transparent reputation scoring mechanism, promoting trustworthiness and engagement among ad publishers.

## Features

- **Dual Schema Integration**: Combines ad attestations with on-chain activity data to provide a comprehensive reputation score.

## Architecture

The system is built using **AssemblyScript**, interfacing with the **TrueNetwork**. It comprises two primary schemas to capture relevant data points:

1. **Ad Attestation Schema**: Captures ratings and signatures from attestations.
2. **Chain Activity Schema**: Monitors blockchain interactions such as transaction counts and account age.

The reputation score is computed by integrating data from both schemas, ensuring that user ratings are weighted appropriately based on their blockchain engagement.

## Schemas

### Ad Attestation Schema

Defines the structure for ad attestations, capturing essential information about ad publishers.


export const adAttestationSchema = Schema.create({
    publisherAddress: Text,
    rating: U64,
    signature: Text,
});



### chainActivitySchema 
 
export const chainActivitySchema = Schema.create({
    totalTransactions: U64,
    firstTransactionHash: Text,
    firstTransactionTimestamp: Text,
    firstBlockNumber: Text,
    accountAgeDays: U64,
    lastTransactionTimestamp: Text,
    lastTransactionHash: Text,
    lastBlockNumber: Text,
});

### Reputation Calculation Algorithm
The reputation score is calculated by integrating the ad rating with on-chain activity metrics, applying quadratic principles to balance the influence of each factor.


### Formula

Rating (rating): Base score from ad attestations (e.g., 1 to 5 stars).
Total Transactions (totalTransactions): Reflects user engagement; square root reduces the impact of high transaction counts.
Account Age in Days (accountAgeDays): Promotes reliability by valuing longer-standing accounts; logarithm smoothens growth.
Normalization: Divides the sum of the square root and logarithm by 2 to maintain a balanced range.




