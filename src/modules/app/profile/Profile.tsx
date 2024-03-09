import { Image, Text, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';

const CustomActionButton = ({ title }: { title: string }) => {
  return (
    <View className='w-full flex-row items-center p-4 my-1 bg-white rounded-[30px] min-h-[66px]'>
      <Image className='mr-3' source={require('assets/out.svg')}></Image>
      <Text>{title}</Text>
    </View>
  );
};

const ProfilePage = () => {
  return (
    <AppPageScaffold>
      <View className='flex-col w-full items-center justify-center my-4'>
        <Image source={require('assets/pietra.svg')}></Image>
        <Text className='my-1'>Pietra Menezes</Text>
        <View className='flex-row justify-between items-center w-2/4 my-1'>
          <Text>8 anos</Text>
          <Text>1,30cm</Text>
          <Text>30kg</Text>
        </View>
      </View>
      <CustomActionButton title='Editar perfil' />
      <CustomActionButton title='Termos de uso' />
      <CustomActionButton title='Sair' />
    </AppPageScaffold>
  );
};

export default ProfilePage;
