
// Auto Generated File.
// Created using Reputation CLI from True Network.
// To update the classes, use the "reputation-cli acm-prepare" at the root directory that contains "true-network".

@inline
function readMemory<T>(index: usize): T {
  return load<T>(index);
}


class ADATTESTATIONSCHEMA {
  signature: string;
  rating: u64;

  constructor() {
    this.signature = readMemory<string>(0);
    this.rating = readMemory<u64>(32);
  }
}


class CHAINACTIVITYSCHEMA {
  transactionCount: u64;
  totalValue: u64;
  lastActivity: u64;
  firstActivity: u64;

  constructor() {
    this.transactionCount = readMemory<u64>(40);
    this.totalValue = readMemory<u64>(48);
    this.lastActivity = readMemory<u64>(56);
    this.firstActivity = readMemory<u64>(64);
  }
}


class MULTICHAINREPUTATIONSCHEMA {
  relatedChainsScore: u64;
  primaryChainScore: u64;

  constructor() {
    this.relatedChainsScore = readMemory<u64>(72);
    this.primaryChainScore = readMemory<u64>(80);
  }
}


export class Attestations {
  static adAttestationSchema: ADATTESTATIONSCHEMA = new ADATTESTATIONSCHEMA();
  static chainActivitySchema: CHAINACTIVITYSCHEMA = new CHAINACTIVITYSCHEMA();
  static multiChainReputationSchema: MULTICHAINREPUTATIONSCHEMA = new MULTICHAINREPUTATIONSCHEMA();
}
