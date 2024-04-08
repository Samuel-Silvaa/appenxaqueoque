import { useRoute } from '@react-navigation/native';
import { differenceInDays, format } from 'date-fns';
import { ptBR, tr } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
  StackedBarChart,
} from 'react-native-chart-kit';
import {
  Acuteness,
  Episode,
  ImprovementFactor,
  Location,
  Report,
  Symptom,
  Time,
  Trigger,
} from 'src/infra/@types/app.types';
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
  wrapper: 'min-h-[200px] w-full rounded-[25px] bg-white shadow-sm my-4 ',
  header:
    'bg-primary h-[10%] w-full rounded-t-[25px] flex-row justify-between items-center px-4',
  status: 'w-[26px] h-[26px] rounded-full',
  contentWrapper:
    'h-[85%] w-full p-[28px] flex-col justify-between items-center',
  content: 'bg-primary w-full rounded-[16px] p-6 flex-col justify-around ',
  summaryItem: 'flex-row gap-x-4 my-1',
  footer: 'w-full h-[50px] ',
  footerBtn: 'bg-[#F8ECDE] w-ful h-full rounded-full p-2 my-2',
  footerBtnInner:
    'bg-white w-ful h-full rounded-full p-1 flex-row items-center justify-center',
};

const ReportCard = ({
  title,
  description,
}: {
  title: string;
  description: string[];
}) => {
  return (
    <View className={stylesheet.wrapper}>
      <View className={stylesheet.header + ' bg-beige-primary/50 h-[60px]'}>
        <Text className='font-semibold text-black py-8'>{title}</Text>
      </View>
      <View className={stylesheet.contentWrapper}>
        <View className={stylesheet.content}>
          {description &&
            description.map((desc) => (
              <View className={stylesheet.summaryItem}>
                •<Text className='m-y-4 font-xs'>{desc} </Text>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
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
        <Text className='font-semibold text-black'>
          De {format(new Date(report.startDate), 'dd MMM', { locale: ptBR })} à{' '}
          {format(new Date(report.endDate), 'dd MMM', { locale: ptBR })}
        </Text>
        <View>
          <Text className='font-semibold text-black'>
            {differenceInDays(report.endDate, report.startDate)} dias
          </Text>
        </View>
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
      </View>
    </View>
  );
};

const colorList = [
  '#C8F7E1',
  '#FFCBA6',
  '#FFCACD',
  '#9194E9',
  '#EFE6FD',
  '#FFDCF1',
];

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
      [Acuteness.LIGHT, Acuteness.MILD, Acuteness.SEVERE].forEach(
        (acutenessType) => {
          monthAcutenessCount.push(
            episodes.filter(
              (ep: Episode) =>
                month == format(ep.dateTime, 'MMMM', { locale: ptBR }) &&
                acutenessType == ep.acuteness
            ).length
          );
        }
      );
    });
    return monthAcutenessCount;
  }, [episodes]);

  const time = useMemo(() => {
    const timeCount: {
      name: string;
      population: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[] = [];
    months.map((month: string) => {
      [Time.MORNING, Time.EVENING, Time.NIGHT, Time.MIDNIGHT].forEach(
        (timeType, indx) => {
          timeCount.push({
            name: timeType,
            population: episodes.filter(
              (ep: Episode) =>
                month == format(ep.dateTime, 'MMMM', { locale: ptBR }) &&
                timeType == ep.time
            ).length,
            color: colorList[indx],
            legendFontColor: '#7F7F7F',
            legendFontSize: 14,
          });
        }
      );
    });
    return timeCount;
  }, [episodes]);

  // parse list of symptoms
  const symptoms = useMemo(() => {
    const symptomsCount: {
      name: string;
      population: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[] = [];
    months.map((month: string) => {
      [
        Symptom.HALO,
        Symptom.PHOTOSENSIBILITY,
        Symptom.HYPERACUSIS,
        Symptom.NAUSEA,
        Symptom.SICKNESS,
        Symptom.VOMIT,
      ].forEach((sympType, indx) => {
        symptomsCount.push({
          name: sympType,
          population: episodes.filter(
            (ep: Episode) =>
              month == format(ep.dateTime, 'MMMM', { locale: ptBR }) &&
              sympType == ep.symptoms
          ).length,
          color: colorList[indx],
          legendFontColor: '#7F7F7F',
          legendFontSize: 14,
        });
      });
    });
    return symptomsCount;
  }, [episodes]);

  const location = useMemo(() => {
    const locationCount: {
      name: string;
      population: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[] = [];
    months.map((month: string) => {
      [Location.LEFT, Location.RIGHT, Location.BOTH, Location.BACKSIDE].forEach(
        (locationType, indx) => {
          locationCount.push({
            name: locationType,
            population: episodes.filter(
              (ep: Episode) =>
                month == format(ep.dateTime, 'MMMM', { locale: ptBR }) &&
                locationType == ep.location
            ).length,
            color: colorList[indx],
            legendFontColor: '#7F7F7F',
            legendFontSize: 14,
          });
        }
      );
    });
    return locationCount;
  }, [episodes]);

  // Parse list of triggers
  const trigger = useMemo(() => {
    const triggerCount: {
      name: string;
      population: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[] = [];
    months.map((month: string) => {
      [Trigger.FOOD, Trigger.JAGGEDSLEEP, Trigger.EMOTIONAL].forEach(
        (triggerType, indx) => {
          triggerCount.push({
            name: triggerType,
            population: episodes.filter(
              (ep: Episode) =>
                month == format(ep.dateTime, 'MMMM', { locale: ptBR }) &&
                triggerType == ep.triggers
            ).length,
            color: colorList[indx],
            legendFontColor: '#7F7F7F',
            legendFontSize: 14,
          });
        }
      );
    });
    return triggerCount;
  }, [episodes]);

  // Parse list of improvements
  const improvementFactor = useMemo(() => {
    const improvementFactorCount: {
      name: string;
      population: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[] = [];
    months.map((month: string) => {
      [
        ImprovementFactor.MEDICINE,
        ImprovementFactor.SLEEP,
        ImprovementFactor.FOOD,
      ].forEach((improvementFactorType, indx) => {
        improvementFactorCount.push({
          name: improvementFactorType,
          population: episodes.filter(
            (ep: Episode) =>
              month == format(ep.dateTime, 'MMMM', { locale: ptBR }) &&
              improvementFactorType == ep.improvementFactor
          ).length,
          color: colorList[indx],
          legendFontColor: '#7F7F7F',
          legendFontSize: 14,
        });
      });
    });
    return improvementFactorCount;
  }, [episodes]);

  const foodImprovement = useMemo(
    () => episodes.map((ep: Episode) => ep.foodImprovement),
    [episodes]
  );

  const foodImpair = useMemo(
    () => episodes.map((ep: Episode) => ep.foodImpair),
    [episodes]
  );

  return (
    <AppPageScaffold title='Relatório'>
      <View className={stylesheet.footer}>
        <Pressable className={stylesheet.footerBtn}>
          <Pressable className={stylesheet.footerBtnInner}>
            <Text>Enviar relatório para o médico </Text>
            <Image className='ml-4' source={require('assets/send.png')}></Image>
          </Pressable>
        </Pressable>
      </View>

      {!!report && <SummedUpReport report={report} />}

      <Text className='mt-4 mb-2 pl-2 font-medium '>Intensidade da dor </Text>

      <StackedBarChart
        hideLegend={true}
        data={{
          legend: [],
          labels: months,
          data: [acuteness],
          barColors: ['#C8F7E1', '#FFCBA6', '#FFCACD'],
        }}
        formatYLabel={(label) => parseInt(label).toString()}
        width={Dimensions.get('window').width - 32} // from react-native
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#f7f7f7',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            stroke: 'transparent',
          },
          style: {
            backgroundColor: '#C8F7E1',
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

      {[
        { chart: time, title: 'Período do dia em que o episódio ocorreu' },
        { chart: symptoms, title: 'Sintomas associados ao episódio' },
        { chart: location, title: 'Localização da dor' },
        { chart: trigger, title: 'Gatilhos que geraram um episódio de dor' },
        { chart: improvementFactor, title: 'Fatores de melhora' },
      ].map((data) => (
        <View>
          <Text className='mt-4 mb-2 pl-2 font-medium '>{data.title}</Text>
          <PieChart
            data={data.chart}
            width={Dimensions.get('window').width - 32} // from react-native
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#f7f7f7',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                backgroundColor: '#C8F7E1',
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
            accessor='population'
            backgroundColor='#fff'
            paddingLeft='15'
            absolute
          />
        </View>
      ))}

      {foodImprovement && (
        <ReportCard
          title='Alimentos que ajudaram a melhorar'
          description={foodImprovement}
        />
      )}

      {foodImpair && (
        <ReportCard
          title='Alimentos que foram gatilhos para a dor'
          description={foodImpair}
        />
      )}

      <ReportCard title='Observações' description={report.notes.split(',')} />

      {report.periodNotes && (
        <ReportCard
          title='Período menstrual'
          description={report.periodNotes.split(',')}
        />
      )}

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
