import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useApp } from 'src/infra/app/app';

const stylesheet = {
  header:
    'w-full bg-[#edf1f8] p-4 pt-8 flex flex-row grow-0 justify-between items-center',
};

const AppHeader = ({
  navigation,
  route,
}: BottomTabHeaderProps | NativeStackHeaderProps | any) => {
  const { pageTitle } = useApp();

  return (
    <View className={stylesheet.header}>
      {navigation.canGoBack() ? (
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image source={require('assets/arrowback.png')} />
        </Pressable>
      ) : (
        <Image></Image>
      )}
      {pageTitle && (
        <Text className='text-2xl text-black font-extrabold'>{pageTitle}</Text>
      )}
      <Image source={require('assets/moon.png')} />
    </View>
  );
};

export default AppHeader;
