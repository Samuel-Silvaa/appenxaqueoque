import { ReactNode } from 'react';
import { Text, View } from 'react-native';

const Wrapper = ({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) => (
  <View className='mb-3'>
    {title && (
      <View className='mb-4 rounded-[44px] w-full dark:bg-d-blue-primary shadow-lg'>
      <Text className='font-semibold text-black mx-auto text-lg m-auto dark:text-d-blue-title px-3 flex-wrap break-line flex-grow'>
        {title}
      </Text>
    </View>
    )}

    <View className='flex-col bg-blue-four p-[22px] rounded-[60px] dark:bg-d-blue-primary-dark'>
      {children}
    </View>
  </View>
);

export default Wrapper;
