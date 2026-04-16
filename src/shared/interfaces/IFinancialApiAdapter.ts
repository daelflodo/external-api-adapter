/**
 * Representación sencilla de una cotización de stock.
 * Aquí todos los datos ya vienen en un formato estándar.
 * Los adapters se encargan de convertir la info original a este formato.
 */
export interface NormalizedQuote {
  symbol: string;
  price: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  change: string;
  changePercent: string;
  previousClose: string;
  latestTradingDay: string;
}

/**
 * Contrato que debe cumplir cualquier adapter de API financiera.
 * Sigue el patrón Adapter: si cambias el proveedor,
 * solo necesitas crear una nueva implementación de esta interfaz.
 */
export interface IFinancialApiAdapter {
  getGlobalQuote(symbol: string): Promise<NormalizedQuote>;
}
