import { ScrollView } from 'react-native-gesture-handler';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { Image, Text, View } from 'react-native';

const ReportCard = ({ title }: { title: string }) => {
  return (
    <View className='w-full flex-row items-center p-4 my-1 bg-white rounded-[30px] min-h-[86px]'>
      <Image className='mr-3' source={require('assets/stats.svg')}></Image>
      <Text>{title}</Text>
    </View>
  );
};

const ReportPage = () => {
  return (
    <AppPageScaffold>
      <ScrollView className='w-full'>
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
        <ReportCard title='Relatório' />
      </ScrollView>
    </AppPageScaffold>
  );
};

export default ReportPage;
