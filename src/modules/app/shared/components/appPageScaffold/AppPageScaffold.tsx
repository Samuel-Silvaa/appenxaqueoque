import { StatusBar } from 'expo-status-bar';
import { Fragment, ReactNode, useEffect, useState } from 'react';
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
  paddingInset?: number;
  disabledScroll?: boolean;
}

const AppPageScaffold = ({
  hasArrowBack = true,
  children,
  alignment = 'start',
  displayBg = true,
  paddingInset = 4,
  disabledScroll = false,
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
          {!disabledScroll && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              className={'w-full pt-[2px]'.concat(` p-${paddingInset}`)}
            >
              {children}
              <View className='h-[140px] w-full'></View>
            </ScrollView>
          )}

          {disabledScroll && (
            <View className={'w-full pt-[2px]'.concat(` p-${paddingInset}`)}>
              {children}
              <View className='h-[140px] w-full'></View>
            </View>
          )}
        </ImageBackground>
      )}

      {!displayBg && (
        <View>
          {disabledScroll && (
            <View
              className={'w-full pt-[40px] pb-14'.concat(` p-${paddingInset}`)}
            >
              {children}
              <View className='h-[140px] w-full'></View>
            </View>
          )}
          {!disabledScroll && (
            <ScrollView
              className={'w-full pt-[40px] pb-14'.concat(` p-${paddingInset}`)}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              showsVerticalScrollIndicator={false}
            >
              {children}
              <View className='h-[140px] w-full'></View>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default AppPageScaffold;
