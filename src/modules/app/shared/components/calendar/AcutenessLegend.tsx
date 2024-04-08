import { Text, View } from 'react-native';
import { Acuteness } from 'src/infra/@types/app.types';
import { pinColor } from 'src/infra/utils/appUtils';

const AcutenessLegend = () => {
  return (
    <View className='flex-row justify-around item-center w-full my-8 '>
      <View className='flex-row items-center justify-center gapx-2'>
        <View
          style={{ backgroundColor: pinColor(Acuteness.SEVERE) }}
          className='w-[8px] h-[8px] rounded-full mx-2'
        ></View>
        <Text>Forte</Text>
      </View>
      <View className='flex-row items-center justify-center gapx-2'>
        <View
          style={{ backgroundColor: pinColor(Acuteness.MILD) }}
          className='w-[8px] h-[8px] rounded-full mx-2'
        ></View>
        <Text>Moderada</Text>
      </View>
      <View className='flex-row items-center justify-center gapx-2'>
        <View
          style={{ backgroundColor: pinColor(Acuteness.LIGHT) }}
          className='w-[8px] h-[8px] rounded-full mx-2'
        ></View>
        <Text>Leve</Text>
      </View>
    </View>
  );
};

export default AcutenessLegend;
