import { useEffect, useRef } from 'react';
import { Animated, Image, Modal, Text, View } from 'react-native';
import { useSelector } from "react-redux";
import { appStateSelector, authSelector } from "src/infra/app/selectors";

export const Loader = () => {
  const auth = useSelector(authSelector);
  const app = useSelector(appStateSelector);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (auth.loading || app.loading) {
      startAnimation();
    } else {
      animatedValue.stopAnimation();
    }
  }, [auth.loading, app.loading]);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const interpolateScale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 1],
  });

  const animatedStyle = {
    transform: [{ scale: interpolateScale }],
  };

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      visible={auth.loading || app.loading}
      onRequestClose={() => {}}
    >
      <View className="flex-1 items-center justify-center bg-black/30">
        <Animated.View
          style={animatedStyle}
          className="rounded-full w-[180px] h-[180px] items-center justify-center bg-snow-white dark:bg-d-blue-primary shadow-xl shadow-black"
        >
          <Image
            resizeMode="contain"
            className="w-[150px] h-[110px]"
            source={require('src/assets/duck.png')}
          />
          <Text className="text-xs text-black/40 dark:text-d-text-gray/40">
            Carregando ...
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};
