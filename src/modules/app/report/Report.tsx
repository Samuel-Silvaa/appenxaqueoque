import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { Image, Pressable, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screenOptions from 'src/modules/shared/style/StackOptions';
import { useApp } from 'src/infra/app/app';
import { useEffect } from 'react';
import { AppActions } from 'src/infra/app/actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseAcuteness, pinColor } from 'src/infra/utils/appUtils';
import ChartsPage from './components/charts/Charts';
import { Report } from 'src/infra/@types/app.types';

const stylesheet = {
  reportCard:
    'w-full flex-row items-start p-3 my-1 bg-white rounded-[30px] min-h-[86px]',
  reportCardColor: 'h-[80%] rounded-full w-2 mr-4 py-2 self-center',
  reportCardHeader: 'flex-col h-full',
  reportCardDesc: 'mt-2 h-2/4 w-2/4 truncate',
};

const ResourceCard = ({
  reportDetails,
  navigation,
}: {
  reportDetails: Report;
  navigation?: any;
}) => {
  return (
    <Pressable
      className={stylesheet.reportCard}
      onPress={() => {
        navigation.navigate('Charts', { reportDetails });
      }}
    >
      <View
        className={stylesheet.reportCardColor}
        style={{ backgroundColor: pinColor(reportDetails.acuteness) }}
      ></View>
      <View className={stylesheet.reportCardHeader}>
        <Text className='font-semibold capitalize'>
          {format(reportDetails.startDate, 'dd MMM', { locale: ptBR })} -
          {format(reportDetails.endDate, 'dd MMM', { locale: ptBR })} -
          <Text className='ml-2 font-medium'>
            {parseAcuteness(reportDetails.acuteness)}
          </Text>
        </Text>
        <Text className={stylesheet.reportCardDesc}>
          Lorem ipsum dolor sit amet consectetur dispsi{' '}
        </Text>
      </View>

      <Image
        className='self-center'
        source={require('assets/arrowright.png')}
      ></Image>
    </Pressable>
  );
};

const ReportPage = ({ navigation }) => {
  const { dispatch, reports } = useApp();

  useEffect(() => {
    dispatch(AppActions.REQUEST_FETCH_REPORTS);
  }, []);

  return (
    <AppPageScaffold title='Relatórios'>
      {reports &&
        reports.map((report) => (
          <ResourceCard
            key={report.id}
            reportDetails={report}
            navigation={navigation}
          />
        ))}
    </AppPageScaffold>
  );
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

export default ReportStackNavigation;
