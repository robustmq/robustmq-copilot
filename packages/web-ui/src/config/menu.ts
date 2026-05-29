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
  Mail,
  Bot,
  HardDrive,
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
          title: 'global_overview',
          url: '/overview',
          icon: LayoutDashboard,
        },
        {
          title: 'tenant',
          url: '/system/tenant',
          icon: Building2,
        },
        {
          title: 'topic',
          url: '/general/topic',
          icon: ListTodo,
        },
      ],
    },
    {
      title: 'mqtt',
      items: [
        {
          title: 'overview',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'client',
          url: '/general/client',
          icon: Network,
        },
        {
          title: 'session',
          url: '/general/session',
          icon: UserRound,
        },
        {
          title: 'subscribe',
          url: '/general/subscribe-manager',
          icon: Bell,
        },
        {
          title: 'auto_subscription',
          url: '/advanced/auto-subscription',
          icon: Zap,
        },
        {
          title: 'topic_rewrite',
          url: '/advanced/topic-rewrite',
          icon: FileEdit,
        },
        {
          title: 'pub_sub',
          url: '/system/pub-sub',
          icon: MessageSquare,
        },
        {
          title: 'system_log',
          url: '/system/system-log',
          icon: ScrollText,
        },
      ],
    },
    {
      title: 'mq9',
      items: [
        { title: 'mailbox', url: '/mq9/mailbox', icon: Mail },
        { title: 'agent', url: '/mq9/agent', icon: Bot },
      ],
    },
    {
      title: 'storage_engine',
      items: [
        { title: 'shard', url: '/storage-engine/shard', icon: HardDrive },
      ],
    },
    {
      title: 'access_control',
      items: [
        {
          title: 'user',
          url: '/acl/user-management',
          icon: Users,
        },
        {
          title: 'acl',
          url: '/acl/acl-management',
          icon: Shield,
        },
        {
          title: 'blacklist',
          url: '/acl/blacklist-management',
          icon: UserX,
        },
      ],
    },
    {
      title: 'data_integration',
      items: [
        {
          title: 'connector',
          url: '/data-integration/connector',
          icon: Cable,
        },
        {
          title: 'schema',
          url: '/data-integration/schema',
          icon: Database,
        },
      ],
    },
    {
      title: 'system',
      items: [
        {
          title: 'meta_service',
          url: '/system/meta-service',
          icon: Database,
        },
        {
          title: 'configuration',
          url: '/system/configuration',
          icon: Settings,
        },
      ],
    },
  ],
};
