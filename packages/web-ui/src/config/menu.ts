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
  Zap,
  FileEdit,
  Settings,
  MessageSquare,
  Building2,
  ScrollText,
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
          title: 'Topic Rewrite',
          url: '/advanced/topic-rewrite',
          icon: FileEdit,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Tenant',
          url: '/system/tenant',
          icon: Building2,
        },
        {
          title: 'Pub Sub',
          url: '/system/pub-sub',
          icon: MessageSquare,
        },
        {
          title: 'System Log',
          url: '/system/system-log',
          icon: ScrollText,
        },
        {
          title: 'Configuration',
          url: '/system/configuration',
          icon: Settings,
        },
      ],
    },
  ],
};
