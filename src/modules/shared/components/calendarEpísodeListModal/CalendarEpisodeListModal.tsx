import {
  Animated,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useToast } from 'react-native-toast-notifications';
import SwipeableFlatList from 'react-native-swipeable-list';
import { Episode } from 'src/infra/@types/app.types';
import { useEffect, useRef, useState } from 'react';
import { DeleteComponent } from '../deleteComponent/DeleteComponent';
import { pinColor } from 'src/infra/utils/appUtils';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';
import { handleDeleteEpisode } from 'src/infra/app/reducers/app.reducer';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { CloseButton } from '../closeButton/CloseButton';

const stylesheet = {
  episodeCard:
    'w-full flex-row items-start p-3 my-1 bg-white dark:bg-d-blue-primary rounded-[30px] h-[90px] shadow-lg overflow-hidden ',
  episodeCardColor: 'h-[80%] rounded-full w-2 mr-4 py-2 self-center',
  episodeCardHeader: 'flex-col h-[30%] w-[85%]',
  episodeCardDesc:
    'mt-2 w-3/4 h-full opacity-50 dark:text-d-text-gray truncate w-[90%] break-word ',
};

const CalendarEpisodeListModal = ({
  isOpen,
  onClose,
  episodes,
}: {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
}) => {
  const {
    formState: { errors },
  } = useForm();
  const dispatchAsync = useAsyncAppDispatch();
  const toast = useToast();

  const EpisodeCard = ({ episodeDetails }: { episodeDetails: Episode }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<any>();

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
          className={stylesheet.episodeCard}
          onPress={() => {
            navigation.navigate('EpisodeDetails', { episode: episodeDetails });
          }}
        >
          <View
            className={stylesheet.episodeCardColor}
            style={{ backgroundColor: pinColor(episodeDetails!.acuteness) }}
          ></View>
          <View className={stylesheet.episodeCardHeader}>
            <Text className='font-semibold dark:text-d-text-gray'>
              {format(new Date(episodeDetails.dateTime!), 'dd/MM/yyyy')}
            </Text>
            {!!episodeDetails?.notes ? (
              <Text className={stylesheet.episodeCardDesc}>
                {episodeDetails.notes.replaceAll(',', ' - ')}
              </Text>
            ) : (
              <Text className={stylesheet.episodeCardDesc}>Sem anotações</Text>
            )}
          </View>

          <Image
            resizeMode='contain'
            className='self-center w-4 h-4'
            source={require('src/assets/arrowright.png')}
          ></Image>
        </Pressable>
      </Animated.View>
    );
  };

  const renderEpisode = ({ item }: { index: number; item: Episode }) => {
    return <EpisodeCard key={item.id} episodeDetails={item} />;
  };

  const handleDelete = async (id: string) => {
    if (id) {
      const res = await dispatchAsync(handleDeleteEpisode({ id: id }));
      if (res.meta.requestStatus === 'fulfilled') {
        onClose();
        toast.show('Episódio deletado com sucesso!', { type: 'success' });
      }
    }
  };

  return (
    <Modal
      transparent={true}
      animationType='fade'
      visible={isOpen}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View className='flex-1 bg-black/50 justify-center items-center'>
        <View className='w-3/4 min-h-[250px] z-999 m-auto bg-white dark:bg-blue-primary-dark rounded-[30px] shadow-2xl shadow-blue-primary dark:shadow-blue-primary-dark flex items-center justify-between p-6 relative'>
          <View className='w-full relative mb-6 items-end'>
            <CloseButton onClose={onClose} />
          </View>
          <Text
            className={sharedStyleSheet.subtitle.concat(
              ' text-sm font-thin text-center'
            )}
          >
            Selecione um episódio que deseja visualizar
          </Text>
          {!!episodes.length && (
            <SwipeableFlatList
              keyExtractor={(item: Episode, index: string) =>
                String(item!.id ?? index)
              }
              data={episodes ? episodes : []}
              renderQuickActions={({
                item,
                index,
              }: {
                index: number;
                item: Episode;
              }) => {
                return (
                  <>
                    <DeleteComponent
                      item={item}
                      index={index}
                      onPress={() => {
                        handleDelete(item.id!);
                      }}
                    />
                  </>
                );
              }}
              renderItem={renderEpisode}
              maxSwipeDistance={100}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CalendarEpisodeListModal;
