import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  Animated,
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
import { useApp } from 'src/infra/app/app';
import { pinColor } from 'src/infra/utils/appUtils';
import { Episode } from 'src/infra/@types/app.types';

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
  smallInfoBlock: 'w-[48%] shadow-sm rounded-[16px] bg-primary',
  smallInfoContainer: 'w-full flex-col justify-start items-start p-4',
  smallInfoTitle: 'font-bold',
  smallInfoDesc: 'w-3/4',
  smallInfoImgContainer: 'flex-row gap-x-2 justify-start items-start py-3',
};

const EpisodeModal = ({
  isOpen,
  onClose,
  episode,
}: {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode;
}) => {
  const { handleFormChange } = useApp();
  const navigation = useNavigation();

  const fullDetails = [
    {
      icon: require('assets/timer.png'),
      title: 'Horário do episódio',
      desc: episode.time,
    },
    {
      icon: require('assets/chart-header-location.png'),
      title: 'Localização',
      desc: episode.location,
    },
    {
      icon: require('assets/chart-acuteness.png'),
      title: 'Intensidade',
      desc: episode.acuteness,
    },
    {
      icon: require('assets/chart-sad.png'),
      title: 'Característica da dor',
      desc: episode.painType,
    },
    {
      icon: require('assets/chart-symptoms.png'),
      title: 'Sintomas associados',
      desc: episode.symptoms,
    },
    {
      icon: require('assets/chart-trigger.png'),
      title: 'Gatilhos',
      desc: episode.triggers,
    },
    {
      icon: require('assets/chart-improvement.png'),
      title: 'Fatores de melhora',
      desc: episode.improvementFactor,
      opened: false,
    },
    {
      icon: require('assets/chart-period.png'),
      title: 'Período menstrual',
      desc: episode.periodNotes,
    },
    {
      icon: require('assets/chart-notes.png'),
      title: 'Observações',
      desc: episode.notes,
    },
  ];

  const details = useMemo(() => {
    const parsedDetails: Array<any> = [];
    fullDetails.map((dt) => {
      if (!!dt.desc) {
        parsedDetails.splice(0, 0, dt);
      }
    });
    return parsedDetails;
  }, []);

  const nullDetails = useMemo(() => {
    const parsedDetails: Array<any> = [];
    fullDetails.map((dt) => {
      if (!dt.desc) {
        parsedDetails.splice(parsedDetails.length, 0, dt);
      }
    });
    return parsedDetails;
  }, []);
  console.log(episode);
  return (
    <Modal
      animationType='slide'
      transparent={false}
      style={{ height: 70 }}
      visible={isOpen}
      onRequestClose={() => {
        onClose();
      }}
    >
      <AppPageScaffold>
        <View className={stylesheet.wrapper}>
          <View className={stylesheet.header}>
            <TouchableOpacity
              onPress={() => {
                handleFormChange({ ...episode, isEdition: true });
                onClose();
                navigation.navigate('Episode', { episode: episode });
              }}
              style={{ backgroundColor: pinColor(episode.acuteness) }}
              className={stylesheet.edition}
            >
              <Image source={require('assets/pencil.png')}></Image>
              <Text className={stylesheet.editText}>Editar</Text>
            </TouchableOpacity>
            {episode?.dateTime && (
              <Text className={stylesheet.headerDate}>
                {format(episode?.dateTime, 'PPPP', { locale: ptBR })}
              </Text>
            )}
            <TouchableOpacity
              onPress={onClose}
              className='w-8 h-8 flex items-end justify-center'
            >
              <Image
                className={stylesheet.arrowdown}
                source={require('assets/arrowdown.png')}
              ></Image>
            </TouchableOpacity>
          </View>

          <View className={stylesheet.contentWrapper}>
            {details &&
              details.reverse().map((dtl) => {
                return (
                  <Pressable
                    key={dtl.title}
                    className={stylesheet.smallInfoBlock}
                  >
                    <View className={stylesheet.smallInfoContainer}>
                      <Text className={stylesheet.smallInfoTitle}>
                        {dtl.title}
                      </Text>
                      <View className={stylesheet.smallInfoImgContainer}>
                        {dtl.icon && (
                          <Image className='w-4 h-4 mb-2' source={dtl.icon} />
                        )}
                        <Text className={stylesheet.smallInfoDesc}>
                          {dtl.desc}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
          </View>
          {nullDetails.length > 0 && (
            <Text className='font-semibold pl-2 font-black my-2'>
              Campos não preenchidos
            </Text>
          )}

          <View className={stylesheet.contentWrapper}>
            {nullDetails &&
              nullDetails.map((dtl) => {
                return (
                  <Pressable
                    key={dtl.title}
                    className={stylesheet.smallInfoBlock + ' opacity-75'}
                  >
                    <View className={stylesheet.smallInfoContainer}>
                      <Text className={stylesheet.smallInfoTitle}>
                        {dtl.title}
                      </Text>
                      <View className={stylesheet.smallInfoImgContainer}>
                        <Text>Informação não preenchida</Text>
                      </View>
                    </View>
                  </Pressable>
                  // <Pressable className='my-2'>
                  //   <View className='w-full h-[55px] bg-blue-baby flex-row justify-start items-center p-4 rounded-[16px]'>
                  //     <Text>{dtl.title}</Text>
                  //   </View>
                  // </Pressable>
                );
              })}
          </View>
        </View>
      </AppPageScaffold>
    </Modal>
  );
};

export default EpisodeModal;
