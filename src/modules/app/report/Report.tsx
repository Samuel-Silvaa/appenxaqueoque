import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { Dimensions, Image, Pressable, Text, FlatList } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screenOptions from 'src/modules/shared/style/StackOptions';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';

const stylesheet = {
  resourceCard:
    'w-full flex-row items-center p-4 my-1 bg-white rounded-[30px] min-h-[86px]',
  report: {
    wrapper: 'w-full bg-primary p-4 pt-[60px] ',
  },
};

const ReportStack = createNativeStackNavigator();

const ReportStackNavigation = () => {
  return (
    <ReportStack.Navigator>
      <ReportStack.Screen
        options={screenOptions}
        name='ReportList'
        component={ReportPage}
      ></ReportStack.Screen>
      <ReportStack.Screen
        options={screenOptions}
        name='Charts'
        component={ChartsPage}
      ></ReportStack.Screen>
    </ReportStack.Navigator>
  );
};

const ResourceCard = ({
  title,
  navigation,
}: {
  title: string;
  navigation?: any;
}) => {
  return (
    <Pressable
      className={stylesheet.resourceCard}
      onPress={() => {
        navigation.navigate('Charts');
      }}
    >
      <Image className='mr-3' source={require('assets/stats.svg')}></Image>
      <Text>{title}</Text>
    </Pressable>
  );
};

const ReportPage = ({ navigation }) => {
  return (
    <AppPageScaffold title='Relatório'>
      {[
        { key: '123123asdasd' },
        { key: '123123asdasd12312' },
        { key: '4512123' },
      ].map((report, index) => (
        <ResourceCard key={index} title='Relatório' navigation={navigation} />
      ))}
    </AppPageScaffold>
  );
};

const ChartsPage = () => {
  return (
    <AppPageScaffold title='Relatório'>
      <Text className={sharedStyleSheet.title}> Relatório</Text>
      <Text className={sharedStyleSheet.subtitle}>05/01/2024 - 05/03/2024</Text>

      <LineChart
        data={{
          labels: ['Janeiro', 'Fevereiro', 'Março'],
          datasets: [
            {
              data: [3, 5, 1],
            },
          ],
        }}
        width={Dimensions.get('window').width - 32} // from react-native
        height={220}
        chartConfig={{
          backgroundColor: '#8FD7FF',
          backgroundGradientFrom: '#A5D1EA',
          backgroundGradientTo: '#B4CFE6',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 30,
            paddingTop: 20,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#F7F7F7',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      <BarChart
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        chartConfig={{
          backgroundColor: '#8FD7FF',
          backgroundGradientFrom: '#A5D1EA',
          backgroundGradientTo: '#B4CFE6',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 30,
            paddingTop: 20,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#F7F7F7',
          },
        }}
        yAxisLabel=''
        yAxisSuffix=''
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
            },
          ],
        }}
        width={Dimensions.get('window').width - 32} // from react-native
        height={220}
        verticalLabelRotation={30}
      />

      <PieChart
        data={[
          {
            name: 'Seoul',
            population: 21500000,
            color: 'rgba(131, 167, 234, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Toronto',
            population: 2800000,
            color: '#F00',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Beijing',
            population: 527612,
            color: 'red',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'New York',
            population: 8538000,
            color: '#ffffff',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Moscow',
            population: 11920000,
            color: 'rgb(0, 0, 255)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ]}
        width={Dimensions.get('window').width - 32} // from react-native
        height={220}
        chartConfig={{
          backgroundColor: '#8FD7FF',
          backgroundGradientFrom: '#A5D1EA',
          backgroundGradientTo: '#B4CFE6',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 30,
            paddingTop: 20,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#F7F7F7',
          },
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        center={[10, 50]}
        absolute
      />
    </AppPageScaffold>
  );
};

export default ReportStackNavigation;
