import { ethers } from 'ethers';

export const analyzeContract = async (contract) => {
  try {
    const [txEvents, totalVolume] = await Promise.all([
      contract.queryFilter(contract.filters.TransactionRecorded()),
      contract.totalVolume()
    ]);

    return {
      transactionCount: txEvents.length,
      totalVolume: ethers.formatEther(totalVolume),
      lastTransaction: txEvents[0]?.blockTimestamp || 0
    };
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      transactionCount: 0,
      totalVolume: '0',
      lastTransaction: 0
    };
  }
};

// Performance metrics with caching
const analyticsCache = { timestamp: 0, data: null };
const CACHE_DURATION = 30000; // 30 seconds

export const getPerformanceMetrics = async (contract) => {
  if (Date.now() - analyticsCache.timestamp < CACHE_DURATION) {
    return analyticsCache.data;
  }

  try {
    const metrics = await analyzeContract(contract);
    analyticsCache.data = metrics;
    analyticsCache.timestamp = Date.now();
    return metrics;
  } catch (error) {
    return analyticsCache.data || {
      transactionCount: 0,
      totalVolume: '0',
      lastTransaction: 0
    };
  }
};
