import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Image, Pressable, View } from 'react-native';
const stylesheet = {
  header:
    'w-full bg-primary p-4 flex flex-row grow-0 justify-between items-center',
};

const AppHeader = ({
  navigation,
}: BottomTabHeaderProps | NativeStackHeaderProps) => {
  return (
    <View className={stylesheet.header}>
      {navigation.canGoBack() ? (
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={require('assets/arrowback.svg')} />
        </Pressable>
      ) : (
        <Image></Image>
      )}
      <Image source={require('assets/moon.svg')} />
    </View>
  );
};

export default AppHeader;
