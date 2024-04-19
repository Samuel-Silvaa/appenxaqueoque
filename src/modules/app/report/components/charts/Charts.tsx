import { useRoute } from '@react-navigation/native';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import {
  Acuteness,
  Episode,
  Location,
  PainType,
  Report,
  Symptom,
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
import PhysicianEmailModal from 'src/modules/shared/components/physicianEmailModal/PhysicianEmailModal';
import PieCharComponent from './components/PieCharComponent';
// import fetch_blob from 'react-native-fetch-blob';
// import RNFS from 'react-native-fs';
// import * as FileSystem from 'expo-file-system';
// // import base64 from 'react-native-base64';
// import * as Sharing from 'expo-sharing';

const stylesheet = {
  wrapper:
    'min-h-[200px] h-[300px] w-full rounded-[25px] bg-white shadow-sm my-4 ',
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
            description.map((desc, index) => (
              <View key={index} className={stylesheet.summaryItem}>
                <Text>•</Text>
                <Text className='m-y-4 font-xs'>{desc} </Text>
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
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      AppActions.REQUEST_FETCH_REPORTS_EPISODES_RANGE,
      report.episodesIds
    ).then((res) => {
      setEpisodes(res);
    });
  }, [this]);

  const acuteness = useMemo(() => {
    const dataList: Array<{ value: number; name: string; color: string }> = [];
    [Acuteness.LIGHT, Acuteness.MILD, Acuteness.SEVERE].forEach(
      (act, index) => {
        let count = 0;
        episodes.map((ep: Episode) => {
          if (ep.acuteness == act) {
            count++;
          }
        });
        dataList.push({ value: count, name: act, color: colorList[index] });
        count = 0;
      }
    );
    return dataList;
  }, [episodes]);

  const painType = useMemo(() => {
    const dataList: Array<{ value: number; name: string; color: string }> = [];
    [PainType.THROB, PainType.TIGHT].forEach((pt, index) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (ep.painType == pt) {
          count++;
        }
      });
      dataList.push({ value: count, name: pt, color: colorList[index] });
      count = 0;
    });
    return dataList;
  }, [episodes]);

  const location = useMemo(() => {
    const locationList: Array<{
      value: number;
      label: Location;
      frontColor: string;
    }> = [];
    [
      Location.FRONTALRIGHT,
      Location.FRONTALLEFT,
      Location.FRONTALBILATERAL,
      Location.PARIETALRIGHT,
      Location.PARIETALLEFT,
      Location.PARIETALBILATERAL,
      Location.TEMPLERIGHT,
      Location.TEMPLELEFT,
      Location.TEMPLEBILATERAL,
      Location.BACKSIDE,
    ].forEach((location) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (ep.location == location) {
          count++;
        }
      });
      locationList.push({
        value: count,
        label: location,
        frontColor: '#177AD5',
      });
      count = 0;
    });
    return locationList;
  }, [episodes]);

  const symptoms = useMemo(() => {
    const symptomsList: Array<{
      value: number;
      label: Symptom;
      frontColor: string;
    }> = [];
    [
      Symptom.HALO,
      Symptom.PHOTOSENSIBILITY,
      Symptom.HYPERACUSIS,
      Symptom.NAUSEA,
      Symptom.SICKNESS,
      Symptom.VOMIT,
    ].forEach((symptom) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (symptom?.includes(',')) {
          Array.from(symptom.split(',')).map((s) => {
            if (s == symptom) {
              count++;
            }
          });
        } else if (ep.symptoms == symptom) {
          count++;
        }
      });
      symptomsList.push({
        value: count,
        label: symptom,
        frontColor: '#177AD5',
      });
      count = 0;
    });
    return symptomsList;
  }, [episodes]);

  const triggers = useMemo(() => {
    const triggersList: Array<{
      value: number;
      label: Trigger;
      frontColor: string;
    }> = [];
    [Trigger.FOOD, Trigger.JAGGEDSLEEP, Trigger.EMOTIONAL].forEach(
      (trigger) => {
        let count = 0;
        episodes.map((ep: Episode) => {
          if (trigger?.includes(',')) {
            Array.from(trigger.split(',')).map((t) => {
              if (t == trigger) {
                count++;
              }
            });
          } else if (ep.triggers == trigger) {
            count++;
          }
        });
        triggersList.push({
          value: count,
          label: trigger,
          frontColor: '#177AD5',
        });
        count = 0;
      }
    );
    return triggersList;
  }, [episodes]);

  const locationMaxValue = useMemo(() => {
    let greater = 0;

    location.map((loc) => {
      if (loc.value > greater) {
        greater = loc.value;
      }
    });
    return greater;
  }, [location]);

  const symptomsMaxValue = useMemo(() => {
    let greater = 0;

    symptoms.map((loc) => {
      if (loc.value > greater) {
        greater = loc.value;
      }
    });
    return greater;
  }, [symptoms]);

  const triggersMaxValue = useMemo(() => {
    let greater = 0;

    triggers.map((loc) => {
      if (loc.value > greater) {
        greater = loc.value;
      }
    });
    return greater;
  }, [triggers]);

  const foodImprovement = useMemo(
    () => episodes.map((ep: Episode) => ep.foodImprovement),
    [episodes]
  );

  const foodImpair = useMemo(
    () => episodes.map((ep: Episode) => ep.foodImpair),
    [episodes]
  );
  return (
    <AppPageScaffold>
      <View className={stylesheet.footer}>
        <Pressable className={stylesheet.footerBtn}>
          <Pressable
            className={stylesheet.footerBtnInner}
            onPress={() => {
              setEmailModalOpen(true);
            }}
          >
            <Text>Enviar relatório para o médico </Text>
            <Image className='ml-4' source={require('assets/send.png')}></Image>
          </Pressable>
        </Pressable>
      </View>
      {!!report && <SummedUpReport report={report} />}

      <View className='m-auto p-4 rounded-[6px] bg-blue-four/40 w-full mt-4 mb-2'>
        <Text className='m-auto font-bold'>Localização da dor </Text>
      </View>

      {location && (
        <View
          style={{
            backgroundColor: '#fff',
            paddingBottom: 40,
            borderRadius: 10,
            zIndex: 20,
            overflow: 'hidden',
          }}
        >
          <BarChart
            verticalLinesZIndex={20}
            showXAxisIndices
            barWidth={18}
            spacing={10}
            data={location}
            width={Dimensions.get('window').width - 32}
            showValuesAsTopLabel
            xAxisLabelsVerticalShift={60}
            xAxisLabelTextStyle={{
              transform: 'rotate(50deg) translate(-20px,10px)',
            }}
            labelWidth={110}
            hideYAxisText
            labelsExtraHeight={20}
            barBorderRadius={3}
            yAxisThickness={1}
            xAxisThickness={1}
            xAxisColor='#ccc'
            yAxisColor='#CCC'
            maxValue={locationMaxValue ? locationMaxValue + 1 : 10}
          />
        </View>
      )}

      <View className='m-auto p-4 rounded-[6px] bg-blue-four/40 w-full mt-4 mb-2'>
        <Text className='m-auto font-bold'>Sintomas associados à dor </Text>
      </View>

      {symptoms && (
        <View
          style={{
            backgroundColor: '#fff',
            paddingBottom: 40,
            borderRadius: 10,
            marginVertical: 40,
            overflow: 'hidden',
          }}
        >
          <BarChart
            verticalLinesZIndex={20}
            showXAxisIndices
            barWidth={18}
            spacing={10}
            data={symptoms}
            width={Dimensions.get('window').width - 32}
            showValuesAsTopLabel
            xAxisLabelsVerticalShift={60}
            xAxisLabelTextStyle={{
              transform: 'rotate(50deg) translate(-20px,10px)',
            }}
            labelWidth={110}
            hideYAxisText
            labelsExtraHeight={20}
            barBorderRadius={3}
            yAxisThickness={1}
            xAxisThickness={1}
            xAxisColor='#ccc'
            yAxisColor='#CCC'
            maxValue={symptomsMaxValue ? symptomsMaxValue + 1 : 10}
          />
        </View>
      )}

      <View className='m-auto p-4 rounded-[6px] bg-blue-four/40 w-full mt-4 mb-2'>
        <Text className='m-auto font-bold'>Fatores desencadeantes da dor </Text>
      </View>

      {triggers && (
        <View
          style={{
            backgroundColor: '#fff',
            paddingBottom: 40,
            borderRadius: 10,
            marginVertical: 40,
            overflow: 'hidden',
          }}
        >
          <BarChart
            verticalLinesZIndex={20}
            showXAxisIndices
            barWidth={18}
            spacing={12}
            data={triggers}
            width={Dimensions.get('window').width - 32}
            showValuesAsTopLabel
            xAxisLabelsVerticalShift={40}
            xAxisLabelTextStyle={{
              transform: 'rotate(40deg) translate(-20px,10px)',
            }}
            labelWidth={130}
            hideYAxisText
            labelsExtraHeight={20}
            barBorderRadius={3}
            yAxisThickness={1}
            xAxisThickness={1}
            xAxisColor='#ccc'
            yAxisColor='#CCC'
            maxValue={triggersMaxValue ? triggersMaxValue + 1 : 10}
          />
        </View>
      )}

      <PieCharComponent assets={acuteness} title='Intensidade da dor' />
      <PieCharComponent assets={painType} title='Característica da dor' />

      {/* {[
        { chart: acuteness, title: 'Intensidade da dor' },
        { chart: painType, title: 'Característica da dor' },
      ].map((data, i) => (
        <View key={i}>
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

      <Text className='mt-4 mb-2 pl-2 font-medium '>Localização da dor </Text> */}
      {/* <StackedBarChart
        hideLegend={true}
        data={{
          legend: [],
          labels: months,
          data: location,
          barColors: [
            '#C8F7E1',
            '#FFCBA6',
            '#FFCACD',
            '#C8F7E1',
            '#FFCBA6',
            '#FFCACD',
            '#C8F7E1',
            '#FFCBA6',
            '#FFCACD',
          ],
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
          shadowColor: '#fff',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
        }}
      /> */}
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
      <PhysicianEmailModal
        isOpen={emailModalOpen}
        report={report}
        onClose={() => {
          setEmailModalOpen(false);
        }}
      />
    </AppPageScaffold>
  );
};

export default ChartsPage;
