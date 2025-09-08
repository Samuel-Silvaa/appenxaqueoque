import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screenOptions from 'src/modules/shared/style/StackOptions';
import { useEffect, useState, useRef } from 'react';
import { differenceInDays, format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseAcuteness, pinColor } from 'src/infra/utils/appUtils';
import ChartsPage from './components/charts/Charts';
import { Report } from 'src/infra/@types/app.types';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import ReportDateRangeModal from 'src/modules/shared/components/reportDateRangeModal/ReportDateRangeModal';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useSelector } from 'react-redux';
import { appStateSelector } from 'src/infra/app/selectors';
import {
  handleDeleteReport,
  handleFecthReports,
} from 'src/infra/app/reducers/app.reducer';
import SwipeableFlatList from 'react-native-swipeable-list';
import ActionConfirmationModal from 'src/modules/shared/components/actionConfirmationModal/ActionConfirmationModal';
import { requestDeleteReport } from 'src/infra/services/appService';
import { useToast } from "react-native-toast-notifications";

const stylesheet = {
  reportCard:
    'w-full flex-row items-start p-3 my-1 bg-white dark:bg-d-blue-primary rounded-[30px] h-[90px] shadow-lg overflow-hidden ',
  reportCardColor: 'h-[80%] rounded-full w-2 mr-4 py-2 self-center',
  reportCardHeader: 'flex-col h-[30%] w-[85%]',
  reportCardDesc:
    'mt-2 w-3/4 h-full opacity-50 dark:text-d-text-gray truncate w-[90%] break-word ',
};

const ResourceCard = ({
  reportDetails,
  navigation,
}: {
  reportDetails: Report;
  navigation?: any;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
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
            {format(reportDetails.startDate || new Date(), 'dd MMM', {
              locale: ptBR,
            })}{' '}
            -
            {format(
              reportDetails.endDate! || subDays(new Date(), 15),
              'dd MMM',
              { locale: ptBR }
            )}{' '}
            -
            <Text className='ml-2 font-medium dark:text-d-text-gray'>
              {' '}
              {parseAcuteness(reportDetails.acuteness)}
            </Text>
          </Text>
          {!!reportDetails?.notes ? (
            <Text className={stylesheet.reportCardDesc}>
              {reportDetails.notes.replaceAll(',', ' - ')}
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
    </Animated.View>
  );
};

const ReportPage = ({ navigation }) => {
  const dispatch = useAsyncAppDispatch();
  const appState = useSelector(appStateSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const dateStringFormat = 'PPP';
  const [selectedDate, setSelectedDate] = useState({
    start: format(subDays(new Date(), 90), dateStringFormat, { locale: ptBR }),
    end: format(new Date(), dateStringFormat, { locale: ptBR }),
  });
  const [isEpisodesPopulated, setIsEpisodesPopulated] = useState(true);
  const [isReportsPopulated, setIsReportsPopulated] = useState(true);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [reportDraggedIndex, setReportDraggedIndex] = useState(0);

  useEffect(() => {
    setIsEpisodesPopulated(appState!.episodes!.length > 0);
    setIsReportsPopulated(appState!.reports!.length > 0);
  }, [appState.episode, appState.reports]);

  const {
    setValue,
    formState: { errors },
  } = useForm();
  const toast = useToast();

  useEffect(() => {
    if (appState.patient!.id) {
      dispatch(
        handleFecthReports({
          patientId: appState.patient!.id,
          date: {
            date: {
              startDate: format(subDays(new Date(), 15), 'yyyy-MM-dd', {
                locale: ptBR,
              }),
              endDate: format(new Date(), 'yyyy-MM-dd', { locale: ptBR }),
            },
          },
        })
      );
    }
  }, [appState.patient, ]);

  const handleDelete = async (report: Report) => {
    if (report.id) {
      const res = await dispatch(handleDeleteReport({ id: report!.id }));
      if (
        res.meta.requestStatus === 'fulfilled' 
      ) {
        toast.show('Relatório deletado com sucesso!', {type: 'success'})
      }
    }
  };

  const DeleteComponent = ({
    item,
    onPress,
  }: {
    index: number;
    item: Report;
    onPress: () => void;
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    return (
      <Animated.View
        style={{ opacity: fadeAnim }}
        className='h-full pr-4 flex  items-end justify-center'
      >
        <TouchableOpacity
          className='bg-error rounded-full'
          onPress={() => onPress()}
          style={{ padding: 12 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Deletar</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderResource = ({ item }: { index: number; item: Report }) => {
    return (
      <ResourceCard
        key={item.id}
        reportDetails={item}
        navigation={navigation}
      />
    );
  };

  return (
    <AppPageScaffold title='Relatórios' disabledScroll={true}>
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
            className={`rounded-full w-2/4 h-[45px] ${
              !isEpisodesPopulated ? 'opacity-[0.4]' : ''
            } bg-blue-primary/60 text-white dark:text-white dark:bg-d-blue-primary shadow-lg`}
            title='Gerar relatório'
            onPress={() =>
              isEpisodesPopulated ? setIsModalOpen(true) : () => {}
            }
          />
          <ExPressable
            className={`rounded-full w-[40%] ${
              !isReportsPopulated ? 'opacity-[0.4]' : ''
            } h-[45px] bg-white dark:bg-d-blue-primary  text-black shadow-lg`}
            colorScheme='secodary '
            title='Filtrar'
            onPress={() =>
              isReportsPopulated ? setIsFilterModalOpen(true) : () => {}
            }
          />
        </View>

        <View className='self-start px-2 w-full'>
          <Text className='dark:text-d-text-gray m-auto'>
            {selectedDate.start} a {selectedDate.end}
          </Text>
        </View>
        <View className='bg-snow-white dark:bg-d-blue-primary mb-4 rounded-[44px] w-full h-[45px]'>
          <Text className='font-semibold text-black dark:text-d-text-gray mx-auto text-md m-auto '>
            Visualize e envie um relatório ao seu médico
          </Text>
        </View>
      </View>

      {appState.reports?.length && (
        <SwipeableFlatList
          keyExtractor={(item: Report, index: string) =>
            String(item!.id ?? index)
          }
          data={appState.reports ? appState.reports : []}
          renderQuickActions={({
            item,
            index,
          }: {
            index: number;
            item: Report;
          }) => {
            return (
              <>
                <DeleteComponent
                  item={item}
                  index={index}
                  onPress={() => {
                    setOpenConfirmationModal(true);
                    setReportDraggedIndex(index);
                  }}
                />
                {openConfirmationModal && index == reportDraggedIndex && (
                  <ActionConfirmationModal
                    isOpen={openConfirmationModal}
                    onClose={() => {
                      setOpenConfirmationModal(false);
                      setReportDraggedIndex(0);
                    }}
                    desc={`Você está prestes a deletar o relatório de ${format(
                      item.startDate,
                      'PPP',
                      { locale: ptBR }
                    )} a ${format(item.endDate, 'PPP', { locale: ptBR })} `}
                    submitAction={() => {
                      setOpenConfirmationModal(false);
                      setReportDraggedIndex(0);
                      handleDelete(item);
                    }}
                  />
                )}
              </>
            );
          }}
          renderItem={renderResource}
          maxSwipeDistance={100}
        />
      )}

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
            if (dates && dates.start && dates.end && appState.patient?.id) {
              setSelectedDate({
                start: format(dates.start, dateStringFormat, { locale: ptBR }),
                end: format(dates.end, dateStringFormat, { locale: ptBR }),
              });
              dispatch(
                handleFecthReports({
                  patientId: appState.patient.id,
                  date: {
                    date: {
                      startDate: format(dates.start, 'YYYY-mm-dd', {
                        locale: ptBR,
                      }),
                      endDate: format(dates.end, 'YYYY-mm-dd', {
                        locale: ptBR,
                      }),
                    },
                  },
                })
              );
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
