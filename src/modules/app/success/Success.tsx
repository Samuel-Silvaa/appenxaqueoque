import { Image, Text, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import EpisodeModal from 'src/modules/shared/components/episodemodal/EpisodeModal';
import { useState } from 'react';
import { useApp } from 'src/infra/app/app';
import { format } from 'date-fns';

const stylesheet = {
  wrapper: 'w-full h-full gap-y-4 flex justify-center items-center mt-[10%]',
  titleconainer:
    'rounded-[16px] h-[45px] bg-blue-primary w-3/4 flex items-center justify-center',
  title: 'text-black font-bold',
};

const Success = ({ navigation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { episodeFormState, clearEpisodeFormState } = useApp();

  return (
    <AppPageScaffold alignment='center'>
      <View className={stylesheet.wrapper}>
        <View className={stylesheet.titleconainer}>
          <Text className={stylesheet.title}>
            Cadastro finalizado com sucesso!
          </Text>
        </View>
        <Image source={require('assets/success.png')}></Image>
        <ExPressable
          title='Ver relatório'
          colorScheme='light'
          onPress={() => {
            setIsModalOpen(true);
          }}
        />
        <ExPressable
          title='Voltar ao início'
          onPress={() => {
            clearEpisodeFormState();
            navigation.navigate('Home');
          }}
        />
      </View>
      {isModalOpen && (
        <EpisodeModal
          episode={episodeFormState}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </AppPageScaffold>
  );
};

export default Success;
