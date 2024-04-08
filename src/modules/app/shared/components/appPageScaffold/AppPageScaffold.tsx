import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { useApp } from 'src/infra/app/app';
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
  title?: string;
}

const AppPageScaffold = ({
  hasArrowBack = true,
  children,
  alignment = 'start',
  displayBg = true,
  title = '',
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
          <ScrollView className='w-full p-4 pt-[40px]'>{children}</ScrollView>
        </ImageBackground>
      )}

      {!displayBg && (
        <ScrollView
          className='w-full p-4 pt-[40px] pb-14'
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
};

export default AppPageScaffold;
