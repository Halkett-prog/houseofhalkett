'use client';

import dynamic from 'next/dynamic';

// Dynamically import the calculator to avoid SSR issues
const CalculatorComponent = dynamic(() => import('./CalculatorComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <div className="loading-spinner"></div>
      <p>Loading calculator...</p>
    </div>
  )
});

export default function CalculatorPage() {
  return <CalculatorComponent />;
}