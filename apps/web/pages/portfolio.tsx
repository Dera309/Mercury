import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../src/store';
import { portfolioApi } from '../src/services/api';
import { fetchPortfolioRequest, fetchPortfolioSuccess, fetchPortfolioFailure } from '../src/store/slices/portfolioSlice';
import { Layout } from '../src/components/layout';
import { Card } from '../src/components/ui';

const PortfolioPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { portfolio, isLoading, error } = useSelector((state: RootState) => state.portfolio);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch portfolio data
    const fetchPortfolio = async () => {
      dispatch(fetchPortfolioRequest());
      try {
        const response = await portfolioApi.getPortfolio();
        if (response.success) {
          dispatch(fetchPortfolioSuccess(response.data));
        } else {
          dispatch(fetchPortfolioFailure(response.message || 'Failed to fetch portfolio'));
        }
      } catch (err: any) {
        dispatch(fetchPortfolioFailure(err.response?.data?.message || 'An error occurred'));
      }
    };

    fetchPortfolio();
  }, [dispatch, router, isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  if (isLoading) {
    return (
      <Layout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Loading Portfolio...</h1>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem' }}>
        <h1>Portfolio</h1>
        <p>Welcome back, {user?.firstName}!</p>

        {portfolio ? (
          <div style={{ marginTop: '2rem' }}>
            <Card>
              <h2>Portfolio Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <h3>Total Value</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                    ${portfolio.totalValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3>Total Gain/Loss</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: portfolio.totalGain >= 0 ? '#28a745' : '#dc3545' }}>
                    ${portfolio.totalGain.toLocaleString()} ({portfolio.totalGainPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </Card>

            <Card style={{ marginTop: '2rem' }}>
              <h2>Holdings</h2>
              <div style={{ marginTop: '1rem' }}>
                {portfolio.holdings.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Symbol</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Shares</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Price</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Value</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.holdings.map((holding) => (
                        <tr key={holding.symbol} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '0.75rem' }}>{holding.symbol}</td>
                          <td style={{ padding: '0.75rem' }}>{holding.name}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>{holding.shares}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>${holding.price.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>${holding.value.toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', color: holding.change >= 0 ? '#28a745' : '#dc3545' }}>
                            {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No holdings found. Start investing to build your portfolio!</p>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <Card>
            <h2>No Portfolio Data</h2>
            <p>Unable to load portfolio information. Please try again later.</p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PortfolioPage;
