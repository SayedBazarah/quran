import { CONFIG } from 'src/global-config';

import { AnalyticsOverviewView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AnalyticsOverviewView />;
}
