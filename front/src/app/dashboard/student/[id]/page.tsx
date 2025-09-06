import { CONFIG } from 'src/global-config';

import { StudentDetailsView } from 'src/sections/student/view';

export const metadata = { title: `بيانات الطالب - ${CONFIG.appName}` };

export default function Page({ params }: any) {
  return <StudentDetailsView id={params.id} />;
}
