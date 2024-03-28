import { Text, View } from 'react-native';
import { Acuteness } from 'src/infra/@types/app.types';
import { pinColor } from 'src/infra/utils/appUtils';

const AcutenessLegend = () => {
  return (
    <View className='flex-row justify-around item-center w-full my-8 '>
      <Text>
        <View
          style={{ backgroundColor: pinColor(Acuteness.SEVERE) }}
          className='w-3 h-3 rounded-full mx-2'
        ></View>
        Forte
      </Text>
      <Text>
        <View
          style={{ backgroundColor: pinColor(Acuteness.MILD) }}
          className='w-3 h-3 rounded-full  mx-2'
        ></View>
        Moderada
      </Text>
      <Text>
        <View
          style={{ backgroundColor: pinColor(Acuteness.LIGHT) }}
          className='w-3 h-3 rounded-full  mx-2'
        ></View>
        Leve
      </Text>
    </View>
  );
};

export default AcutenessLegend;
