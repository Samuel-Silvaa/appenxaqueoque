import { Image, ImageSourcePropType, Text } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';
import { useCallback, useState } from 'react';

const stylesheet = {
  subtitle: ' w-3/4 text-center text-center text-lg ',
  img: 'mb-6 mt-12',
};

const data: {
  title?: string;
  subtitle: string;
  logo?: ImageSourcePropType;
  image: ImageSourcePropType;
  effetcMessage?: string;
}[] = [
  {
    title: ' Seja bem vindo(a) ao',
    subtitle:
      'Aqui temos médicos especializados e capacitados para cuidar de você!',
    logo: require('assets/logo.svg'),
    image: require('assets/doc_boy.svg'),
  },
  {
    subtitle:
      'Você terá acompanhamento médico para tratar a enxaqueca de uma forma descomplicada.',
    image: require('assets/group_doc_kids.svg'),
  },
  {
    title: ' Seja bem vindo(a) ao',
    subtitle:
      'Você só precisa anotar os episódios da dor quando estiver em crise.',
    image: require('assets/lunar_kid.svg'),
    effetcMessage: 'Vamos começar?',
  },
];

const Welcome = ({ navigation }) => {
  const [welcomeIndex, setWelcomeIndex] = useState(0);

  const handleCtaButton = useCallback(() => {
    if (welcomeIndex == data.length - 1) {
      () => navigation.navigate('home');
    } else {
      setWelcomeIndex((prevState) => prevState + 1);
    }
  }, []);

  return (
    <AuthScaffold ctaPrimaryText='Próximo' ctaPrimary={handleCtaButton}>
      {data[welcomeIndex].title && (
        <Text className={sharedStyleSheet.title}>
          {data[welcomeIndex].title}
        </Text>
      )}

      {data[welcomeIndex].logo && (
        <Image source={data[welcomeIndex].logo}></Image>
      )}

      <Text className={sharedStyleSheet.subtitle + stylesheet.subtitle}>
        {data[welcomeIndex].subtitle}
      </Text>

      {data[welcomeIndex].image && (
        <Image
          className={stylesheet.img}
          source={data[welcomeIndex].image}
        ></Image>
      )}

      {data[welcomeIndex].effetcMessage && (
        <Text className={sharedStyleSheet.subtitle + stylesheet.subtitle}>
          {data[welcomeIndex].effetcMessage}
        </Text>
      )}
    </AuthScaffold>
  );
};

export default Welcome;
