import { IFinancialApiAdapter, NormalizedQuote } from '../../shared/interfaces/IFinancialApiAdapter';
import { IMarketService } from './interfaces/IMarketService';
import { MarketRepository } from './market.repository';
import { MarketQuoteDto } from './dto/market-quote.dto';
import { MarketQuote } from './entities/MarketQuote.entity';

export class MarketService implements IMarketService {
  constructor(
    private readonly adapter: IFinancialApiAdapter,
    private readonly repository: MarketRepository,
  ) {}

  async getQuote(symbol: string): Promise<MarketQuoteDto> {
    const normalized = await this.adapter.getGlobalQuote(symbol.toUpperCase());
    const dto = this.normalizedToDto(normalized);

    await this.repository.upsert({
      symbol: dto.symbol,
      price: dto.price,
      open: dto.open,
      high: dto.high,
      low: dto.low,
      volume: dto.volume,
      change: dto.change,
      changePercent: dto.changePercent,
      previousClose: dto.previousClose,
      latestTradingDay: dto.latestTradingDay,
    });

    return dto;
  }

  async getMultipleQuotes(symbols: string[]): Promise<MarketQuoteDto[]> {
    const results = await Promise.allSettled(symbols.map((s) => this.getQuote(s)));
    return results
      .filter((r): r is PromiseFulfilledResult<MarketQuoteDto> => r.status === 'fulfilled')
      .map((r) => r.value);
  }

  async getCachedQuotes(): Promise<MarketQuoteDto[]> {
    const entities = await this.repository.findAll();
    return entities.map((e) => this.entityToDto(e));
  }

  private determineTrend(change: number): 'up' | 'down' | 'neutral' {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  }

  private normalizedToDto(raw: NormalizedQuote): MarketQuoteDto {
    const change = parseFloat(raw.change);
    return {
      symbol: raw.symbol,
      price: parseFloat(raw.price),
      open: parseFloat(raw.open),
      high: parseFloat(raw.high),
      low: parseFloat(raw.low),
      volume: parseInt(raw.volume, 10),
      change,
      changePercent: raw.changePercent,
      previousClose: parseFloat(raw.previousClose),
      latestTradingDay: raw.latestTradingDay,
      trend: this.determineTrend(change),
    };
  }

  private entityToDto(entity: MarketQuote): MarketQuoteDto {
    const change = Number(entity.change);
    return {
      id: entity.id,
      symbol: entity.symbol,
      price: Number(entity.price),
      open: Number(entity.open),
      high: Number(entity.high),
      low: Number(entity.low),
      volume: Number(entity.volume),
      change,
      changePercent: entity.changePercent,
      previousClose: Number(entity.previousClose),
      latestTradingDay: entity.latestTradingDay,
      trend: this.determineTrend(change),
      cachedAt: entity.cachedAt,
    };
  }
}
