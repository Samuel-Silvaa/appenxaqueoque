import { Image, TouchableOpacity, View } from 'react-native';

export const CloseButton = ({ onClose }: { onClose: () => void }) => {
  return <View className='relative'>
    <TouchableOpacity
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={() => onClose()}
    >
      <View className=' p-2 rounded-full w-8 h-8 bg-gray-300/20 flex items-center justify-center'>
        <Image
          className='w-6 h-6'
          source={require('src/assets/close-white.png')}
        ></Image>
      </View>
    </TouchableOpacity>
  </View>;
};
