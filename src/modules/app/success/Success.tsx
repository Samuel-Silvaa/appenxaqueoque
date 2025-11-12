import { Image, Text, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { clearEpisodeState, setPageTitle } from "src/infra/app/reducers/app.reducer";
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { Episode } from 'src/infra/@types/app.types';
import { useEffect } from 'react';

const stylesheet = {
  wrapper: 'w-full h-full gap-y-4 flex justify-center items-center mt-[10%]',
  titleconainer:
    'rounded-[16px] h-[45px] bg-blue-primary w-3/4 flex items-center justify-center',
  title: 'text-black dark:text-d-text-gray font-bold',
};

const Success = ({ navigation }) => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);


  function joinLists(obj) {
    const newObject = {};

    for (const chave in obj) {
      const valor = obj[chave];

      if (Array.isArray(valor)) {
        // Junta arrays em string
        newObject[chave] = valor.join(',');
      } else if (typeof valor === 'object' && valor !== null) {
        // Chamada recursiva para objetos internos
        newObject[chave] = joinLists(valor);
      } else {
        // Copia valor direto
        newObject[chave] = valor;
      }
    }

    return newObject;
  }

  useEffect(() => {
    dispatch(setPageTitle(''));

  }, [])

  return (
    <AppPageScaffold alignment='center'>
      <View className={stylesheet.wrapper}>
        <View className={stylesheet.titleconainer}>
          <Text className={stylesheet.title}>
            Episódio registrado com sucesso!
          </Text>
        </View>
        <Image resizeMode="contain" className="w-[100%] h-[250]" source={require('src/assets/success.png')}></Image>
        <ExPressable
          title='Ver resumo do episódio'
          colorScheme='light'
          onPress={() => {
            navigation.navigate('EpisodeDetails', { episode: joinLists(appState!.episode) })
          }}
        />
        <ExPressable
          title='Voltar ao início'
          onPress={() => {
            dispatch(clearEpisodeState())
            navigation.navigate('Home');
          }}
        />
      </View>

    </AppPageScaffold>
  );
};

export default Success;
