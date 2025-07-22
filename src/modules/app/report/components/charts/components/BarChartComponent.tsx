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
      <View className='m-auto p-4 rounded-full bg-snow-white-secondary dark:bg-d-blue-primary mt-4 mb-2'>
        <Text className='m-auto font-bold dark:text-white'> {title} </Text>
      </View>

      {dataset && (
        <View
          style={{
            backgroundColor: '#fff',
            paddingBottom: 60,
            paddingTop: 20,
            borderRadius: 25,
            shadowOffset: { width: 2, height: 4 },
            shadowColor: '#ccc',
            shadowOpacity: 0.8,
            zIndex: 20,
          }}
        >
          <BarChart
            barBorderTopRightRadius={4}
            barBorderTopLeftRadius={4}
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
            labelWidth={130}
            hideYAxisText
            labelsExtraHeight={40}
            barBorderRadius={4}
            yAxisThickness={1}
            xAxisThickness={1}
            xAxisColor='#ccc'
            yAxisColor='#CCC'
            maxValue={maxValue ? maxValue + 1 : 10}
            barMarginBottom={4}
          />
        </View>
      )}
    </>
  );
};
