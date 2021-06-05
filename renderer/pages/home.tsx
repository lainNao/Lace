import React from 'react';
import { useHomeController } from '../controllers/home/useHomeController';
import { LeftMenuType } from '../resources/LeftMenuType';
import { LeftMenus } from '../resources/enums/app';
import HomeLayout from '../pages.partial/HomeLayout';
import SettingsLayout from '../pages.partial/SettingsLayout';

// TODO ツリーの表示がもっさりしてるから別のライブラリに切り替えるか、または今のツリーのオプションを探す
// TODO カラムスペース追加時に一瞬ガクっとなる（高さが限界を超える場合）のをいつか直す
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
