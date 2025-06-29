import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useCallback } from "react";
import { TouchableOpacity } from 'react-native';
import { Image, Text, View } from 'react-native';
import { Appearance } from 'react-native';
import { useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";

const stylesheet = {
  header: 'w-full p-4 pt-8 flex flex-row grow-0 justify-between items-center',
  backButton: 'p-3',
  themeButton: 'p-3',
};

const AppHeader = ({
  navigation,
  route,
}: BottomTabHeaderProps | NativeStackHeaderProps | any) => {
  const appState = useSelector(appStateSelector);

  const toggleColorScheme = useCallback(() => {
    if (Appearance.getColorScheme() == 'light') {
      Appearance.setColorScheme('dark');
    } else {
      Appearance.setColorScheme('light');
    }
  }, [Appearance]);

  return (
    <View
      className={stylesheet.header}
      style={{
        backgroundColor:
          Appearance.getColorScheme() == 'light' ? '#edf1f8' : '#23263F',
      }}
    >
      {navigation.canGoBack() ? (
        <TouchableOpacity
          className={stylesheet.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image source={require('src/assets/arrowback.png')} />
        </TouchableOpacity>
      ) : (
        <Image></Image>
      )}
      {appState.pageTitle && (
        <Text
          className={`text-2xl ${
            Appearance.getColorScheme() == 'light'
              ? 'text-black '
              : 'text-d-blue-title'
          } font-extrabold ml-8`}
        >
          {appState.pageTitle}
        </Text>
      )}
      <TouchableOpacity
        className={stylesheet.themeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          toggleColorScheme();
        }}
      >
        <Image
          className='w-14 h-14 bg-red'
          resizeMode='contain'
          source={
            Appearance.getColorScheme() == 'light'
              ? require('src/assets/moon.png')
              : require('src/assets/sun.png')
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;
