import { Image, Text, TouchableOpacity, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector, authSelector } from 'src/infra/app/selectors';
import { signOut } from 'src/infra/app/reducers/auth.reducer';
import { useNavigation } from '@react-navigation/native';
import { setPageTitle } from "src/infra/app/reducers/app.reducer";
import { differenceInYears } from "date-fns";

const stylesheet = {
  profile: {
    wrapper: 'flex-col w-full items-center justify-center my-4',
    infoRow: 'flex-row justify-between items-center w-2/4 my-1 rounded-full bg-white dark:bg-d-blue-primary p-4',
  },
  customActionButton:
    'w-full flex-row items-center p-4 bg-transparent dark:bg-transparent',
};

const CustomActionButton = ({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={stylesheet.customActionButton}
    >
      <Image className='mr-3' source={require('src/assets/out.png')}></Image>
      <Text className='dark:text-d-text-dark'>{title}</Text>
    </TouchableOpacity>
  );
};

const ProfilePage = () => {
  const auth = useSelector(authSelector);
  const appState = useSelector(appStateSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <AppPageScaffold>
      <View className={stylesheet.profile.wrapper}>
        <View className="relative">
        <TouchableOpacity
            onPress={() => {
              navigation.navigate('AvatarSelection' as never, {email: auth.sessionEmail, isLogged: true});
            }}
            className="bg-gray-secondary dark:bg-d-blue-primary p-2 items-center justify-center rounded-full absolute inline-flex bottom-[-20px] right-0 z-50"
          >
            <Text className="text-white font-semibold "><Image source={require('src/assets/camera-icon.png')}></Image></Text>
          </TouchableOpacity>
        <Image source={auth.avatar ? {uri: auth.avatar } : require('src/assets/duck.png')} className="w-36 h-36 rounded-full"></Image>
        </View>
        <Text className='my-1 dark:text-d-text-white'>{appState.patient?.name}</Text>
        <View className={stylesheet.profile.infoRow}>
          <Text className='dark:text-d-text-white'>{differenceInYears( Date.now(), appState.patient?.birthDate!) } anos</Text>
          <Text className='dark:text-d-text-white'>{(appState.patient?.height! / 100).toFixed(2)}m </Text>
          <Text className='dark:text-d-text-white'>{appState.patient?.weight}kg</Text>
        </View>
      </View>
      <View className='bg-blue-tertiary dark:bg-d-blue-primary w-full flex-grow rounded-[33px] p-4 mt-6 relative overflow-visible z-0'>
        <Image source={require('src/assets/ruiva-perfil.png')} className="w-32 h-32 absolute top-[-50px] right-0 z-50" style={{objectFit: 'contain'}} ></Image>
        <View className='bg-white dark:bg-[#8593B8] w-full flex-grow rounded-[33px] py-4 '>
          <CustomActionButton title='Editar perfil' />
          {/* <CustomActionButton title='Notificações' /> */}
          <CustomActionButton
            title='Privacidade'
            onPress={() => {
              navigation.navigate('PrivacyPolicy' as never);
            }}
          />
          <CustomActionButton
            title='Termos'
            onPress={() => {
              navigation.navigate('Terms' as never);
            }}
          />
          <CustomActionButton
            title='Meus relatórios'
            onPress={() => {
              navigation.navigate('Report' as never);
            }}
          />
          {/* <CustomActionButton title='Contas vinculadas' /> */}
          <CustomActionButton title='Ajuda' 
           onPress={() => {
            dispatch(setPageTitle('Ajuda'));
            navigation.navigate('Help' as never);

          }}  />
          <CustomActionButton title='Sobre nós' 
            onPress={() => {
              navigation.navigate('AboutUs' as never);

            }} />
          <CustomActionButton
            title='Sair'
            onPress={() => {
              dispatch(signOut());
            }}
          />
        </View>
        <Text className='p-4 text-start text-xs text-d-text-dark dark:text-[#737E86]'>
          Para uma melhor experiência e um ambiente agradável, leia as{' '}
       
            <Text className='dark:text-[#8FD7FF] text-xs'>
              Políticas de privacidade
            </Text>
     {' '}
          e os{' '}
            <Text className='dark:text-[#8FD7FF] text-xs'>Termos de uso</Text>
          .
        </Text>
      </View>
    </AppPageScaffold>
  );
};

export default ProfilePage;
