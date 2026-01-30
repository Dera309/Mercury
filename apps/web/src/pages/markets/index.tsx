import React, { useState } from 'react';
import Head from 'next/head';
import { Layout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../../components/ui';
import styles from './Markets.module.css';

// Mock market data
const marketIndices = [
  { name: 'S&P 500', symbol: 'SPX', value: 4783.45, change: 0.87, changeValue: 41.23 },
  { name: 'Dow Jones', symbol: 'DJI', value: 37689.54, change: 0.56, changeValue: 209.45 },
  { name: 'NASDAQ', symbol: 'IXIC', value: 15055.65, change: 1.23, changeValue: 183.02 },
  { name: 'Russell 2000', symbol: 'RUT', value: 2012.34, change: -0.34, changeValue: -6.89 },
];

const trendingStocks = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 495.22, change: 5.67, volume: '52.3M' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.48, change: -2.34, volume: '98.7M' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 1.23, volume: '45.2M' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: 0.89, volume: '22.1M' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 153.42, change: 2.15, volume: '38.9M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -0.45, volume: '18.5M' },
  { symbol: 'META', name: 'Meta Platforms, Inc.', price: 353.96, change: 3.21, volume: '15.8M' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 147.41, change: 4.56, volume: '42.1M' },
];

const sectors = [
  { name: 'Technology', change: 2.34, color: '#1a73e8' },
  { name: 'Healthcare', change: 0.87, color: '#34a853' },
  { name: 'Financials', change: -0.45, color: '#ea4335' },
  { name: 'Consumer Discretionary', change: 1.56, color: '#fbbc04' },
  { name: 'Energy', change: -1.23, color: '#9c27b0' },
  { name: 'Industrials', change: 0.34, color: '#607d8b' },
];

const MarketsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const filteredStocks = trendingStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Head>
        <title>Markets | Mercury Investment Platform</title>
        <meta name="description" content="Explore market data and investment opportunities" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Markets</h1>
          <p>Explore market data and discover investment opportunities</p>
        </header>

        {/* Market Indices */}
        <div className={styles.indicesGrid}>
          {marketIndices.map((index) => (
            <Card key={index.symbol} className={styles.indexCard} hoverable>
              <div className={styles.indexHeader}>
                <span className={styles.indexSymbol}>{index.symbol}</span>
                <span className={styles.indexName}>{index.name}</span>
              </div>
              <div className={styles.indexValue}>{formatNumber(index.value)}</div>
              <div className={`${styles.indexChange} ${index.change >= 0 ? styles.positive : styles.negative}`}>
                {formatPercent(index.change)} ({index.change >= 0 ? '+' : ''}{formatNumber(index.changeValue)})
              </div>
            </Card>
          ))}
        </div>

        {/* Sector Performance */}
        <Card className={styles.sectorCard}>
          <CardHeader>
            <CardTitle subtitle="Today's sector performance">
              Sector Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.sectorGrid}>
              {sectors.map((sector) => (
                <div key={sector.name} className={styles.sectorItem}>
                  <div className={styles.sectorBar}>
                    <div
                      className={`${styles.sectorFill} ${sector.change >= 0 ? styles.positive : styles.negative}`}
                      style={{
                        width: `${Math.min(Math.abs(sector.change) * 20, 100)}%`,
                        backgroundColor: sector.change >= 0 ? 'var(--secondary-color)' : 'var(--danger-color)',
                      }}
                    />
                  </div>
                  <div className={styles.sectorInfo}>
                    <span className={styles.sectorName}>{sector.name}</span>
                    <span className={`${styles.sectorChange} ${sector.change >= 0 ? styles.positive : styles.negative}`}>
                      {formatPercent(sector.change)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Stocks */}
        <Card className={styles.stocksCard}>
          <CardHeader
            action={
              <Input
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            }
          >
            <CardTitle subtitle="Most active stocks today">
              Trending Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.tableWrapper}>
              <table className={styles.stocksTable}>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th className={styles.alignRight}>Price</th>
                    <th className={styles.alignRight}>Change</th>
                    <th className={styles.alignRight}>Volume</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock) => (
                    <tr key={stock.symbol}>
                      <td className={styles.symbol}>{stock.symbol}</td>
                      <td className={styles.name}>{stock.name}</td>
                      <td className={styles.alignRight}>{formatCurrency(stock.price)}</td>
                      <td className={`${styles.alignRight} ${stock.change >= 0 ? styles.positive : styles.negative}`}>
                        {formatPercent(stock.change)}
                      </td>
                      <td className={styles.alignRight}>{stock.volume}</td>
                      <td className={styles.alignRight}>
                        <Button variant="outline" size="sm">
                          Trade
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MarketsPage;