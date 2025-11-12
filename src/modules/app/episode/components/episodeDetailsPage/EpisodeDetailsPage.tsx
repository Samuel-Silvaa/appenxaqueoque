import { differenceInHours, differenceInMinutes, format } from 'date-fns';
import { createRef, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
import { ptBR } from 'date-fns/locale';
import { useNavigation, useRoute } from '@react-navigation/native';
import { episodePinColors, pinColor } from 'src/infra/utils/appUtils';
import {
  Acuteness,
  Episode,
  HaloSymptom,
  ImpairFactor,
  ImprovementFactor,
  PainType,
  Symptom,
  Time,
  Trigger,
} from 'src/infra/@types/app.types';
import {
  handleDeleteEpisode,
  handleFormChanging,
  setEpisodeIndex,
  setPageTitle,
} from 'src/infra/app/reducers/app.reducer';
import { useDispatch } from 'react-redux';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import CalendarEpisodeListModal from '../../../../shared/components/actionConfirmationModal/ActionConfirmationModal';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useToast } from 'react-native-toast-notifications';
import { CloseButton } from 'src/modules/shared/components/closeButton/CloseButton';
import { isArray } from 'lodash';

const stylesheet = {
  wrapper: 'w-full pt-10',
  header: 'w-full flex-row items-center justify-between mb-4',
  arrowdown: 'flex items-center justify-center p-2 w-5 h-5',
  closeButton: 'p-3',
  edition:
    'flex-col items-center justify-center w-[48px] h-[48px] rounded-full p-2  shadow-lg ',
  editText: 'text-[8px] text-black dark:text-d-text-gray',
  headerTitle: 'text-md font-bold text-black dark:text-d-text-gray',
  headerDate: 'text-black dark:text-d-text-gray text-sm',
  contentWrapper:
    'my-2 w-full flex justify-center overflow-hidden gap-y-2 pb-2 items-center rounded-[30px] px-2 py-4 mt-5 shadow-xl bg-white/30',
  smallInfoBlock:
    'w-[92%] rounded-[30px] bg-primary dark:bg-d-blue-primary m-auto shadow-lg shadow-black-200 ',
  smallInfoContainer: 'w-full flex-row justify-start items-center px-3 py-4',
  smallInfoTitle: 'font-bold dark:text-d-text-gray',
  smallInfoDesc: 'w-3/4 dark:text-d-text-gray break-word',
  smallInfoImgContainer: 'flex-col justify-start items-start py-3 w-full',
  smInfoImgContainer:
    'mr-4 w-[50] h-[50] p-2 flex items-center justify-center rounded-[16px]',
};

// --- Utils ---
const sanitizeString = (value?: string | null): string => value?.trim() || '---';

const EpisodeDetailsPage = ({ }: {}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const dispatchAsync = useAsyncAppDispatch();
  const [episode, setEpisode] = useState<Episode>({} as Episode);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const toast = useToast();
  const route = useRoute();

  const getDifferenceInHours = (startTime: string, endTime: string) => {
    const date = new Date(episode.dateTime!);
    const startDate = new Date(date);
    const endDate = new Date(date);

    startDate.setUTCHours(parseFloat(startTime.substring(0, 2)));
    endDate.setUTCHours(parseFloat(endTime.substring(0, 2)));

    startDate.setUTCMinutes(parseFloat(startTime.substring(3, 6)));
    endDate.setUTCMinutes(parseFloat(endTime.substring(3, 6)));

    const hours = String(differenceInHours(endDate, startDate)).padStart(
      2,
      '0'
    );
    const minutes = String(
      differenceInMinutes(endDate, startDate) - 60 * parseFloat(hours)
    ).padStart(2, '0');

    return hours + ':' + minutes + 'm';
  };

  const acutenessIcon = () => {
    if (episode.acuteness?.includes(Acuteness.LIGHT))
      return require('src/assets/acuteness-light.png');

    if (episode.acuteness?.includes(Acuteness.MILD))
      return require('src/assets/acuteness-mild.png');

    if (episode.acuteness?.includes(Acuteness.SEVERE))
      return require('src/assets/acuteness-severe.png');

    return require('src/assets/acuteness-light.png');
  };

  console.log(episode)
  useEffect(() => {
    setEpisode(route.params!.episode as Episode);
  }, []);

  const fullDetails = [
    {
      icon: require('src/assets/timer.png'),
      title: 'Horário do episódio',
      desc: sanitizeString(episode?.time || ''),
    },
    {
      icon: require('src/assets/chart-clock.png'),
      title: 'Horas de duração',
      desc:
        episode!.start && episode!.end
          ? getDifferenceInHours(episode!.start, episode!.end)
          : null,
    },
    {
      icon: require('src/assets/chart-header-location.png'),
      title: 'Localização',
      desc: Array.isArray(episode.location)
        ? episode.location
        : sanitizeString(episode.location?.replaceAll(',', '\n')),
    },
    {
      icon: acutenessIcon(),
      title: 'Intensidade',
      desc: sanitizeString(episode.acuteness),
    },
    {
      icon: require('src/assets/chart-sad.png'),
      title: 'Característica da dor',
      desc: sanitizeString(episode.painType),
      type: PainType,
    },
    {
      icon: require('src/assets/chart-symptoms.png'),
      title: 'Sintomas associados',
      desc: Array.isArray(episode.symptoms)
        ? !!episode.symptoms.length ? episode.symptoms : null
        : sanitizeString(episode.symptoms?.replaceAll(',', '\n')),
    },
    {
      icon: require('src/assets/chart-trigger.png'),
      title: 'Fatores desencadeantes',
      desc: Array.isArray(episode.triggers)
        ? !!episode.triggers.length ? episode.triggers : null
        : sanitizeString(episode.triggers?.replaceAll(',', '\n')),
      type: Trigger,
    },
    {
      icon: require('src/assets/chart-improvement.png'),
      title: 'Fatores de melhora',
      desc: Array.isArray(episode.improvementFactor)
        ? episode.improvementFactor
        : sanitizeString(episode.improvementFactor?.replaceAll(',', '\n')),
      type: ImprovementFactor,
    },
    {
      icon: require('src/assets/chart-bad-sleep.png'),
      title: 'Fatores de piora',
      desc: Array.isArray(episode.impairFactor)
        ? episode.impairFactor
        : sanitizeString(episode.impairFactor?.replaceAll(',', '\n')),
      type: ImpairFactor,
    },
    {
      icon: require('src/assets/chart-header-location.png'),
      title: 'Sintomas da aura',
      desc: Array.isArray(episode.haloSymptoms)
        ? !!episode.haloSymptoms.length ? episode.haloSymptoms : null
        : sanitizeString(episode.haloSymptoms?.replaceAll(',', '\n')),
    },
    {
      icon: require('src/assets/chart-period.png'),
      title: 'Período menstrual',
      desc: sanitizeString(episode.periodNotes),
      displayCondition: episode.period,
    },
    {
      icon: require('src/assets/chart-notes.png'),
      title: 'Observações',
      desc: sanitizeString(episode.notes),
    },
  ];

  const getSecondaryData = (type: any) => {
    var value = '';
    switch (type) {
      case PainType:
        if (episode.painType == PainType.ANOTHER) {
          value = value + sanitizeString(episode.anotherPainType);
        }
        return value + '\n';
      case Trigger:

        if (episode.triggers?.includes(Trigger.FOOD)) {
          value = value + sanitizeString(episode.foodImpair);
        }
        if (episode.triggers?.includes(Trigger.ANOTHER)) {
          value = value + sanitizeString(episode.anotherTrigger);
        }
        return value;
      case ImprovementFactor:
        if (episode.improvementFactor?.includes(ImprovementFactor.FOOD)) {
          value = value + sanitizeString(episode.foodImprovement);
        }
        if (episode.improvementFactor?.includes(ImprovementFactor.MEDICINE)) {
          value =
            value +
            sanitizeString(
              `${episode.medicine} - ${!!episode.combinedDosage ? episode.combinedDosage + '/' : ''}${episode.medicineDosage}${!!episode.medicineUnit ? episode.medicineUnit + '' : ''}`
            );
        }
        if (episode.improvementFactor?.includes(ImprovementFactor.ANOTHER)) {
          value = value + '\n' + sanitizeString(episode.anotherImprovementFactor);
        }
        return value;
      case ImpairFactor:
        if (episode.impairFactor?.includes(ImpairFactor.ANOTHER)) {
          value = value + sanitizeString(episode.anotherImpairFactor);
        }
        return value + '\n';
    }
  };

  const { details, nullDetails } = useMemo(() => {
    const details = fullDetails.filter(
      (d) => !!d.desc || d.displayCondition == 'true' || d.displayCondition == 1
    );
    const nullDetails = fullDetails.filter(
      (d) => !d.desc || d.displayCondition === 'false'
    );
    return { details, nullDetails };
  }, [episode]);

  const handleDelete = async (id: string) => {
    if (id) {
      const res = await dispatchAsync(handleDeleteEpisode({ id: id }));
      if (res.meta.requestStatus === 'fulfilled') {
        navigation.navigate('Home' as never);
        toast.show('Episódio deletado com sucesso!', { type: 'success' });
      }
    }
  };

  return (
    <AppPageScaffold disabledScroll={false} hasArrowBack={false}>
      <View className={stylesheet.wrapper}>
        <View className={stylesheet.header}>
          <TouchableOpacity
            onPress={() => {
              dispatch(
                handleFormChanging({
                  ...episode,
                  period: episode.period === 1,
                  isEdition: true,
                  dates: {
                    [format(
                      String(episode?.dateTime),
                      'yyyy-MM-dd'
                    ).toString()]: {
                      selected: true,
                      marked: true,
                      selectedColor: pinColor(episode.acuteness!),
                      dotColor: pinColor(episode.acuteness!),
                    },
                  },
                })
              );
              navigation.navigate('Episode' as never);
            }}
            style={{ backgroundColor: pinColor(episode.acuteness!) }}
            className={stylesheet.edition}
          >
            <Image
              className='w-4 h-4'
              source={require('src/assets/pencil.png')}
            />
            <Text className={stylesheet.editText}>Editar</Text>
          </TouchableOpacity>

          <View className='items-center'>
            <Text className={stylesheet.headerTitle}>
              Resumo do epísodio {''}
            </Text>
            {!!episode?.dateTime && (
              <Text className={stylesheet.headerDate}>
                {format(episode?.dateTime, 'PPP', { locale: ptBR })}
              </Text>
            )}
          </View>

          <CloseButton
            onClose={() => {
              dispatch(setPageTitle(''));
              navigation.navigate('Home' as never)
            }}
          />
        </View>

        {/* Filled details */}
        {!!details.length && (
          <View className={stylesheet.contentWrapper}>
            {details.map((dtl, index) => {
              return (
                <View key={dtl.title} className={stylesheet.smallInfoBlock}>
                  <View className={stylesheet.smallInfoContainer}>
                    {dtl.icon && (
                      <View
                        style={{ backgroundColor: episodePinColors(index) }}
                        className={stylesheet.smInfoImgContainer}
                      >
                        <Image className='w-4 h-4' source={dtl.icon} />
                      </View>
                    )}
                    <View className={stylesheet.smallInfoImgContainer}>
                      <Text className={stylesheet.smallInfoTitle}>
                        {dtl.title}
                      </Text>

                      {dtl.desc != 'Outros' && (
                        <Text className={stylesheet.smallInfoDesc}>
                          {dtl.desc}
                        </Text>
                      )}

                      {dtl.type && (
                        <Text className={stylesheet.smallInfoDesc}>
                          {getSecondaryData(dtl.type)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Empty details */}
        {nullDetails.length > 0 && (
          <Text className='font-semibold pl-2 font-black my- dark:text-d-text-gray'>
            Campos não preenchidos
          </Text>
        )}
        <View className={stylesheet.contentWrapper}>
          {nullDetails.map((dtl, index) => (
            <View key={dtl.title} className={stylesheet.smallInfoBlock}>
              <View className={stylesheet.smallInfoContainer}>
                {dtl.icon && (
                  <View
                    style={{ backgroundColor: episodePinColors(index) }}
                    className={stylesheet.smInfoImgContainer}
                  >
                    <Image className='w-4 h-4' source={dtl.icon} />
                  </View>
                )}
                <View className={stylesheet.smallInfoImgContainer}>
                  <Text className={stylesheet.smallInfoTitle}>{dtl.title}</Text>

                  <Text className={stylesheet.smallInfoDesc}>
                    Informação não preenchida
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View>
          <ExPressable
            title='Deletar Episódio'
            className='bg-error'
            onPress={() => {
              setOpenConfirmationModal(true);
            }}
          />
        </View>
      </View>
      {!!openConfirmationModal && (
        <CalendarEpisodeListModal
          isOpen={openConfirmationModal}
          onClose={() => {
            setOpenConfirmationModal(false);
          }}
          desc={`Você está prestes a deletar o episódio do dia ${format(
            episode!.dateTime,
            'PPP',
            { locale: ptBR }
          )}.`}
          submitAction={() => {
            setOpenConfirmationModal(false);
            if (episode.id) handleDelete(episode.id);
          }}
        />
      )}
    </AppPageScaffold>
  );
};

export default EpisodeDetailsPage;
