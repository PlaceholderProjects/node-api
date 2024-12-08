
// Auto Generated File.
// Created using Reputation CLI from True Network.
// To update the classes, use the "reputation-cli acm-prepare" at the root directory that contains "true-network".

@inline
function readMemory<T>(index: usize): T {
  return load<T>(index);
}


class ADATTESTATIONSCHEMA {
  rating: u64;

  constructor() {
    this.rating = readMemory<u64>(0);
  }
}


class CHAINACTIVITYSCHEMA {
  totalTransactions: u64;
  accountAgeDays: u64;

  constructor() {
    this.totalTransactions = readMemory<u64>(8);
    this.accountAgeDays = readMemory<u64>(16);
  }
}


export class Attestations {
  static adAttestationSchema: ADATTESTATIONSCHEMA = new ADATTESTATIONSCHEMA();
  static chainActivitySchema: CHAINACTIVITYSCHEMA = new CHAINACTIVITYSCHEMA();
}
