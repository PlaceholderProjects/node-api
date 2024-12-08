import { Attestations } from "./attestations";

export function calc(): i64 {
  const adAttestation = Attestations.adAttestationSchema;
  const chainActivity = Attestations.chainActivitySchema;

  // Convert integers to f64 for mathematical operations
  const rating: f64 = <f64>adAttestation.rating;
  const totalTransactions: f64 = <f64>chainActivity.totalTransactions;
  const accountAgeDays: f64 = <f64>chainActivity.accountAgeDays;

  // Perform mathematical operations with f64 types
  const sqrtTransactions: f64 = Math.sqrt(totalTransactions);
  const logAccountAge: f64 = Math.log(accountAgeDays + 1.0);

  // Normalize the activity factors
  const activityFactor: f64 = (sqrtTransactions + logAccountAge) / 2.0;

  // Calculate the final reputation score
  const reputationScore: f64 = rating * activityFactor;

  // Convert final score back to i64 for return
  return <i64>reputationScore;
}