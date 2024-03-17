import { ReactNode } from 'react';
import { Image, ImageSourcePropType, Pressable, View } from 'react-native';

const Card = ({
  children,
  image,
  onPress,
}: {
  children: ReactNode;
  image?: ImageSourcePropType;
  onPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className='flex-col w-full rounded-[30px] bg-white py-3 px-2 my-2 shadow-md'
  >
    {image && (
      <View className='w-full min-h-[120px] max-h-2/3 flex items-center border-b border-gray py-4'>
        <Image resizeMode='cover' source={image} />
      </View>
    )}
    <View className={`w-3/4 ${!image ? ' ' : ' pt-4 my-auto'}`}>
      {children}
    </View>
  </Pressable>
);

export default Card;
