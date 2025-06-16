import { Image, Text, TouchableOpacity, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "src/infra/app/selectors";
import { signOut } from "src/infra/app/reducers/auth.reducer";

const stylesheet = {
  profile: {
    wrapper: 'flex-col w-full items-center justify-center my-4',
    infoRow: 'flex-row justify-between items-center w-2/4 my-1',
  },
  customActionButton:
    'w-full flex-row items-center p-4 bg-white rounded-[30px]',
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
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const ProfilePage = () => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  return (
    <AppPageScaffold displayBg={auth.userType == 'PATIENT'}>
      <View className={stylesheet.profile.wrapper}>
        <Image source={require('src/assets/pietra.png')}></Image>
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
          <CustomActionButton title='Sair' onPress={() => {
            dispatch(signOut())
          }} />
        </View>
      </View>
    </AppPageScaffold>
  );
};

export default ProfilePage;
