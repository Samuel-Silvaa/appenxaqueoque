import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { getAppScaffoldAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-full h-[100%] bg-primary p-4 pt-[60px] scroll-smooth relative pb-14',
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
      <ScrollView className='w-full' showsVerticalScrollIndicator={false}>
        <StatusBar />
        {children}
      </ScrollView>
    </View>
  );
};

export default AppPageScaffold;
