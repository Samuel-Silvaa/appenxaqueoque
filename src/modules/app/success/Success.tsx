import { Image, Text, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';

const Success = ({ navigation }) => {
  // const { params } = route;

  return (
    <AppPageScaffold alignment='center'>
      <View className='w-full h-full gap-y-4 flex justify-center items-center mt-[25%]'>
        <Text className='rounded-[16px] h-[45px] bg-blue-primary w-3/4 text-black font-bold flex items-center justify-center'>
          Cadastro finalizado com sucesso!
        </Text>
        <Image source={require('assets/success.png')}></Image>
        <ExPressable
          title='Ver relatório'
          colorScheme='light'
          onPress={() => {
            navigation.navigate('Calendar');
          }}
        />
        <ExPressable
          title='Voltar ao início'
          onPress={() => {
            navigation.navigate('Tabs');
          }}
        />
      </View>
    </AppPageScaffold>
  );
};

export default Success;
