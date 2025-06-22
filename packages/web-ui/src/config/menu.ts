import { type SidebarData } from '@/utils/types';

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
        },
      ],
    },
    {
      title: 'General',
      items: [
        {
          title: 'Client',
          url: '/general/client',
        },
        {
          title: 'Session',
          url: '/general/session',
        },
        {
          title: 'Topic',
          url: '/general/topic',
        },
        {
          title: 'Subscription Management',
          url: '/general/subscribe-manager',
        },
      ],
    },
    {
      title: 'Access Control',
      items: [
        {
          title: 'User Management',
          url: '/acl/user-management',
        },
        {
          title: 'ACL Management',
          url: '/acl/acl-management',
        },
        {
          title: 'Blacklist Management',
          url: '/acl/blacklist-management',
        },
      ],
    },
    {
      title: 'Data Integration',
      items: [
        {
          title: 'Connector',
          url: '/data-integration/connector',
        },
        {
          title: 'Schema',
          url: '/data-integration/schema',
        },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        {
          title: 'Cluster',
          url: '/monitoring/cluster',
        },
        {
          title: 'Topic',
          url: '/monitoring/topic',
        },
      ],
    },
    {
      title: 'Advanced',
      items: [
        {
          title: 'Auto Subscription',
          url: '/advanced/auto-subscription',
        },
        {
          title: 'Slow Subscription',
          url: '/advanced/slow-subscription',
        },
        {
          title: 'Topic Rewrite',
          url: '/advanced/topic-rewrite',
        },
        {
          title: 'Delayed Message',
          url: '/advanced/delayed-message',
        },
        {
          title: 'Connection Jitter',
          url: '/advanced/connection-jitter',
        },
      ],
    },
    {
      items: [
        {
          title: 'Setting',
          url: '/system-setting',
        },
      ],
    },
  ],
};
