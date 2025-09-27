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
  wrapper: 'rounded-[25px] bg-white dark:bg-d-blue-primary shadow-sm my-4 ',
  header:
    'bg-gray-light/80 h-[62px] w-full rounded-t-[25px] flex-row justify-between items-center px-8',
  status: 'w-[26px] h-[26px] rounded-full',
  contentWrapper: 'w-full p-[28px] flex-col justify-between items-center',
  content: 'bg-primary w-full rounded-[25px] p-6 flex-col justify-around ',
  summaryItem: 'flex-row gap-x-4 my-1',
};
export const SummedUpReport = (data: { report: Report }) => {
  const { report } = data;

  console.log(report);
  return (
    <View className={stylesheet.wrapper}>
      <View className={stylesheet.header}>
        <View
          className={stylesheet.status}
          style={{ backgroundColor: pinColor(report.acuteness) }}
        ></View>
        <Text className='font-semibold text-black dark:text-d-text-dark'>
          De {format(new Date(report.startDate), 'dd MMM', { locale: ptBR })} à{' '}
          {format(new Date(report.endDate), 'dd MMM', { locale: ptBR })}
        </Text>
        <View>
          <Text className='font-semibold text-black dark:text-d-text-dark'>
            {differenceInDays(report.endDate, report.startDate)} dias
          </Text>
        </View>
      </View>
      <View className={stylesheet.contentWrapper}>
        <Text className='dark:text-d-text-dark mb-6'>
          {' '}
          Média de valores do relatório
        </Text>
        <View className={stylesheet.content}>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-doc.png')}
            />
            <Text className='dark:text-d-text-dark'>
              {report.episodeAmount} episódios
            </Text>
          </View>

          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-clock.png')}
            />
            <Text className='dark:text-d-text-dark'>
              {parseTime(report.time)}{' '}
            </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-header-location.png')}
            />
            <Text className='dark:text-d-text-dark'>
              {parseLocation(report.location)}{' '}
            </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-acuteness.png')}
            />
            <Text className='dark:text-d-text-dark'>
              {parseAcuteness(report.acuteness)}{' '}
            </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-sad.png')}
            />
            <Text className='dark:text-d-text-dark'>
              {parsePainType(report.painType)}{' '}
            </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-symptom.png')}
            />
            <Text className='dark:text-d-text-dark'>
              {parseSymptoms(report.symptoms)}{' '}
            </Text>
          </View>
          <View className={stylesheet.summaryItem}>
            <Image
              className='w-4 h-4'
              source={require('src/assets/chart-trigger.png')}
            />
            <Text className='dark:text-d-text-dark'>
              {parseTriggers(report.triggers)}{' '}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
