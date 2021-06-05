import React from 'react';
import { useHomeController } from '../controllers/home/useHomeController';
import { LeftMenus } from '../resources/enums/app';
import HomeLayout from '../pages.partial/HomeLayout';
import SettingsLayout from '../pages.partial/SettingsLayout';

const Home: React.FC = () => {

  const controller = useHomeController();

  return (
    <>
      {controller.selectedLeftMenu === LeftMenus.HOME &&
        <HomeLayout />
      }

      {controller.selectedLeftMenu === LeftMenus.SETTINGS &&
        <SettingsLayout />
      }

    </>
  )
}

export default Home;
