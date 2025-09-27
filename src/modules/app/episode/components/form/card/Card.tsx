import { ReactNode, useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';

const Card = ({
  children,
  image,
  onPress,
  title,
  isHeart = false,
  ...res
}: {
  children: ReactNode;
  image?: ImageSourcePropType;
  onPress?: () => void;
  title?: string;
  isHeart?: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isHeart) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1); // reset if not heart
    }
  }, [isHeart, scaleAnim]);

  return (
    <Pressable
      {...res}
      onPress={onPress}
      className='flex-col w-full rounded-[30px] bg-white py-2 px-2 my-2 drop-shadow-md dark:bg-d-blue-primary shadow-lg'
    >
      {title && (
        <Text className='font-semibold text-black my-2 mx-auto text-lg dark:text-d-blue-title '>
          {title}
        </Text>
      )}
      {image && (
        <View className='w-full min-h-[120px] max-h-2/3 flex items-center border-b border-gray-light pt-4 dark:border-d-text-gray relative'>
          <Image
            resizeMode='contain'
            className='w-[100%] h-[260]'
            source={image}
          />
          {isHeart && (
            <Animated.View
              style={{ transform: [{ scale: scaleAnim }] }}
              className='absolute top-12 z-10 m-auto rounded-full bg-white p-2 opacity-90'
            >
              <Image
                resizeMode='contain'
                className='w-12 h-12'
                source={require('src/assets/heart.png')}
              />
            </Animated.View>
          )}
        </View>
      )}
      <View className='w-full my-auto flex flex-wrap p-2 dark:text-d-text-gray'>
        {children}
      </View>
    </Pressable>
  );
};

export default Card;
