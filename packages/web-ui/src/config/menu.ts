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
          title: 'Overview',
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
          title: 'Subscribe',
          url: '/general/subscribe-manager',
          icon: Bell,
        },
        {
          title: 'Delayed Message',
          url: '/advanced/delayed-message',
          icon: Timer,
        },
      ],
    },
    {
      title: 'Access Control',
      items: [
        {
          title: 'User',
          url: '/acl/user-management',
          icon: Users,
        },
        {
          title: 'ACL',
          url: '/acl/acl-management',
          icon: Shield,
        },
        {
          title: 'Blacklist',
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
          title: 'Connection Jitter',
          url: '/advanced/connection-jitter',
          icon: Activity,
        },
        {
          title: 'System Alarm',
          url: '/advanced/connection-jitter',
          icon: Timer,
        },
      ],
    },
    {
      title: 'Setting',
      items: [
        {
          title: 'Configuration',
          url: '/advanced/connection-jitter',
          icon: Timer,
        },
        {
          title: 'Audit Log',
          url: '/advanced/connection-jitter',
          icon: Timer,
        },
      ],
    },
  ],
};
