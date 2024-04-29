import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { getAppScaffoldAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-full flex-grow bg-primary scroll-smooth relative',
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
          source={require('assets/appbg.png')}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className='w-full p-4 pt-[40px]'
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
