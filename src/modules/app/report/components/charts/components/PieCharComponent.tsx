import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const PieCharComponent = ({
  assets,
  title,
}: {
  assets: { name: string; value: number; color: string }[];
  title: string;
}) => {
  return (
    <>
      <View className='m-auto p-4 rounded-[6px] bg-blue-four/40 w-full mt-4 mb-2'>
        <Text className='m-auto font-bold'>{title} </Text>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 10,
          zIndex: 20,
          shadowOffset: { width: 0, height: 4 },
          shadowColor: '#ccc',
          shadowOpacity: 0.8,
        }}
      >
        <PieChart radius={80} data={assets} labelsPosition='onBorder' />
        <View className='flex-col justify-center items-center gap-2'>
          {assets &&
            assets.map((act) => (
              <View key={act.name} className='flex-row items-center gap-2'>
                <View
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: act.color }}
                ></View>
                <Text>{`${act.name} ${act.value}`}</Text>
              </View>
            ))}
        </View>
      </View>
    </>
  );
};

export default PieCharComponent;
