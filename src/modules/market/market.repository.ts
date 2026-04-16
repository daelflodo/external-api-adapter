import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { MarketQuote } from './entities/MarketQuote.entity';

export class MarketRepository {
  private readonly repo: Repository<MarketQuote>;

  constructor() {
    this.repo = AppDataSource.getRepository(MarketQuote);
  }

  findAll(): Promise<MarketQuote[]> {
    return this.repo.find({ order: { symbol: 'ASC' } });
  }

  findBySymbol(symbol: string): Promise<MarketQuote | null> {
    return this.repo.findOne({ where: { symbol } });
  }

  async upsert(data: Partial<MarketQuote>): Promise<MarketQuote> {
    const existing = await this.findBySymbol(data.symbol!);
    if (existing) {
      this.repo.merge(existing, data);
      return this.repo.save(existing);
    }
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
