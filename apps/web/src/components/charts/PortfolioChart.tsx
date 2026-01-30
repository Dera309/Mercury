import React from 'react';
import styles from './PortfolioChart.module.css';

interface AssetAllocation {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface PortfolioChartProps {
  data: AssetAllocation[];
  totalValue: number;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  data,
  totalValue,
}) => {
  const segments = data.reduce((acc, item) => {
    const startPercentage = acc.length > 0 ? acc[acc.length - 1].endPercentage : 0;
    const endPercentage = startPercentage + item.percentage;
    acc.push({
      ...item,
      startPercentage,
      endPercentage,
    });
    return acc;
  }, [] as (AssetAllocation & { startPercentage: number; endPercentage: number })[]);

  // Create SVG path for each segment
  const createArcPath = (
    startPercent: number,
    endPercent: number,
    radius: number,
    innerRadius: number
  ) => {
    const startAngle = (startPercent / 100) * 360 - 90;
    const endAngle = (endPercent / 100) * 360 - 90;

    const startRadians = (startAngle * Math.PI) / 180;
    const endRadians = (endAngle * Math.PI) / 180;

    const x1 = 100 + radius * Math.cos(startRadians);
    const y1 = 100 + radius * Math.sin(startRadians);
    const x2 = 100 + radius * Math.cos(endRadians);
    const y2 = 100 + radius * Math.sin(endRadians);

    const x3 = 100 + innerRadius * Math.cos(endRadians);
    const y3 = 100 + innerRadius * Math.sin(endRadians);
    const x4 = 100 + innerRadius * Math.cos(startRadians);
    const y4 = 100 + innerRadius * Math.sin(startRadians);

    const largeArcFlag = endPercent - startPercent > 50 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <svg viewBox="0 0 200 200" className={styles.chart}>
          {segments.map((segment, index) => (
            <path
              key={index}
              d={createArcPath(
                segment.startPercentage,
                segment.endPercentage,
                80,
                50
              )}
              fill={segment.color}
              className={styles.segment}
            />
          ))}
        </svg>
        <div className={styles.centerLabel}>
          <span className={styles.totalLabel}>Total Value</span>
          <span className={styles.totalValue}>{formatCurrency(totalValue)}</span>
        </div>
      </div>

      <div className={styles.legend}>
        {data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.legendName}>{item.name}</span>
            <span className={styles.legendPercentage}>
              {item.percentage.toFixed(1)}%
            </span>
            <span className={styles.legendValue}>
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioChart;
