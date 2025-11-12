import { createRef, useCallback, useEffect, useState } from 'react';
import {
  Appearance,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
import { useApp } from 'src/infra/app/app';
import InputContainer from '../inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';
import { sharedEpisodeStyleSheet } from 'src/modules/app/episode/shared/SharedEpisodeStyleSheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format, subDays } from 'date-fns';
import { useSelector } from 'react-redux';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import {
  handleCreateReport,
  handleFecthReports,
} from 'src/infra/app/reducers/app.reducer';
import { appStateSelector } from 'src/infra/app/selectors';
import { ptBR } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';

const stylesheet = {
  wrapper: 'w-full',
  header: 'w-full flex-row items-center justify-between mb-4 pt-[8vh]',
  arrowdown: 'flex items-center justify-center p-2 w-5 h-5',
  closeButton: 'p-3',
  edition:
    'flex-col items-center justify-center w-[48px] h-[48px] rounded-full p-2 ',
  editText: 'text-[8px] text-black dark:text-d-text-gray',
  headerDate: 'font-bold text-black dark:text-d-text-gray',
  contentWrapper:
    'my-2 w-full flex-row flex-wrap justify-start overflow-hidden gap-1',
  longInfo: ' w-[98%] shadow-sm rounded-[16px] bg-blue-baby',
  smallInfoBlock: 'w-[48%] shadow-sm rounded-[16px] bg-blue-baby',
  smallInfoContainer: 'w-full flex-col justify-start items-start p-4 ',
  smallInfoTitle: 'font-bold',
  smallInfoImgContainer: 'flex-col justify-start items-start py-3',
  rangeCard:
    'w-4/5 bg-white dark:bg-d-blue-primary shadow-sm rounded-[16px] flex-col items-center jusitfy-center p-6 gap-y-2 m-auto self-center z-20 overflow-hidden',
  inputCard:
    'w-4/5 bg-white dark:bg-d-blue-primary shadow-sm rounded-[16px] flex-col items-center jusitfy-center p-6 gap-y-2 m-auto self-center z-20 overflow-hidden',
};

interface HeadListProps {
  item: { value: string; title: string };
  index: number;
}

const Range = ({
  returnSelectedDaysRange,
}: {
  returnSelectedDaysRange: (days: number) => void;
}) => {
  const { validateStepForward } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const flatList = createRef<FlatList>();

  const DATA: { value: string; title: string }[] = [
    {
      value: '7',
      title: 'Últimos 7 dias',
    },
    {
      value: '15',
      title: 'Últimos 15 dias',
    },
    {
      value: '30',
      title: 'Últimos 30 dias',
    },
    {
      value: '90',
      title: 'Últimos 90 dias',
    },
  ];

  useEffect(() => {
    return () => {
      if (flatList.current) {
        flatList.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
      setCurrentStep(0);
    };
  }, []);

  return (
    <View className={sharedEpisodeStyleSheet.topic.container}>
      <FlatList
        ref={flatList}
        data={DATA}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }: HeadListProps) => (
          <TouchableOpacity
            onPress={() => {
              setCurrentStep(index);
              if (validateStepForward(index)) {
                if (flatList.current) {
                  flatList.current.scrollToIndex({
                    index: index,
                    animated: true,
                  });
                }
              } else {
                if (flatList.current) {
                  flatList.current.scrollToIndex({
                    index: currentStep,
                    animated: true,
                  });
                }
              }
              returnSelectedDaysRange(parseInt(item.value));
            }}
            className={
              sharedEpisodeStyleSheet.topic.item +
              `${currentStep == index
                ? ' bg-purple-dark-primary '
                : ' bg-purple-dark-secondary'
              }`
            }
          >
            <Text
              className={`${currentStep == index
                ? 'text-[#fff]'
                : 'text-black dark:text-d-text-gray '
                }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        keyExtractor={(item) => item.value}
      />
    </View>
  );
};

const ReportDateRangeModal = ({
  isOpen,
  onClose,
  filter = false,
}: {
  isOpen: boolean;
  onClose: (dates?: { start: Date; end: Date }) => void;
  filter?: boolean;
}) => {
  const dispatch = useAsyncAppDispatch();
  const appState = useSelector(appStateSelector);
  const {
    control,
    setValue,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: { startDate: subDays(new Date(), 7), endDate: new Date() },
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [inputSelect, setInputSelect] = useState('');
  const colorScheme = Appearance.getColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    if (inputSelect == 'startDate') {
      setValue('startDate', date);
    } else {
      setValue('endDate', date);
    }
    hideDatePicker();
  };

  const handleDateRange = (days: number) => {
    setValue('startDate', subDays(new Date(), days));
    setValue('endDate', new Date());
  };

  const handleSubmitReportCreation = useCallback(
    async (payload: { startDate: Date; endDate: Date }) => {
      if (filter) {
        dispatch(
          handleFecthReports({
            patientId: appState.patient!.id!,
            date: {
              date: {
                startDate: format(payload.startDate, 'yyyy-MM-dd'),
                endDate: format(payload.endDate, 'yyyy-MM-dd'),
              },
            },
          })
        );
      } else {
        const res = await dispatch(
          handleCreateReport({
            patientId: appState.patient!.id!,
            startDate: format(payload.startDate, 'yyyy-MM-dd'),
            endDate: format(payload.endDate, 'yyyy-MM-dd'),
          })
        );

        if (res.meta.requestStatus == 'fulfilled') {
          //    dispatch(handleFecthReports({patientId: appState.patient!.id!, date: { date: {
          //   startDate: format(payload.startDate, 'yyyy-MM-dd'),
          //   endDate: format(payload.endDate, 'yyyy-MM-dd'),
          // }}}));
          navigation.navigate('Charts', { reportDetails: res.payload });
        }
      }
      onClose({ start: getValues('startDate'), end: getValues('endDate') });
    },
    []
  );

  return (
    <Modal
      transparent
      animationType='fade'
      visible={isOpen}
      onRequestClose={() => {
        dispatch(
          handleFecthReports({
            patientId: appState.patient!.id!,
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
        onClose();
      }}
    >
      <AppPageScaffold
        hasArrowBack={false}
        alignment='items-center'
        className='h-3/4 rounded-t-[16px]'
      >
        <View className={stylesheet.header}>
          <Text className={sharedStyleSheet.title}>
            {filter ? 'Filtrar relatórios por período' : 'Gerar relátorio'}
          </Text>
          <TouchableOpacity
            onPress={() => onClose()}
            className={stylesheet.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              className={stylesheet.arrowdown}
              resizeMode='contain'
              source={
                require('src/assets/arrowdown.png')
                // colorScheme == 'light'
                //   ? require('src/assets/arrowdown.png')
                //   : require('src/assets/arrowdown.png')
              }
            ></Image>
          </TouchableOpacity>
        </View>

        <Text className={sharedStyleSheet.subtitle + ' w-3/4 m-auto my-4'}>
          Selecione uma data inicial e uma data final para{' '}
          {filter
            ? 'filtrar por período'
            : 'gerar o seu relatório de episódios'}
        </Text>
        <View className={stylesheet.rangeCard}>
          <Range returnSelectedDaysRange={handleDateRange} />

          <InputContainer
            label='Data inicial'
            name='notes'
            inputMode='numeric'
            control={control}
            errors={errors}
            value={format(getValues('startDate'), 'dd/MM/yyyy')}
            setValue={() => { }}
            onPressOut={() => {
              showDatePicker();
              setInputSelect('startDate');
            }}
          ></InputContainer>
          <InputContainer
            label='Data final'
            inputMode='numeric'
            name='notes'
            control={control}
            errors={errors}
            editable={true}
            value={format(getValues('endDate'), 'dd/MM/yyyy')}
            setValue={() => { }}
            onPressOut={() => {
              showDatePicker();
              setInputSelect('endDate');
            }}
          ></InputContainer>
          <ExPressable
            title={filter ? 'Filtrar' : 'Gerar'}
            onPress={handleSubmit((payload) =>
              handleSubmitReportCreation(payload)
            )}
          />
        </View>

        {isDatePickerVisible && (
          <DateTimePickerModal
            locale='pt-BR'
            isVisible={isDatePickerVisible}
            mode='date'
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        )}
      </AppPageScaffold>
    </Modal>
  );
};

export default ReportDateRangeModal;
