import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { Image, View } from 'react-native';
import { getAlignment } from 'src/modules/shared/style/SharedProcessedStyle';

const stylesheet = {
  view: 'flex grow bg-primary p-4 gap-y-4',
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
    <View className={`${stylesheet.view} ${getAlignment(alignment)}`}>
      <StatusBar />
      {children}
    </View>
  );
};

export default AppPageScaffold;
