import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { APP_CONFIG } from '@/config/constant';
import Logo from '@/assets/logo.png';

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <img src={Logo} className="size-6" />
          </div>
          <div className="flex-1 text-left">
            <span className="truncate text-base font-semibold">{APP_CONFIG.NAME}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
