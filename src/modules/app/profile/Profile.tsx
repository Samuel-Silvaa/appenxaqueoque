import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector, authSelector } from 'src/infra/app/selectors';
import { signOut } from 'src/infra/app/reducers/auth.reducer';
import { useNavigation } from '@react-navigation/native';
import {
  handleDeleteAccount,
  setPageTitle,
} from 'src/infra/app/reducers/app.reducer';
import { differenceInYears } from 'date-fns';
import CalendarEpisodeListModal from 'src/modules/shared/components/actionConfirmationModal/ActionConfirmationModal';
import { useEffect, useState } from 'react';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useToast } from 'react-native-toast-notifications';

const stylesheet = {
  profile: {
    wrapper: 'flex-col w-full items-center justify-center my-4',
    infoRow:
      'flex-row justify-between items-center w-2/4 my-1 rounded-full bg-white dark:bg-d-blue-primary p-4',
  },
  customActionButton:
    'w-full flex-row items-center p-4 bg-transparent dark:bg-transparent',
};

const CustomActionButton = ({
  title,
  onPress,
  iconName,
}: {
  title: string;
  onPress?: () => void;
  iconName: ImageSourcePropType;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={stylesheet.customActionButton}
    >
      <Image className='mr-3 w-5 h-5 p-1' source={iconName}></Image>
      <Text className='dark:text-d-text-dark'>{title}</Text>
    </TouchableOpacity>
  );
};

const ProfilePage = () => {
  const auth = useSelector(authSelector);
  const appState = useSelector(appStateSelector);
  const dispatch = useDispatch();
  const dispatchAsync = useAsyncAppDispatch();
  const navigation = useNavigation();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    dispatch(setPageTitle('Perfil'));
  }, []);

  const handleDelete = async () => {
    if (appState.patient!.id && auth.sessionEmail) {
      const res = await dispatchAsync(
        handleDeleteAccount({
          id: appState.patient!.id,
          emailAddress: auth.sessionEmail,
        })
      );
      if (res.meta.requestStatus === 'fulfilled') {
        toast.show(
          'É uma pena que tenha partido. Estaremos sempre disponíveis para ajudar!',
          { type: 'success', duration: 30000 }
        );
        dispatch(signOut());
      }
    }
  };
  return (
    <AppPageScaffold>
      <View className={stylesheet.profile.wrapper}>
        <View className='relative mb-4'>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AvatarSelection', {
                email: auth.sessionEmail,
                isLogged: true,
              });
            }}
            className='bg-gray-secondary dark:bg-d-blue-primary items-center justify-center rounded-full absolute inline-flex bottom-[-20px] right-0 z-50'
          >
            <Image
              className='w-5 h-5 m-3'
              source={require('src/assets/camera-icon.png')}
            ></Image>
          </TouchableOpacity>
          <Image
            source={
              auth.avatar
                ? { uri: auth.avatar }
                : require('src/assets/duck.png')
            }
            className='w-36 h-36 rounded-full'
          ></Image>
        </View>
        <Text className='my-1 dark:text-d-text-white'>
          {appState.patient?.name}
        </Text>
        <View className={stylesheet.profile.infoRow}>
          <Text className='dark:text-d-text-white font-[300]'>
            {differenceInYears(Date.now(), appState.patient?.birthDate!)} anos
          </Text>
          <Text className='dark:text-d-text-white font-[300]'>
            {appState.patient?.height!.toFixed(2)}m{' '}
          </Text>
          <Text className='dark:text-d-text-white font-[300]'>
            {appState.patient?.weight}kg
          </Text>
        </View>
      </View>
      <View className='bg-blue-tertiary dark:bg-d-blue-primary w-full flex-grow rounded-[33px] p-4 mt-6 relative overflow-visible z-0'>
        <Image
          source={require('src/assets/ruiva-perfil.png')}
          className='w-32 h-32 absolute top-[-50px] right-0 z-50'
          style={{ objectFit: 'contain' }}
        ></Image>
        <View className='bg-white dark:bg-[#8593B8] w-full flex-grow rounded-[33px] py-4 '>
          <CustomActionButton
            iconName={require('src/assets/pencil.png')}
            onPress={() => {
              navigation.navigate(
                'PatientLogged' as never,
                { isEditMode: true } as never
              );
            }}
            title='Editar perfil'
          />
          {/* <CustomActionButton title='Notificações' /> */}
          <CustomActionButton
            title='Políticas de privacidade'
            iconName={require('src/assets/lock.png')}
            onPress={() => {
              navigation.navigate('PrivacyPolicy' as never);
            }}
          />
          <CustomActionButton
            title='Termos de uso'
            iconName={require('src/assets/diploma.png')}
            onPress={() => {
              navigation.navigate('Terms' as never);
            }}
          />
          <CustomActionButton
            title='Meus relatórios'
            iconName={require('src/assets/document.png')}
            onPress={() => {
              navigation.navigate('ReportListPage' as never);
            }}
          />
          <CustomActionButton
            title='Sobre nós'
            iconName={require('src/assets/info.png')}
            onPress={() => {
              navigation.navigate('AboutUs' as never);
            }}
          />
          {/* <CustomActionButton title='Contas vinculadas' /> */}
          <CustomActionButton
            title='Ajuda'
            iconName={require('src/assets/interrogation.png')}
            onPress={() => {
              navigation.navigate('Help' as never);
            }}
          />
          <CustomActionButton
            title='Deletar conta'
            iconName={require('src/assets/user.png')}
            onPress={() => {
              setOpenConfirmationModal(true);
            }}
          />
          <CustomActionButton
            title='Sair'
            iconName={require('src/assets/out.png')}
            onPress={() => {
              dispatch(signOut());
            }}
          />

          {openConfirmationModal && (
            <CalendarEpisodeListModal
              isOpen={openConfirmationModal}
              onClose={() => {
                setOpenConfirmationModal(false);
              }}
              desc={`Você está prestes a deletar a sua conta. Todos os seus dados serão perdidos de forma permamente.`}
              submitAction={() => {
                setOpenConfirmationModal(false);
                handleDelete();
              }}
            />
          )}
        </View>
        <Text className='p-4 text-start text-xs text-d-text-dark dark:text-[#737E86]'>
          Para uma melhor experiência e um ambiente agradável, leia as{' '}
          <Text className='dark:text-[#8FD7FF] text-xs'>
            Políticas de privacidade
          </Text>{' '}
          <Text className='dark:text-[#8FD7FF] text-xs'>
            {' '}
            e os Termos de uso.
          </Text>
        </Text>
        <Text className='m-auto text-xs'>Versão 1.0 - Beta - Teste aberto</Text>
      </View>
    </AppPageScaffold>
  );
};

export default ProfilePage;
