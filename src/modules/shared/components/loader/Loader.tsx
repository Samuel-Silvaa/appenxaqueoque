import { useEffect } from 'react';
import { Animated, Image } from 'react-native';
import { Modal, Text, View } from 'react-native';
import { useSelector } from "react-redux";
import { useApp } from 'src/infra/app/app';
import { appStateSelector, authSelector } from "src/infra/app/selectors";

export const Loader = () => {
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
  }, [ auth.loading, app.loading]);

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
      transparent={true}
      animationType='fade'
      statusBarTranslucent={true}
      visible={ auth.loading || app.loading}
      onRequestClose={() => {
        console.log('close modal');
      }}
    >
      <View style={{ height: '100%', marginTop: 20 }} className='flex items-center justify-center m-auto bg-black/30 w-full z-300'>
        <Animated.View
          style={[animatedStyle]}
          className='rounded-full w-[180px] h-[180px] items-center justify-center bg-snow-white dark:bg-d-blue-primary shadow-xl shadow-black'
        >
          <Image
            resizeMode='contain'
            className='w-[150px] h-[110px]'
            source={require('src/assets/duck.png')}
          ></Image>
          <Text className='text-xs text-black/40 dark:text-d-text-gray/40'> Carregando ...</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};
