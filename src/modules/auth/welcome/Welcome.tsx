import { Image, ImageSourcePropType, Text } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';
import { useCallback, useState } from 'react';
import { useAuth } from 'src/infra/auth/auth';
import * as SecureStore from 'expo-secure-store';
import { setWelcomeJourneyDone } from "src/infra/app/reducers/auth.reducer";
import { useDispatch } from "react-redux";

const stylesheet = {
  subtitle: ' w-3/4 text-center text-center text-lg mt-4 ',
};

const data: {
  title?: string;
  subtitle: string;
  logo?: ImageSourcePropType;
  image: ImageSourcePropType;
  effetcMessage?: string;
}[] = [
  {
    title: 'Seja bem-vindo',
    subtitle:
      'Registre seus episódios de dor de cabeça de forma descomplicada e divertida!',
    logo: require('src/assets/logo.png'),
    image: require('src/assets/armchair_kid.png'),
  },
  {
    subtitle:
      ' Você poderá enviar o relatório dos episódios para o seu médico acompanhar!',
    image: require('src/assets/group_doc_kids.png'),
  },
  {
    // title: ' Seja bem vindo(a) ao',
    title: '',
    subtitle:
      'Você só precisa registrar os episódios de dor quando estiver em crise.',
    image: require('src/assets/lunar_kid.png'),
    effetcMessage: 'Vamos começar?',
  },
];

const Welcome = ({ navigation }) => {
  const dispatch = useDispatch();
  const [welcomeIndex, setWelcomeIndex] = useState(0);

  const handleCtaButton = async () => {
    if (welcomeIndex < data.length - 1) {
      setWelcomeIndex((prevState) => prevState + 1);
    } else {
      dispatch(setWelcomeJourneyDone());
    }
  };

  return (
    <AuthScaffold ctaPrimaryText='Próximo' ctaPrimary={handleCtaButton}>
      {!!data[welcomeIndex] && (
        <>
          {data[welcomeIndex].title && (
            <Text className={sharedStyleSheet.title}>
              {data[welcomeIndex].title}
            </Text>
          )}

          {/* {data[welcomeIndex].logo && (
         <Image
           className='w-screen h-[150px]'
           resizeMode='contain'
           source={data[welcomeIndex].logo}
         ></Image>
       )} */}

          <Text className={sharedStyleSheet.subtitle + stylesheet.subtitle}>
            {data[welcomeIndex].subtitle}
          </Text>

          {data[welcomeIndex].image && (
            <Image
              className='w-screen h-[300]'
              resizeMode='contain'
              source={data[welcomeIndex].image}
            ></Image>
          )}

          {data[welcomeIndex].effetcMessage && (
            <Text className={sharedStyleSheet.subtitle + stylesheet.subtitle}>
              {data[welcomeIndex].effetcMessage}
            </Text>
          )}
        </>
      )}
    </AuthScaffold>
  );
};

export default Welcome;
