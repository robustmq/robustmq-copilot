import { ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { NavCollapsible, NavItem, NavLink, type NavGroup } from './types';

export function NavGroup({ title, items }: NavGroup) {
  const { state } = useSidebar();
  const href = useLocation({ select: location => location.href });
  const { t } = useTranslation('menu');

  const menuItems = (
    <SidebarMenu>
      {items.map(item => {
        const key = `${item.title}-${item.url}`;

        if (!item.items) return <SidebarMenuLink key={key} item={item} href={href} />;

        if (state === 'collapsed') return <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />;

        return <SidebarMenuCollapsible key={key} item={item} href={href} />;
      })}
    </SidebarMenu>
  );

  if (!title) {
    return <SidebarGroup className="px-2">{menuItems}</SidebarGroup>;
  }

  return (
    <SidebarGroup className="px-2">
      <Collapsible defaultOpen className="group/nav-group">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="w-full flex items-center justify-between cursor-pointer text-purple-600 font-semibold text-xs uppercase tracking-wider mb-2 px-2 py-1 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-400 dark:hover:bg-purple-900 rounded-md transition-colors duration-150 select-none">
            <span>{t(title)}</span>
            <ChevronRight className="h-3 w-3 shrink-0 transition-transform duration-200 group-data-[state=open]/nav-group:rotate-90" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {menuItems}
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm border-0 font-medium">
    {children}
  </Badge>
);

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation('menu');
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={t(item.title)}
        className={
          checkIsActive(href, item)
            ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 hover:from-purple-200 hover:to-purple-100 dark:from-purple-900 dark:to-purple-800 dark:text-purple-300 dark:hover:from-purple-800 dark:hover:to-purple-700 border-l-4 border-purple-500 shadow-sm'
            : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-25 hover:text-purple-600 dark:hover:from-purple-950 dark:hover:to-purple-900 dark:hover:text-purple-400 transition-all duration-200'
        }
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && (
            <div
              className={`p-1 rounded-md transition-all duration-200 ${
                checkIsActive(href, item)
                  ? 'bg-purple-200 dark:bg-purple-700'
                  : 'group-hover:bg-purple-100 dark:group-hover:bg-purple-800'
              }`}
            >
              <item.icon className="h-4 w-4" />
            </div>
          )}
          <span className="font-medium">{t(item.title)}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({ item, href }: { item: NavCollapsible; href: string }) => {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation('menu');
  return (
    <Collapsible asChild defaultOpen={checkIsActive(href, item, true)} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t(item.title)}>
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map(subItem => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                  className={
                    checkIsActive(href, subItem)
                      ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 hover:from-purple-200 hover:to-purple-100 dark:from-purple-900 dark:to-purple-800 dark:text-purple-300 dark:hover:from-purple-800 dark:hover:to-purple-700 border-l-2 border-purple-400 shadow-sm ml-2'
                      : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-25 hover:text-purple-600 dark:hover:from-purple-950 dark:hover:to-purple-900 dark:hover:text-purple-400 transition-all duration-200 ml-2'
                  }
                >
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{t(subItem.title)}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({ item, href }: { item: NavCollapsible; href: string }) => {
  const { t } = useTranslation('menu');
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={t(item.title)}
            isActive={checkIsActive(href, item)}
            className={
              checkIsActive(href, item)
                ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 hover:from-purple-200 hover:to-purple-100 dark:from-purple-900 dark:to-purple-800 dark:text-purple-300 dark:hover:from-purple-800 dark:hover:to-purple-700 border-l-4 border-purple-500 shadow-sm'
                : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-25 hover:text-purple-600 dark:hover:from-purple-950 dark:hover:to-purple-900 dark:hover:text-purple-400 transition-all duration-200'
            }
          >
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {t(item.title)} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map(sub => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                to={sub.url}
                className={`${checkIsActive(href, sub) ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : ''}`}
              >
                {sub.icon && <sub.icon />}
                <span className="max-w-52 text-wrap">{t(sub.title)}</span>
                {sub.badge && <span className="ml-auto text-xs">{sub.badge}</span>}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!item?.items?.filter(i => i.url === href).length || // if child nav is active
    (mainNav && href.split('/')[1] !== '' && href.split('/')[1] === item?.url?.split('/')[1])
  );
}
