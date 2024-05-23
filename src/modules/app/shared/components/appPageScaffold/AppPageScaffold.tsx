import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect, useState } from 'react';
import { Appearance, ImageBackground, ScrollView, View } from 'react-native';
import { getAppScaffoldAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-full flex-grow bg-primary dark:bg-d-primary scroll-smooth relative',
};

interface AppPageScaffoldProps {
  alignment?: string;
  justify?: string;
  hasArrowBack?: boolean;
  displayBg?: boolean;
  children: ReactNode;
}

const AppPageScaffold = ({
  hasArrowBack = true,
  children,
  alignment = 'start',
  displayBg = true,
  ...res
}: AppPageScaffoldProps) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    Appearance.addChangeListener((a) => {
      setColorScheme(a.colorScheme);
    });
  }, []);

  return (
    <View
      className={`${stylesheet.view} ${getAppScaffoldAlignment(alignment)}`}
      {...res}
    >
      <StatusBar />

      {displayBg && (
        <ImageBackground
          className='w-full h-full flex-grow '
          resizeMode='cover'
          source={
            colorScheme == 'light'
              ? require('src/assets/appbg.png')
              : require('src/assets/dappbg.png')
          }
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className='w-full p-4 pt-[2px]'
          >
            {children}
            <View className='h-[140px] w-full'></View>
          </ScrollView>
        </ImageBackground>
      )}

      {!displayBg && (
        <ScrollView
          className='w-full p-4 pt-[40px] pb-14'
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          {children}
          <View className='h-[140px] w-full'></View>
        </ScrollView>
      )}
    </View>
  );
};

export default AppPageScaffold;
