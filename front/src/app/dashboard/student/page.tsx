import { CONFIG } from 'src/global-config';

import { StudentListView } from 'src/sections/student/view';

export const metadata = { title: `الطلاب - ${CONFIG.appName}` };

export default function Page() {
  return <StudentListView />;
}
