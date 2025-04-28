import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { ThemeSwitch } from '@/components/theme-switch';
import { Main } from './main';

interface CommonLayoutProps {
  children: React.ReactNode;
}

export function CommonLayout(props: CommonLayoutProps) {
  return (
    <>
      <Header fixed>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>{props.children}</Main>
    </>
  );
}

CommonLayout.displayName = 'CommonLayout';
