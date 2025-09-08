import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
import { ptBR } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';
import { pinColor } from 'src/infra/utils/appUtils';
import {
  Acuteness,
  Episode,
  ImpairFactor,
  ImprovementFactor,
  PainType,
  Trigger,
} from 'src/infra/@types/app.types';
import { handleDeleteEpisode, handleFormChanging } from 'src/infra/app/reducers/app.reducer';
import { useDispatch } from 'react-redux';
import ExPressable from "src/modules/auth/shared/components/buttons/pressable/ExPressable";
import ActionConfirmationModal from "../actionConfirmationModal/ActionConfirmationModal";
import { useAsyncAppDispatch } from "src/infra/app/store";
import { useToast } from "react-native-toast-notifications";

const stylesheet = {
  wrapper: 'w-full pt-4',
  header: 'w-full flex-row items-center justify-between mb-4',
  arrowdown: 'flex items-center justify-center p-2',
  closeButton: 'p-3',
  edition:
    'flex-col items-center justify-center w-[48px] h-[48px] rounded-full p-2  shadow-lg ',
  editText: 'text-[8px] text-black dark:text-d-text-gray',
  headerDate: 'font-bold text-black dark:text-d-text-gray',
  contentWrapper:
    'my-2 w-full flex-row flex-wrap justify-start overflow-hidden gap-1 pb-2',
  longInfo: ' w-[98%] shadow-sm rounded-[16px] bg-blue-baby',
  smallInfoBlock:
    'w-[48%] shadow-sm rounded-[16px] bg-primary dark:bg-d-blue-primary',
  smallInfoContainer: 'w-full flex-col justify-start items-start p-4',
  smallInfoTitle: 'font-bold dark:text-d-text-gray',
  smallInfoDesc: 'w-3/4 dark:text-d-text-gray',
  smallInfoImgContainer: 'flex-row gap-x-2 justify-start items-start py-3',
};

// --- Utils ---
const sanitizeString = (value?: string | null): string =>
  value?.trim() || '';

const sanitizeTime = (value?: string | null): string =>
  value || '';

const formatArray = (value?: string[] | null): string =>
  Array.isArray(value) ? value.join(' - ') : sanitizeString(value as any);

const EpisodeModal = ({
  isOpen,
  onClose,
  episode,
}: {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode;
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const dispatchAsync = useAsyncAppDispatch();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const toast = useToast();

  const fullDetails = [
    {
      icon: require('src/assets/timer.png'),
      title: 'Horário do episódio',
      desc: sanitizeString(episode.time),
    },
    {
      icon: require('src/assets/chart-clock.png'),
      title: 'Horas de duração',
      desc: sanitizeTime(episode.start ? episode.start! : 'N/A') + sanitizeTime(episode.end ? '--' + episode.end! : '-N/A'),
    },
    {
      icon: require('src/assets/chart-header-location.png'),
      title: 'Localização',
      desc: Array.isArray(episode.location)
        ? episode.location.join(' - ')
        : sanitizeString(episode.location?.replaceAll(',', ' - ')),
    },
    {
      icon: require('src/assets/chart-acuteness.png'),
      title: 'Intensidade',
      desc: sanitizeString(episode.acuteness),
    },
    {
      icon: require('src/assets/chart-sad.png'),
      title: 'Característica da dor',
      desc:
        episode.painType === PainType.ANOTHER
          ? sanitizeString(episode.anotherPainType)
          : sanitizeString(episode.painType),
    },
    {
      icon: require('src/assets/chart-symptoms.png'),
      title: 'Sintomas associados',
      desc: formatArray(episode.symptoms),
    },
    {
      icon: require('src/assets/chart-trigger.png'),
      title: 'Gatilhos',
      desc: [
        formatArray(episode.triggers),
        episode.triggers?.includes(Trigger.ANOTHER)
          ? sanitizeString(episode.anotherTrigger)
          : '',
        episode.triggers?.includes(Trigger.FOOD)
          ? sanitizeString(episode.foodImpair)
          : '',
      ]
        .filter(Boolean)
        .join(' - '),
    },
    {
      icon: require('src/assets/chart-improvement.png'),
      title: 'Fatores de melhora',
      desc: episode.improvementFactor?.includes(ImprovementFactor.ANOTHER)
        ? sanitizeString(episode.anotherImprovementFactor)
        : formatArray(episode.improvementFactor),
    },
    {
      icon: require('src/assets/chart-bad-sleep.png'),
      title: 'Fatores de piora',
      desc: episode.impairFactor?.includes(ImpairFactor.ANOTHER)
        ? sanitizeString(episode.anotherImpairFactor)
        : formatArray(episode.impairFactor),
    },
    {
      icon: require('src/assets/chart-header-location.png'),
      title: 'Sintomas da aura',
      desc: formatArray(episode.haloSymptoms),
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

  const { details, nullDetails } = useMemo(() => {
    const details = fullDetails.filter(
      (d) => d.desc && d.desc.trim() !== '' || (d.displayCondition == 'true' || d.displayCondition == 1)
    );
    const nullDetails = fullDetails.filter(
      (d) => !d.desc || d.displayCondition === 'false'
    );
    return { details, nullDetails };
  }, [episode]);

    const handleDelete = async (id: string) => {
      if (id) {
        const res = await dispatchAsync(handleDeleteEpisode({ id: id }));
        if (
          res.meta.requestStatus === 'fulfilled'
        ) {
          onClose();
          navigation.navigate('Calendar' as never);
          toast.show('Episódio deletado com sucesso!', {type: 'success'})
        }
      }
    };
  
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isOpen}
      onRequestClose={onClose}
    >
      <AppPageScaffold>
        <View className={stylesheet.wrapper}>
          {/* Header */}
          <View className={stylesheet.header}>
            <TouchableOpacity
              onPress={() => {
                onClose();
                dispatch(
                  handleFormChanging({
                    ...episode,
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
                navigation.navigate('Episode');
              }}
              style={{ backgroundColor: pinColor(episode.acuteness!) }}
              className={stylesheet.edition}
            >
              <Image
                className="w-4 h-4"
                source={require('src/assets/pencil.png')}
              />
              <Text className={stylesheet.editText}>Editar</Text>
            </TouchableOpacity>

            {!!episode?.dateTime && (
              <Text className={stylesheet.headerDate}>
                {format(episode?.dateTime, 'PPPP', { locale: ptBR })}
              </Text>
            )}

            <TouchableOpacity
              onPress={onClose}
              className={stylesheet.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                className={stylesheet.arrowdown}
                source={require('src/assets/arrowdown.png')}
              />
            </TouchableOpacity>
          </View>

          {/* Filled details */}
          <View className={stylesheet.contentWrapper}>
            {details.map((dtl) => {
              let desc = dtl.desc.replaceAll?.('Outros-', '').replaceAll?.('Outros', '') || dtl.desc;
              return (
                <Pressable key={dtl.title} className={stylesheet.smallInfoBlock}>
                  <View className={stylesheet.smallInfoContainer}>
                    <Text className={stylesheet.smallInfoTitle}>{dtl.title}</Text>
                    <View className={stylesheet.smallInfoImgContainer}>
                      {dtl.icon && (
                        <Image className="w-4 h-4 mb-2" source={dtl.icon} />
                      )}
                      <Text className={stylesheet.smallInfoDesc}>
                        {desc || 'Nenhuma observação'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Empty details */}
          {nullDetails.length > 0 && (
            <Text className="font-semibold pl-2 font-black my- dark:text-d-text-gray">
              Campos não preenchidos
            </Text>
          )}
          <View className={stylesheet.contentWrapper}>
            {nullDetails.map((dtl) => (
              <Pressable
                key={dtl.title}
                className={stylesheet.smallInfoBlock + ' opacity-75'}
              >
                <View className={stylesheet.smallInfoContainer}>
                  <Text className={stylesheet.smallInfoTitle}>{dtl.title}</Text>
                  <View className={stylesheet.smallInfoImgContainer}>
                    <Text className="dark:text-d-text-gray">
                      Informação não preenchida
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
          <View>
            <ExPressable title="Deletar Episódio" className="bg-error" onPress={() => {setOpenConfirmationModal(true)}} />
          </View>
        </View>
        {!!openConfirmationModal && (
          <ActionConfirmationModal
          isOpen={openConfirmationModal}
          onClose={()=>{
            setOpenConfirmationModal(false);
          }}
          desc={`Você está prestes a deletar o episódio do dia ${format(episode?.dateTime, 'PPP', { locale: ptBR })}.`}
          submitAction={() => {
            setOpenConfirmationModal(false);
            if(episode.id)
            handleDelete(episode.id);
          }}
          />
        )}
      </AppPageScaffold>
    </Modal>
  );
};

export default EpisodeModal;
