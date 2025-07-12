import { Image, Text, TouchableOpacity, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from 'src/infra/app/selectors';
import { signOut } from 'src/infra/app/reducers/auth.reducer';
import { useNavigation } from '@react-navigation/native';
import { setPageTitle } from "src/infra/app/reducers/app.reducer";

const stylesheet = {
  profile: {
    wrapper: 'flex-col w-full items-center justify-center my-4',
    infoRow: 'flex-row justify-between items-center w-2/4 my-1',
  },
  customActionButton:
    'w-full flex-row items-center p-4 bg-white dark:bg-transparent',
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
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <AppPageScaffold>
      <View className={stylesheet.profile.wrapper}>
        <Image source={require('src/assets/pietra.png')}></Image>
        <Text className='my-1 dark:text-d-text-gray'>Pietra Menezes</Text>
        <View className={stylesheet.profile.infoRow}>
          <Text className='dark:text-d-text-gray'>8 anos</Text>
          <Text className='dark:text-d-text-gray'>1,30cm</Text>
          <Text className='dark:text-d-text-gray'>30kg</Text>
        </View>
      </View>
      <View className='bg-blue-tertiary dark:bg-d-blue-primary w-full flex-grow rounded-[33px] p-4'>
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
