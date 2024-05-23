import { ReactNode } from 'react';
import { Text, View } from 'react-native';

const Wrapper = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <View className='mb-3'>
    <View className='bg-snow-white mb-4 rounded-[44px] w-full h-[40px] dark:bg-d-blue-primary '>
      <Text className='font-semibold text-black  mx-auto text-lg m-auto dark:text-d-blue-title'>
        {title}
      </Text>
    </View>

    <View className='flex-col bg-blue-four p-2 rounded-[28px] dark:bg-d-blue-primary-dark'>
      {children}
    </View>
  </View>
);

export default Wrapper;
