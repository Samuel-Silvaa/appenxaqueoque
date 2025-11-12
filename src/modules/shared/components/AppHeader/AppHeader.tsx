import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useCallback, useEffect } from "react";
import { Animated, TouchableOpacity, } from 'react-native';
import { Image, Text, View } from 'react-native';
import { Appearance } from 'react-native';
import { useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { useColorScheme } from 'nativewind';



const stylesheet = {
  header: 'w-full p-4 pt-12 flex flex-row grow-0 justify-between items-center absolute ',
  backButton: 'p-3',
  themeButton: 'w-14 h-14',
};

const AppHeader = ({
  navigation,
  route,
}: BottomTabHeaderProps | NativeStackHeaderProps | any) => {
  const appState = useSelector(appStateSelector);
  const { setColorScheme } = useColorScheme();

  const toggleAppColorScheme = useCallback(() => {


    if (Appearance.getColorScheme() == 'light') {
      setColorScheme('dark')
    } else {
      setColorScheme('light')

    }
  }, []);

  useEffect(() => {
    setColorScheme('light');
  }, [])

  return (
    <View
      className={stylesheet.header}
      style={{
        backgroundColor: 'transparent'
      }}
    >
      {(navigation.canGoBack()) ? (
        <TouchableOpacity
          className={stylesheet.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Image resizeMode="contain" className="w-1/7 h-7 " source={require('src/assets/arrowback.png')} />
        </TouchableOpacity>
      ) : (
        <View className="w-1/6 h-7 "></View>
      )}
      {appState.pageTitle && (
        <Animated.View
        >
          <Text
            className={`text-2xl ${Appearance.getColorScheme() == 'light'
                ? 'text-black '
                : 'text-d-blue-title'
              } font-extrabold text-center self-center align-centerflex-1`}
          >
            {appState.pageTitle}
          </Text>
        </Animated.View>
      )}

      <TouchableOpacity
        className={stylesheet.themeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          // toggleAppColorScheme();
        }}
      >
        {/* <Image
          className='w-14 h-14'
          resizeMode='contain'
          source={
            Appearance.getColorScheme() == 'light'
              ? require('src/assets/moon.png')
              : require('src/assets/sun.png')
          }
        /> */}
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;
