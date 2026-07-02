'use client';

import Home1 from './home1';
import Home2 from './home2';

const ACTIVE_HOME = process.env.NEXT_PUBLIC_ACTIVE_HOME || 'home1';

export default function LandingPage() {
  if (ACTIVE_HOME === 'home2') {
    return <Home2 />;
  }
  return <Home1 />;
}
