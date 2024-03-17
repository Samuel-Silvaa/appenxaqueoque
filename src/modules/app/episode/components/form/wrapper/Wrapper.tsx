import { ReactNode } from 'react';
import { Text, View } from 'react-native';

const Wrapper = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <View>
    <Text className='font-semibold text-black my-4 mx-auto text-lg'>
      {title}
    </Text>
    <View className='flex-col bg-blue-four p-4 rounded-[40px]'>{children}</View>
  </View>
);

export default Wrapper;
