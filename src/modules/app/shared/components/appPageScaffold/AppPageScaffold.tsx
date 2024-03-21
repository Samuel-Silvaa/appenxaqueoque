import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { useApp } from 'src/infra/app/app';
import { getAppScaffoldAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-full h-full flex grow bg-primary scroll-smooth relative overflow-hidden',
};

interface AppPageScaffoldProps {
  alignment?: string;
  justify?: string;
  hasArrowBack?: boolean;
  title?: string;
  children: ReactNode;
}

const AppPageScaffold = ({
  hasArrowBack = true,
  title = '',
  children,
  alignment = 'start',
}: AppPageScaffoldProps) => {
  const { setPageTitle } = useApp();

  useEffect(() => {
    if (setPageTitle) setPageTitle(title);

    return () => {
      if (setPageTitle) setPageTitle('');
    };
  }, [title]);

  return (
    <View
      className={`${stylesheet.view} ${getAppScaffoldAlignment(alignment)}`}
    >
      <StatusBar />
      <ImageBackground
        resizeMode='cover'
        className='w-full h-full'
        source={require('assets/appbg.png')}
      >
        <ScrollView
          className='w-full p-4 pt-[40px] pb-14 '
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AppPageScaffold;
