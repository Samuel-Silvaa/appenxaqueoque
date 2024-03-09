import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { Image, SafeAreaView, View } from 'react-native';
import {
  getAlignment,
  getAppScaffoldAlignment,
} from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'w-fll max-h-[60%] flex grow bg-primary p-4 gap-y-4',
  header: 'my-6 self-start',
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
