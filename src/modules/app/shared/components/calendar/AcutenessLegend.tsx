import { Text, View } from 'react-native';
import { Acuteness } from 'src/infra/@types/app.types';
import { pinColor } from 'src/infra/utils/appUtils';

const AcutenessLegend = () => {
  return (
    <View className='flex-row justify-around item-center w-full my-8 '>
      <View className='flex-row items-center justify-center gap-x-1'>
        <View
          style={{ backgroundColor: pinColor(Acuteness.LIGHT) }}
          className='w-[12px] h-[12px] rounded-full mx-2 shadow-md'
        ></View>
        <Text className='dark:text-d-text-gray font-[400]'>Leve</Text>
      </View>
      <View className='flex-row items-center justify-center gap-x-1'>
        <View
          style={{ backgroundColor: pinColor(Acuteness.MILD) }}
          className='w-[12px] h-[12px] rounded-full mx-2 shadow-md'
        ></View>
        <Text className='dark:text-d-text-gray font-[400]'>Moderada</Text>
      </View>

      <View className='flex-row items-center justify-center gap-x-1'>
        <View
          style={{ backgroundColor: pinColor(Acuteness.SEVERE) }}
          className='w-[12px] h-[12px] rounded-full mx-2 shadow-md'
        ></View>
        <Text className='dark:text-d-text-gray font-[400]'>Forte</Text>
      </View>
    </View>
  );
};

export default AcutenessLegend;
