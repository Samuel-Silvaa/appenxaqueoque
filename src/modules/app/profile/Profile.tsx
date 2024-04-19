import { Image, Text, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { sharedEpisodeStyleSheet } from '../episode/shared/SharedEpisodeStyleSheet';
import { useAuth } from 'src/infra/auth/auth';

const stylesheet = {
  profile: {
    wrapper: 'flex-col w-full items-center justify-center my-4',
    infoRow: 'flex-row justify-between items-center w-2/4 my-1',
  },
  customActionButton:
    'w-full flex-row items-center p-4 bg-white rounded-[30px]',
};

const CustomActionButton = ({ title }: { title: string }) => {
  return (
    <View className={stylesheet.customActionButton}>
      <Image className='mr-3' source={require('assets/out.png')}></Image>
      <Text>{title}</Text>
    </View>
  );
};

const ProfilePage = () => {
  const { session } = useAuth();

  return (
    <AppPageScaffold displayBg={session?.userType == 'PATIENT'}>
      <View className={stylesheet.profile.wrapper}>
        <Image source={require('assets/pietra.png')}></Image>
        <Text className='my-1'>Pietra Menezes</Text>
        <View className={stylesheet.profile.infoRow}>
          <Text>8 anos</Text>
          <Text>1,30cm</Text>
          <Text>30kg</Text>
        </View>
      </View>
      <View className='bg-blue-tertiary w-full flex-grow rounded-[33px] p-4'>
        <View className='bg-white w-full flex-grow rounded-[33px]'>
          <CustomActionButton title='Editar perfil' />
          <CustomActionButton title='Notificações' />
          <CustomActionButton title='Privacidade' />
          <CustomActionButton title='Segurança' />
          <CustomActionButton title='Meus relatórios' />
          <CustomActionButton title='Contas vinculadas' />
          <CustomActionButton title='Ajuda' />
          <CustomActionButton title='Sair' />
        </View>
      </View>
    </AppPageScaffold>
  );
};

export default ProfilePage;
