import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { getAppScaffoldAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-full h-[100%] bg-primary p-4 pt-[60px] scroll-smooth relative',
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
      <ScrollView className='w-full' showsVerticalScrollIndicator={false}>
        <StatusBar />
        {children}
      </ScrollView>
    </View>
  );
};

export default AppPageScaffold;
