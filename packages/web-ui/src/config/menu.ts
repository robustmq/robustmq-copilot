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
          url: '/general/placement-center',
        },
        {
          title: 'Session',
          url: '/general/placement-center',
        },
        {
          title: 'Subscription Management',
          url: '/general/subscribe-manager',
        },
        {
          title: 'Retained Message',
          url: '/general/subscribe-manager',
        },
        {
          title: 'Will Message',
          url: '/general/subscribe-manager',
        },
      ],
    },
    {
      title: 'Access Control',
      items: [
        {
          title: 'User Management',
          url: '/acl/client-authorize',
        },
        {
          title: 'ACL Management',
          url: '/acl/client-authorize',
        },
        {
          title: 'Blacklist Management',
          url: '/acl/client-certification',
        },
        {
          title: 'Connection Jitter',
          url: '/acl/client-certification',
        },
      ],
    },
    {
      title: 'Advanced',
      items: [
        {
          title: 'Topic Rewrite',
          url: '/acl/client-certification',
        },
        {
          title: 'Auto Subscription',
          url: '/acl/client-certification',
        },
        {
          title: 'Slow Subscription',
          url: '/acl/client-certification',
        },
        {
          title: 'Delayed Message',
          url: '/acl/client-certification',
        },
      ],
    },
    {
      title: 'Data Integration',
      items: [
        {
          title: 'Connector',
          url: '/acl/client-certification',
        },
        {
          title: 'Schema',
          url: '/acl/client-certification',
        },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        {
          title: 'Cluster',
          url: '/acl/client-certification',
        },
        {
          title: 'Topic',
          url: '/acl/client-certification',
        },
      ],
    },
    {
      title: 'Setting',
      items: [
        {
          title: 'Overview',
          url: '/acl/client-certification',
        },
        {
          title: 'Slow Subscription',
          url: '/acl/client-certification',
        },
        {
          title: 'Exclusive Subscription',
          url: '/acl/client-certification',
        },
        {
          title: 'Monitoring',
          url: '/acl/client-certification',
        },
        {
          title: 'Delayed Messages',
          url: '/acl/client-certification',
        },
      ],
    },
  ],
};
