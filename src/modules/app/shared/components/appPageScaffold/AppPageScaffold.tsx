import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native';
import { getAppScaffoldAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-full h-[100%] bg-primary p-4 pt-[80px] overflow-scroll',
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
    <SafeAreaView
      className={`${stylesheet.view} ${getAppScaffoldAlignment(alignment)}`}
    >
      <StatusBar />
      {children}
    </SafeAreaView>
  );
};

export default AppPageScaffold;
