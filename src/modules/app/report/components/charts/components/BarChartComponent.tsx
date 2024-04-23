import { Dimensions, Text, View } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';

export const BarChartComponent = ({
  dataset,
  maxValue,
  title,
}: {
  dataset: Array<barDataItem>;
  maxValue: number;
  title: string;
}) => {
  return (
    <>
      <View className='m-auto p-4 rounded-[6px] bg-blue-four/40 w-full mt-4 mb-2'>
        <Text className='m-auto font-bold'> {title} </Text>
      </View>

      {dataset && (
        <View
          style={{
            backgroundColor: '#fff',
            paddingBottom: 60,
            paddingTop: 20,
            borderRadius: 10,
            shadowOffset: { width: 2, height: 4 },
            shadowColor: '#ccc',
            shadowOpacity: 0.8,
            zIndex: 20,
          }}
        >
          <BarChart
            showXAxisIndices
            barWidth={18}
            spacing={12}
            data={dataset}
            width={Dimensions.get('window').width - 62}
            showValuesAsTopLabel
            xAxisLabelsVerticalShift={50}
            xAxisLabelTextStyle={{
              transform: 'rotate(50deg)',
              textAlign: 'start',
            }}
            labelWidth={110}
            hideYAxisText
            labelsExtraHeight={20}
            barBorderRadius={3}
            yAxisThickness={1}
            xAxisThickness={1}
            xAxisColor='#ccc'
            yAxisColor='#CCC'
            maxValue={maxValue ? maxValue + 1 : 10}
          />
        </View>
      )}
    </>
  );
};
