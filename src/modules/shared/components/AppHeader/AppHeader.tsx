import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Image, Pressable, Text, View } from 'react-native';
import { useApp } from 'src/infra/app/app';
import { useAuth } from 'src/infra/auth/auth';

const stylesheet = {
  header: 'w-full p-4 pt-8 flex flex-row grow-0 justify-between items-center',
};

const AppHeader = ({
  navigation,
  route,
}: BottomTabHeaderProps | NativeStackHeaderProps | any) => {
  const { pageTitle } = useApp();
  const { session } = useAuth();

  return (
    <View
      className={stylesheet.header}
      style={{
        backgroundColor: session?.userType == 'PATIENT' ? '#edf1f8' : '',
      }}
    >
      {navigation.canGoBack() ? (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image source={require('assets/arrowback.png')} />
        </TouchableOpacity>
      ) : (
        <Image></Image>
      )}
      {pageTitle && (
        <Text className='text-2xl text-black font-extrabold ml-8'>
          {pageTitle}
        </Text>
      )}
      <Image
        className='w-14 h-14 bg-red'
        resizeMode='contain'
        source={require('assets/moon.png')}
      />
    </View>
  );
};

export default AppHeader;
