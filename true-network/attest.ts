// import { U32, U64 } from '@truenetworkio/sdk'
// import { gamePlaySchema } from './schemas'
// import { getTrueNetworkInstance } from './true-network/true.config'

// const attestGamePlayToUser = async () => {
//   const api = await getTrueNetworkInstance()
// // console.log('API', api);

//   // Solana User's Address.
//   const solanaUserWallet = 'Ap67uX5zrvVAEt5TuFnk9J2w8fFZpht9FAtTdhxViViM'

//   // Ethereum User's Address.
//   const ethereumUserWallet = '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97'

//   // Polkadot User's Address.
//   const polkadotUserWallet = '5DHrzaEFnNrwhMy4LqRs43zp8rNAhaEhXNqNMZ9bpZZevCqE'

//   const output = await gamePlaySchema.attest(api, ethereumUserWallet, {
//     score: 5,
//     durationSpent: 11,
//     treesClimbedPerDay: 23,
//     villansKilled: 3
//   })

//   // Output is usually the transaction hash for verification on-chain.
//   console.log(output)

//   // Make sure to disconnect the network after operation(s) is done.
//   await api.network.disconnect()
// }

// attestGamePlayToUser()

import { TrueApi } from '@truenetworkio/sdk'
import { adAttestationSchema, chainActivitySchema, multiChainReputationSchema } from './schemas'
import { config, getTrueNetworkInstance } from './true.config'


import {runAlgo} from '@truenetworkio/sdk/dist/pallets/algorithms/extrinsic'



export const getAlgorithmResult = async (api: TrueApi, userWallet: string) => {
  if (config.algorithm?.id) return;
  const result = await runAlgo(api.network, config.issuer.hash, api.account, userWallet, config.algorithm?.id!);
  return result;
}

const main = async () => {
  const api = await getTrueNetworkInstance()

  // Solana User's Address.
  const solanaUserWallet = 'Ap67uX5zrvVAEt5TuFnk9J2w8fFZpht9FAtTdhxViViM'

  // Ethereum User's Address.
  const ethereumUserWallet = '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97'

  // Polkadot User's Address.
  const polkadotUserWallet = '5DHrzaEFnNrwhMy4LqRs43zp8rNAhaEhXNqNMZ9bpZZevCqE'

 const output1=  await adAttestationSchema.attest(api, polkadotUserWallet, {
    rating: 3,
    signature: '0x626de3958ca7d11cfba36f22c6967309789fd75d6abf159f0ced0f4b0ae42957'
  })

  const output2= await chainActivitySchema.attest(api, polkadotUserWallet, {
    transactionCount: 124,
    totalValue: 140,
    lastActivity: 1,
    firstActivity: 1,
  })

  const output3 = await multiChainReputationSchema.attest(api, polkadotUserWallet, {
    primaryChainScore: 1,
    relatedChainsScore: 1,
  })

  // await adAttestationSchema.attest(api, solanaUserWallet, {
  //   rating: 3,
  //   signature: '0x12gf'
  // })

  // await chainActivitySchema.attest(api, solanaUserWallet, {
  //   transactionCount: 124,
  //   totalValue: 140,
  //   lastActivity: 1,
  //   firstActivity: 1,
  // })

  // await multiChainReputationSchema.attest(api, solanaUserWallet, {
  //   primaryChainScore: 1,
  //   relatedChainsScore: 1,
  // })

  // await adAttestationSchema.attest(api, ethereumUserWallet, {
  //   rating: 3,
  //   signature: '0x12gf'
  // })

  // await chainActivitySchema.attest(api, ethereumUserWallet, {
  //   transactionCount: 124,
  //   totalValue: 140,
  //   lastActivity: 1,
  //   firstActivity: 1,
  // })

  // await multiChainReputationSchema.attest(api, ethereumUserWallet, {
  //   primaryChainScore: 1,
  //   relatedChainsScore: 1,
  // })

  // Output is usually the transaction hash for verification on-chain.
  console.log(output1, output2, output3)


  

  // Make sure to disconnect the network after operation(s) is done.
  await api.network.disconnect()
}

main()