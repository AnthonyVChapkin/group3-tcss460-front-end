// third-party
import { FormattedMessage } from 'react-intl';

// assets
import QuestionOutlined from '@ant-design/icons/QuestionOutlined';
import StopOutlined from '@ant-design/icons/StopOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import FullscreenOutlined from '@ant-design/icons/FullscreenOutlined';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  QuestionOutlined,
  StopOutlined,
  LockOutlined,
  FullscreenOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other: NavItemType = {
  id: 'other',
  title: <FormattedMessage id="others" />,
  type: 'group',
 children: [
  {
    id: 'disabled-menu',
    title: <FormattedMessage id="disabled-menu" />,
    type: 'item',
    url: '#',
    icon: icons.StopOutlined,
    disabled: true
  },
  {
    id: 'full-page',
    title: <FormattedMessage id="full-page" />,
    type: 'item',
    url: '/full-page',
    icon: icons.FullscreenOutlined
  },
  {
    id: 'change-password',
    title: <FormattedMessage id="change-password" defaultMessage="Change Password" />,
    type: 'item',
    url: '/change-password',
    icon: LockOutlined
  },
  {
    id: 'documentation',
    title: <FormattedMessage id="documentation" />,
    type: 'item',
    url: 'https://uwt-set-tcss460-lecture-materials.github.io/TCSS460-phase-2/',
    icon: icons.QuestionOutlined,
    external: true,
    target: true
  }
]

};

export default other;
