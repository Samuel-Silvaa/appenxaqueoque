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
import { Acuteness, Episode } from 'src/infra/@types/app.types';
import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
import { ptBR } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';

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
  const details = useMemo(() => {
    return [
      { title: 'Localização', desc: episode.location, opened: true },
      { title: 'Intensidade', desc: episode.acuteness, opened: false },
      { title: 'Característica da dor', desc: episode.painType, opened: false },
      { title: 'Sintomas associados', desc: episode.symptoms, opened: false },
      { title: 'Gatilhos', desc: episode.triggers, opened: false },
      {
        title: 'Fatores de melhora',
        desc: episode.improvementFactor,
        opened: false,
      },
      { title: 'Período menstrual', desc: episode.periodNotes, opened: false },
      { title: 'Observações', desc: episode.notes, opened: false },
    ];
  }, []);

  const pinColor = (acuteness: string): string => {
    switch (acuteness) {
      case Acuteness.LIGHT:
        return '#C8F7E1';
      case Acuteness.MILD:
        return '#FFCBA6';
      case Acuteness.SEVERE:
        return '#FFCACD';
      default:
        return '#9194E9';
    }
  };

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
        <View className='w-full'>
          <View className='w-full flex-row items-center justify-between mb-4'>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Episode', { episode: episode });
                onClose();
              }}
              className={`flex-col items-center justify-center w-[48px] h-[48px] rounded-full p-2 bg-[${pinColor(
                episode.acuteness
              )}]`}
            >
              <Image source={require('assets/pencil.png')}></Image>
              <Text className='text-[8px] text-black'>Editar</Text>
            </TouchableOpacity>
            <Text className='font-bold text-black'>
              {format(episode?.dateTime, 'PPPP', { locale: ptBR })}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                className='flex items-center justify-center p-2'
                source={require('assets/arrowdown.png')}
              ></Image>
            </TouchableOpacity>
          </View>

          <View className='rounded-full w-3/4 h-[38px] bg-beige-primary flex-row my-8 m-auto justify-center items-center'>
            <Image source={require('assets/timer.png')}></Image>
            <Text className='text-bold mx-4'>
              Horário do episódio: {episode.time}
            </Text>
          </View>

          {details &&
            details.map((dtl) => {
              const [opened, setOpened] = useState(false);
              return (
                <Pressable
                  className='my-2'
                  onPress={() => {
                    if (dtl.desc) {
                      setOpened((prevState) => !prevState);
                    }
                  }}
                >
                  <View
                    className={` w-full h-[55px] bg-blue-baby flex-row justify-between items-center p-4 ${
                      opened ? ' rounded-t-[16px]' : ' rounded-[16px]'
                    } ${dtl.desc ? ' opacity-100 ' : ' opacity-25'} `}
                  >
                    <Text>{dtl.title}</Text>
                    <Image source={require('assets/arrowdown.png')}></Image>
                  </View>
                  {opened && (
                    <Animated.View className='w-full min-h-[55px] bg-white rounded-b-[16px] p-4'>
                      {dtl.desc}
                    </Animated.View>
                  )}
                </Pressable>
              );
            })}
        </View>
      </AppPageScaffold>
    </Modal>
  );
};

export default EpisodeModal;
