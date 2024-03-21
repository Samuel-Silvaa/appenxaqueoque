import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { getAppScaffoldAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-full h-full flex grow bg-primary p-4 pt-[60px] scroll-smooth relative pb-14 overflow-hidden',
};

interface AppPageScaffoldProps {
  alignment?: string;
  justify?: string;
  hasArrowBack?: boolean;
  children: ReactNode;
}

const AppPageScaffold = ({
  hasArrowBack = true,
  children,
  alignment = 'start',
}: AppPageScaffoldProps) => {
  return (
    <View
      className={`${stylesheet.view} ${getAppScaffoldAlignment(alignment)}`}
    >
      <ImageBackground
        className='bg-cover absolute top-0 left-0'
        source={require('assets/appbg.png')}
      ></ImageBackground>
      <StatusBar />
      <ScrollView className='w-full' showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
};

export default AppPageScaffold;
