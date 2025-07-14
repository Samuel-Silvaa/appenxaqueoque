import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screenOptions from 'src/modules/shared/style/StackOptions';
import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseAcuteness, pinColor } from 'src/infra/utils/appUtils';
import ChartsPage from './components/charts/Charts';
import { Report } from 'src/infra/@types/app.types';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import ReportDateRangeModal from 'src/modules/shared/components/reportDateRangeModal/ReportDateRangeModal';
import { useAsyncAppDispatch } from "src/infra/app/store";
import { useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFecthReports } from "src/infra/app/reducers/app.reducer";

const stylesheet = {
  reportCard:
    'w-full flex-row items-start p-3 my-1 bg-white dark:bg-d-blue-primary rounded-[30px] h-[90px]',
  reportCardColor: 'h-[80%] rounded-full w-2 mr-4 py-2 self-center',
  reportCardHeader: 'flex-col h-full w-[80%]',
  reportCardDesc:
    'mt-2 w-3/4 h-3/4 text-ellipsis overflow-hidden ... opacity-50 dark:text-d-text-gray',
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
        <Text className='font-semibold capitalize dark:text-d-text-gray'>
          {format(reportDetails.startDate || new Date(), 'dd MMM', { locale: ptBR })} -
          {format(reportDetails.endDate! || subDays(new Date(), 15), 'dd MMM', { locale: ptBR })} -
          <Text className='ml-2 font-medium dark:text-d-text-gray'>
            {' '}
            {parseAcuteness(reportDetails.acuteness)}
          </Text>
        </Text>
        {!!reportDetails?.notes ? (
          <Text className={stylesheet.reportCardDesc}>
            {reportDetails.notes
              .replaceAll(',', ' ')
              .substring(0, Dimensions.get('window').width * 0.14) +
              (reportDetails.notes.length >
              Dimensions.get('window').width * 0.14
                ? '...'
                : '')}
          </Text>
        ) : (
          <Text className={stylesheet.reportCardDesc}>Sem anotações</Text>
        )}
      </View>

      <Image
        className='self-center'
        source={require('src/assets/arrowright.png')}
      ></Image>
    </Pressable>
  );
};

const ReportPage = ({ navigation }) => {
  const dispatch = useAsyncAppDispatch();
  const appState = useSelector(appStateSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const dateStringFormat = 'PPP';
  const [selectedDate, setSelectedDate] = useState({
    start: format(subDays(new Date(), 15), dateStringFormat, { locale: ptBR }),
    end: format(new Date(), dateStringFormat, { locale: ptBR }),
  });

  const {
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if(appState.patient?.id)
    dispatch(handleFecthReports({patientId:appState.patient!.id, date: {date: {
      startDate: format(subDays(new Date(), 15), 'yyyy-MM-dd', { locale: ptBR }),
      endDate: format(new Date(), 'yyyy-MM-dd', { locale: ptBR }),
    }}}));
  }, []);

  return (
    <AppPageScaffold title='Relatórios'>
      <View className='flex-col items-center justify-between my-4 gap-y-4'>
        <View className='w-full pr-2 h-[45px] mb-4'>
          <InputContainer
            className='bg-[#FAFAFA] rounded-[16px] h-[45px]'
            placeholder='Pesquisar'
            label=''
            name='search'
            setValue={setValue}
            errors={errors}
          ></InputContainer>
        </View>
        <View className='flex-row justify-between items-center w-full '>
          <ExPressable
            className='rounded-full w-2/4 h-[45px] bg-blue-primary/70 dark:text-white'
            title='Gerar relatório'
            onPress={() => setIsModalOpen(true)}
          />
          <ExPressable
            className='rounded-full w-[40%] h-[45px]'
            title='Filtrar'
            onPress={() => setIsFilterModalOpen(true)}
          />
        </View>

        <View className='self-start px-2'>
          <Text className='dark:text-d-text-gray'>
            {selectedDate.start} à {selectedDate.end}
          </Text>
        </View>
        <View className='bg-snow-white dark:bg-d-blue-primary mb-4 rounded-[44px] w-full h-[45px]'>
          <Text className='font-semibold text-black dark:text-d-text-gray mx-auto text-md m-auto '>
            Visualize e envie um relatório ao seu médico
          </Text>
        </View>
      </View>

      {appState.reports &&
        appState.reports.map((report) => (
          <ResourceCard
            key={report.id}
            reportDetails={report}
            navigation={navigation}
          />
        ))}

      {appState.reports?.length == 0 && (
        <View className='rounded-[16px] h-[45px] bg-blue-primary/30 flex items-center justify-center m-auto m-4'>
          <Text className='font-semibold'>
            Nenhum relatório foi gerado para este período.
          </Text>
        </View>
      )}

      {isModalOpen && (
        <ReportDateRangeModal
          isOpen={isModalOpen}
          onClose={(dates) => setIsModalOpen(false)}
        />
      )}
      {isFilterModalOpen && (
        <ReportDateRangeModal
          filter
          isOpen={isFilterModalOpen}
          onClose={(dates) => {
            setIsFilterModalOpen(false);
            if (dates && dates.start && dates.end && appState.patient?.id) 
            {
              setSelectedDate({
                start: format(dates.start, dateStringFormat, { locale: ptBR }),
                end: format(dates.end, dateStringFormat, { locale: ptBR }),
              });
          dispatch(handleFecthReports({patientId: appState.patient.id, date: {date: {
            startDate: format(dates.start, 'YYYY-mm-dd', { locale: ptBR }),
            endDate: format(dates.end, 'YYYY-mm-dd', { locale: ptBR }),
          }}}));

            }
          }}
        />
      )}
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
