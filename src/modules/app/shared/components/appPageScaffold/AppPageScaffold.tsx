import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { useApp } from 'src/infra/app/app';
import { getAppScaffoldAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-full h-full flex grow bg-primary scroll-smooth relative ',
};

interface AppPageScaffoldProps {
  alignment?: string;
  justify?: string;
  hasArrowBack?: boolean;
  displayBg?: boolean;
  children: ReactNode;
  title?: string;
}

const AppPageScaffold = ({
  hasArrowBack = true,
  children,
  alignment = 'start',
  displayBg = true,
  title = '',
}: AppPageScaffoldProps) => {
  const { setPageTitle } = useApp();
  if (setPageTitle) setPageTitle(title);

  return (
    <View
      className={`${stylesheet.view} ${getAppScaffoldAlignment(alignment)}`}
    >
      <StatusBar />

      {displayBg && (
        <ImageBackground
          resizeMode='cover'
          className='w-full h-full'
          source={require('assets/appbg.png')}
        >
          <ScrollView
            className='w-full p-4 pt-[40px] pb-14 overflow-x-hidden '
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </ImageBackground>
      )}

      {!displayBg && (
        <ScrollView
          className='w-full p-4 pt-[40px] pb-14 overflow-x-hidden '
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
};

export default AppPageScaffold;
