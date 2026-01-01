export enum CalculationMode {
  GrossToNet = 'GROSS_TO_NET',
  NetToGross = 'NET_TO_GROSS'
}

export interface CalculationResult {
  sourceAmount: number;
  calculatedAmount: number;
  commissionAmount: number;
  effectiveRate: number;
}