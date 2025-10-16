import { Suspense } from 'react';
import SubscriptionPage from './SubscriptionPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriptionPage />
    </Suspense>
  );
}