import { useEffect } from 'react';
import { Animated, Image } from 'react-native';
import { Modal, Text, View } from 'react-native';
import { useSelector } from "react-redux";
import { appStateSelector, authSelector } from "src/infra/app/selectors";

export const ScreenLoader = () => {
  const auth = useSelector(authSelector);
  const app = useSelector(appStateSelector);
  const state = {
    animatedValue: new Animated.Value(0),
  };

  useEffect(() => {
      startAnimation();
    return () => {
      state.animatedValue.stopAnimation();
    };
  }, [ auth.entireScreenLoading]);

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(state.animatedValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(state.animatedValue, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      startAnimation();
    });
  };

  const interpolateScale = state.animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 1],
  });

  const animatedStyle = {
    transform: [{ scale: interpolateScale }],
  };

  return (
    <Modal
      presentationStyle='overFullScreen'
      transparent={false}
      animationType='fade'
      statusBarTranslucent={true}
      visible={ auth.entireScreenLoading}
      onRequestClose={() => {
      }}
    >
      <View style={{ height: '100%', marginTop: 20 }} className='flex items-center justify-center m-auto transparent opacity-90 w-full z-300 h-full blur-3xl'>
        <Animated.View
          style={[animatedStyle]}
          className=' items-center justify-center transparent'
        >
          <Image
            resizeMode='contain'
            className='w-[150px] h-[110px]'
            source={require('src/assets/duck.png')}
          ></Image>
          <Text className='text-xs text-black/40 dark:text-d-text-gray/40'>Carregando ...</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};
