import { ReactNode } from 'react';
import {
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
  ...res
}: {
  children: ReactNode;
  image?: ImageSourcePropType;
  onPress?: () => void;
  title?: string;
}) => (
  <Pressable
    {...res}
    onPress={onPress}
    className='flex-col w-full rounded-[30px] bg-white py-2 px-2 my-2 drop-shadow-md dark:bg-d-blue-primary '
  >
    {title && (
      <Text className='font-semibold text-black my-2 mx-auto text-lg dark:text-d-blue-title'>
        {title}
      </Text>
    )}
    {image && (
      <View className='w-full min-h-[120px] max-h-2/3 flex items-center border-b border-gray-light pt-4 dark:border-d-text-gray'>
        <Image resizeMode='contain' className='w-[90%]' source={image} />
      </View>
    )}
    <View className='w-full my-auto flex flex-wrap p-2 dark:text-d-text-gray'>
      {children}
    </View>
  </Pressable>
);

export default Card;
