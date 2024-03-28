import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
  StackedBarChart,
} from 'react-native-chart-kit';
import { Acuteness, Episode, Report } from 'src/infra/@types/app.types';
import { AppActions } from 'src/infra/app/actions';
import { useApp } from 'src/infra/app/app';
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
import AcutenessLegend from 'src/modules/app/shared/components/calendar/AcutenessLegend';

const stylesheet = {
  wrapper: 'min-h-[200px] w-full rounded-[25px] bg-white shadow-sm my-4',
  header:
    'bg-primary h-[10%] w-full rounded-t-[25px] flex-row justify-between items-center px-4',
  status: 'w-[26px] h-[26px] rounded-full',
  contentWrapper:
    'h-[85%] w-full p-[28px] flex-col justify-between items-center',
  content: 'bg-primary w-full rounded-[16px] p-6 flex-col justify-around ',
  summaryItem: 'flex-row gap-x-4 my-1',
  footer: 'w-full h-[20%]',
  footerBtn: 'bg-[#F8ECDE] w-ful h-full rounded-full p-2 my-2',
  footerBtnInner:
    'bg-white w-ful h-full rounded-full p-1 flex-row items-center justify-center',
};

const SummedUpReport = (data: { report: Report }) => {
  const { report } = data;
  return (
    <View className={stylesheet.wrapper}>
      <View className={stylesheet.header}>
        <View
          className={stylesheet.status}
          style={{ backgroundColor: pinColor(report.acuteness) }}
        ></View>
        <Text>
          {format(new Date(report.startDate), 'dd MMM', { locale: ptBR })} -{' '}
          {format(new Date(report.endDate), 'dd MMM', { locale: ptBR })}
        </Text>
        <View></View>
      </View>
      <View className={stylesheet.contentWrapper}>
        <View className={stylesheet.content}>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('assets/chart-doc.png')}
            />
            <Text>{report.episodeAmount} episódios</Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('assets/chart-clock.png')}
            />
            <Text>{parseTime(report.time)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('assets/chart-header-location.png')}
            />
            <Text>{parseLocation(report.location)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('assets/chart-acuteness.png')}
            />
            <Text>{parseAcuteness(report.acuteness)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('assets/chart-sad.png')}
            />
            <Text>{parsePainType(report.painType)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('assets/chart-symptom.png')}
            />
            <Text>{parseSymptoms(report.symptoms)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('assets/chart-trigger.png')}
            />
            <Text>{parseTriggers(report.triggers)} </Text>
          </View>
        </View>
        <View className={stylesheet.footer}>
          <Pressable className={stylesheet.footerBtn}>
            <Pressable className={stylesheet.footerBtnInner}>
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
  const route = useRoute();
  const { dispatch } = useApp();
  const [report, _] = useState<Report>(route.params['reportDetails']);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    dispatch(
      AppActions.REQUEST_FETCH_REPORTS_EPISODES_RANGE,
      report.episodesIds
    ).then((res) => {
      setEpisodes(res);
    });
  }, [this]);

  const months = useMemo(() => {
    const monthsList: string[] = [];
    episodes.map((ep: Episode) => {
      if (
        ep?.dateTime &&
        !monthsList.includes(format(ep?.dateTime, 'MMMM', { locale: ptBR }))
      ) {
        monthsList.push(format(ep?.dateTime, 'MMMM', { locale: ptBR }));
      }
      return ep;
    });
    return monthsList;
  }, [episodes]);

  const acuteness = useMemo(() => {
    const monthAcutenessCount: number[] = [];
    months.map((month: string) => {
      [Acuteness.LIGHT, Acuteness.MILD, Acuteness.SEVERE].forEach((indx) => {
        monthAcutenessCount.push(
          episodes.filter(
            (ep: Episode) =>
              month == format(ep.dateTime, 'MMMM', { locale: ptBR }) &&
              indx == ep.acuteness
          ).length
        );
      });
    });
    return monthAcutenessCount;
  }, [episodes]);

  return (
    <AppPageScaffold title='Relatório'>
      {!!report && <SummedUpReport report={report} />}

      <Text className='mt-4 mb-2 pl-2 font-medium '>Intensidade da dor </Text>

      <BarChart
        data={{
          labels: months,
          datasets: [
            {
              data: acuteness,
              colors: [() => '#C8F7E1', () => '#FFCBA6', () => '#FFCACD'],
            },
          ],
        }}
        width={Dimensions.get('window').width - 32} // from react-native
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#f7f7f7',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            stroke: 'transparent',
          },
          style: {
            borderRadius: 30,
            padding: 24,
          },
        }}
        style={{
          borderRadius: 16,
          shadowColor: '#ccc',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
        }}
      />
      <AcutenessLegend />

      {/* <BarChart
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
      /> */}

      {/* <PieChart
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
      /> */}
    </AppPageScaffold>
  );
};

export default ChartsPage;
