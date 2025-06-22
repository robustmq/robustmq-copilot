import { type SidebarData } from '@/utils/types';
import {
  LayoutDashboard,
  Network,
  UserRound,
  ListTodo,
  Bell,
  Users,
  Shield,
  UserX,
  Cable,
  Database,
  BarChart2,
  LineChart,
  Zap,
  Clock,
  FileEdit,
  Timer,
  Activity,
  Settings,
} from 'lucide-react';

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navGroups: [
    {
      items: [
        {
          title: 'Cluster Overview',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'General',
      items: [
        {
          title: 'Client',
          url: '/general/client',
          icon: Network,
        },
        {
          title: 'Session',
          url: '/general/session',
          icon: UserRound,
        },
        {
          title: 'Topic',
          url: '/general/topic',
          icon: ListTodo,
        },
        {
          title: 'Subscription Management',
          url: '/general/subscribe-manager',
          icon: Bell,
        },
      ],
    },
    {
      title: 'Access Control',
      items: [
        {
          title: 'User Management',
          url: '/acl/user-management',
          icon: Users,
        },
        {
          title: 'ACL Management',
          url: '/acl/acl-management',
          icon: Shield,
        },
        {
          title: 'Blacklist Management',
          url: '/acl/blacklist-management',
          icon: UserX,
        },
      ],
    },
    {
      title: 'Data Integration',
      items: [
        {
          title: 'Connector',
          url: '/data-integration/connector',
          icon: Cable,
        },
        {
          title: 'Schema',
          url: '/data-integration/schema',
          icon: Database,
        },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        {
          title: 'Cluster',
          url: '/monitoring/cluster',
          icon: BarChart2,
        },
        {
          title: 'Topic',
          url: '/monitoring/topic',
          icon: LineChart,
        },
      ],
    },
    {
      title: 'Advanced',
      items: [
        {
          title: 'Auto Subscription',
          url: '/advanced/auto-subscription',
          icon: Zap,
        },
        {
          title: 'Slow Subscription',
          url: '/advanced/slow-subscription',
          icon: Clock,
        },
        {
          title: 'Topic Rewrite',
          url: '/advanced/topic-rewrite',
          icon: FileEdit,
        },
        {
          title: 'Delayed Message',
          url: '/advanced/delayed-message',
          icon: Timer,
        },
        {
          title: 'Connection Jitter',
          url: '/advanced/connection-jitter',
          icon: Activity,
        },
      ],
    },
    {
      items: [
        {
          title: 'Setting',
          url: '/system-setting',
          icon: Settings,
        },
      ],
    },
  ],
};
