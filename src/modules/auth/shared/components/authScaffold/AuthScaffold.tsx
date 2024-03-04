import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { Image, View } from 'react-native';

const stylesheet = {
  view: 'flex grow bg-primary p-4 gap-y-4',
  header: 'my-6 self-start',
};

interface AuthScaffoldProps {
  alignment?: string;
  justify?: string;
  hasArrowBack?: boolean;
  children: ReactNode;
}

const AuthScaffold = ({
  hasArrowBack = true,
  children,
  alignment = 'items-start',
  justify = 'justify-start',
}: AuthScaffoldProps) => {
  return (
    <View className={`${stylesheet.view} ${alignment} ${justify}`}>
      <StatusBar />
      {hasArrowBack && (
        <Image
          className={stylesheet.header}
          source={require('assets/arrowback.svg')}
        ></Image>
      )}
      {children}
    </View>
  );
};

export default AuthScaffold;
