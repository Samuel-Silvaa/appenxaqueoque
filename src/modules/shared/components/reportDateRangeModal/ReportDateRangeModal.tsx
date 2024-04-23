import { createRef, useEffect, useState } from 'react';
import {
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
import { AppActions } from 'src/infra/app/actions';

const stylesheet = {
  wrapper: 'w-full',
  header: 'w-full flex-row items-center justify-between mb-4',
  arrowdown: 'flex items-center justify-center p-2',
  edition:
    'flex-col items-center justify-center w-[48px] h-[48px] rounded-full p-2 ',
  editText: 'text-[8px] text-black',
  headerDate: 'font-bold text-black',
  contentWrapper:
    'my-2 w-full flex-row flex-wrap justify-start overflow-hidden gap-1',
  longInfo: ' w-[98%] shadow-sm rounded-[16px] bg-blue-baby',
  smallInfoBlock: 'w-[48%] shadow-sm rounded-[16px] bg-blue-baby',
  smallInfoContainer: 'w-full flex-col justify-start items-start p-4 ',
  smallInfoTitle: 'font-bold',
  smallInfoImgContainer: 'flex-col justify-start items-start py-3',
  rangeCard:
    'w-4/5 bg-white shadow-sm rounded-[16px] flex-col items-center jusitfy-center p-6 gap-y-2 m-auto self-center z-20 overflow-hidden',
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
              `${
                currentStep == index
                  ? ' bg-purple-dark-primary '
                  : ' bg-purple-dark-secondary'
              }`
            }
          >
            <Text
              className={`${
                currentStep == index ? 'text-[#fff]' : 'text-black '
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
  const { dispatch } = useApp();
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

  const handleSubmitReportCreation = (payload: {
    startDate: Date;
    endDate: Date;
  }) => {
    if (filter) {
      dispatch(AppActions.REQUEST_FETCH_REPORTS, {
        startDate: format(payload.startDate, 'yyyy-MM-dd'),
        endDate: format(payload.endDate, 'yyyy-MM-dd'),
      });
    } else {
      dispatch(AppActions.REQUEST_CREATE_REPORT, {
        startDate: format(payload.startDate, 'yyyy-MM-dd'),
        endDate: format(payload.endDate, 'yyyy-MM-dd'),
      });
    }
    onClose({ start: getValues('startDate'), end: getValues('endDate') });
  };

  return (
    <Modal
      transparent={false}
      animationType='slide'
      visible={isOpen}
      onRequestClose={() => {
        dispatch(AppActions.REQUEST_FETCH_REPORTS, {});
        onClose();
      }}
    >
      <AppPageScaffold
        alignment='items-center'
        className='h-3/4 rounded-t-[16px]'
      >
        <View className={stylesheet.header}>
          <Text className={sharedStyleSheet.title}>
            {filter ? 'Filtrar relatórios por período' : 'Gerar relátorio'}
          </Text>
          <TouchableOpacity onPress={() => onClose()}>
            <Image
              className={stylesheet.arrowdown}
              source={require('assets/arrowdown.png')}
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
            editable={false}
            value={format(getValues('startDate'), 'dd/MM/yyyy')}
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
