import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Image, Text, View } from 'react-native';
import { Report } from 'src/infra/@types/app.types';
import {
  pinColor,
  parseTime,
  parseLocation,
  parseAcuteness,
  parsePainType,
  parseSymptoms,
  parseTriggers,
} from 'src/infra/utils/appUtils';

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
};

export const SummedUpReport = (data: { report: Report }) => {
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
              source={require('src/assets/chart-doc.png')}
            />
            <Text>{report.episodeAmount} episódios</Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-clock.png')}
            />
            <Text>{parseTime(report.time)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-header-location.png')}
            />
            <Text>{parseLocation(report.location)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-acuteness.png')}
            />
            <Text>{parseAcuteness(report.acuteness)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-sad.png')}
            />
            <Text>{parsePainType(report.painType)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-symptom.png')}
            />
            <Text>{parseSymptoms(report.symptoms)} </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-trigger.png')}
            />
            <Text>{parseTriggers(report.triggers)} </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
