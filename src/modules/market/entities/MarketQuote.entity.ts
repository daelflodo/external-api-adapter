import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('market_quotes')
export class MarketQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'real' })
  open: number;

  @Column({ type: 'real' })
  high: number;

  @Column({ type: 'real' })
  low: number;

  @Column({ type: 'integer' })
  volume: number;

  @Column({ type: 'real' })
  change: number;

  @Column()
  changePercent: string;

  @Column({ type: 'real' })
  previousClose: number;

  @Column()
  latestTradingDay: string;

  @CreateDateColumn()
  cachedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
