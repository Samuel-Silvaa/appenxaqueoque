import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Report } from 'src/infra/@types/app.types';
import {
  parseAcuteness,
  parseLocation,
  parsePainType,
  parseSymptoms,
  parseTime,
  parseTriggers,
  pinColor,
} from 'src/infra/utils/appUtils';
import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';

const SummedUpReport = () => {
  const route = useRoute();
  const [report, _] = useState<Report>(route.params['reportDetails']);
  return (
    <View className='h-2/4 w-full rounded-[25px] bg-white'>
      <View className='bg-primary h-[10%] w-full rounded-t-[25px] flex-row justify-between items-center px-4'>
        <View
          className='w-[26px] h-[26px] rounded-full'
          style={{ backgroundColor: pinColor(report.acuteness) }}
        ></View>
        <Text>
          {format(report.startDate, 'dd MMM', { locale: ptBR })} -
          {format(report.endDate, 'dd MMM', { locale: ptBR })} -
        </Text>
        <View></View>
      </View>
      <View className='h-[90%] w-full p-[28px] flex-col justify-between items-center'>
        <View className='bg-primary w-full h-[70%] rounded-[16px] p-6 flex-col justify-around '>
          <View className='flex-row gap-x-4'>
            <Image source={require('assets/stats.png')}></Image>
            <Text>{report.episodeAmount} episódios</Text>
          </View>
          <View className='flex-row gap-x-4'>
            <Image source={require('assets/stats.png')}></Image>
            <Text>{parseTime(report.time)} </Text>
          </View>
          <View className='flex-row gap-x-4'>
            <Image source={require('assets/stats.png')}></Image>
            <Text>{parseLocation(report.location)} </Text>
          </View>
          <View className='flex-row gap-x-4'>
            <Image source={require('assets/stats.png')}></Image>
            <Text>{parseAcuteness(report.acuteness)} </Text>
          </View>
          <View className='flex-row gap-x-4'>
            <Image source={require('assets/stats.png')}></Image>
            <Text>{parsePainType(report.painType)} </Text>
          </View>
          <View className='flex-row gap-x-4'>
            <Image source={require('assets/stats.png')}></Image>
            <Text>{parseSymptoms(report.symptoms)} </Text>
          </View>
          <View className='flex-row gap-x-4'>
            <Image source={require('assets/stats.png')}></Image>
            <Text>{parseTriggers(report.triggers)} </Text>
          </View>
        </View>
        <View className='w-full h-[20%]'>
          <Pressable className='bg-primary w-ful h-full rounded-full p-2'>
            <Pressable className='bg-white w-ful h-full rounded-full p-1 flex-row items-center justify-center'>
              <Text>Enviar relatório para o médico </Text>
              <Image
                className='ml-4'
                source={require('assets/send.png')}
              ></Image>
            </Pressable>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const ChartsPage = () => {
  return (
    <AppPageScaffold title='Relatório'>
      <SummedUpReport />

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

export default ChartsPage;
