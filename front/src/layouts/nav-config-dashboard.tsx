import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'ادارة المنصة',
    items: [
      {
        title: 'نظرة عامة',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
        info: <Label>قريباً</Label>,
      },
      { title: 'الطلاب', path: paths.dashboard.student.root, icon: ICONS.ecommerce },
      { title: 'المدرسين', path: paths.dashboard.teacher.root, icon: ICONS.job },
      {
        title: 'المراحل التعليمية',
        path: paths.dashboard.course.root,
        icon: ICONS.course,
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'المسئولين والادوار',
    items: [
      {
        title: 'قائمة الموظفين',
        path: paths.dashboard.admin.root,
        icon: ICONS.user,
      },
      {
        title: 'الوظائف',
        path: paths.dashboard.admin.role,
        icon: ICONS.user,
      },
      {
        title: ' الفروع',
        path: paths.dashboard.branch.root,
        icon: ICONS.external,
      },
    ],
  },
];
