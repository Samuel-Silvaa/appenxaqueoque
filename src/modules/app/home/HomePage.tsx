import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';
import { useNavigation } from '@react-navigation/native';
import { useApp } from 'src/infra/app/app';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSelector } from "react-redux";
import { appStateSelector, authSelector } from "src/infra/app/selectors";

const stylesheet = {
  userName: 'text-2xl font-bold px-4 pb-4 dark:text-d-blue-title',
  countingDays: {
    card: 'w-full bg-white dark:bg-d-blue-primary-dark rounded-[20px] flex justify-center items-start h-[52px] mb-14 mt-4 px-4',
    title: 'text-start font-semibold dark:text-d-text-gray',
  },
  innerHomeContainer: {
    container:
      'relative w-full h-[100vw] bg-beige-primary dark:bg-d-blue-primary-dark flex-row flex-wrap justify-between rounded-[30px] mt-[80px] p-2',
    header: 'w-full h-[20%] flex items-center ',
    body: 'flex-row flex-wrap justify-evenly items-end w-full h-[80%] p-1',
    innerCardCategory:
      'bg-white w-[45%] h-[45%] rounded-[30px] p-2 pt-4 box-border m-1 dark:bg-d-blue-primary',
    innerCardImage: 'm-2 w-[24px] h-[24px]',
    kidsImg: 'absolute top-[-120px] w-[100%] h-[185]',
  },
};

interface HomeCategory {
  title: string;
  icon: ImageSourcePropType;
  path: string;
}

const categories: Array<HomeCategory> = [
  {
    title: 'Cadastro de episódios',
    icon: require('src/assets/plus-dark.png'),
    path: 'Episode',
  },
  {
    title: 'Enviar relatórios',
    icon: require('src/assets/stats.png'),
    path: 'Report',
  },
  {
    title: 'Calendário de episódios',
    icon: require('src/assets/calendar.png'),
    path: 'Calendar',
  },
  {
    title: 'Perfil',
    icon: require('src/assets/user.png'),
    path: 'Profile',
  },
];

const CountingDaysTitle = () => {
  const appState = useSelector(appStateSelector);
  return (
    <View className={stylesheet.countingDays.card}>
      {appState.episodes && (
        <Text className={stylesheet.countingDays.title}>
          Você está a{' '}
          {appState.episodes?.length > 0
            ? differenceInDays(
                format(new Date(), 'yyyy-MM-dd', {
                  locale: ptBR,
                }),
                
                  format(new Date(appState.episodes[0].dateTime!), 'yyyy-MM-dd', {
                    locale: ptBR,
                  })
                
              )
            : 0}{' '}
          dias sem crises!
        </Text>
      )}
    </View>
  );
};

const InnerCardCategory = ({ title, icon, path }: HomeCategory) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(path)}
      className={stylesheet.innerHomeContainer.innerCardCategory}
    >
      <View className="flex items-start" >
        <Image
          className={stylesheet.innerHomeContainer.innerCardImage}
          source={icon}
          tintColor='#262D33'
        ></Image>
        <Text
          className={
            sharedStyleSheet.subtitle + ' mx-2 w-3/4 dark:text-d-text-gray '
          }
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const InnerHomeContainer = () => {
  return (
    <View className={stylesheet.innerHomeContainer.container}>
      <View className={stylesheet.innerHomeContainer.header}>
        <Image
          resizeMode="contain"
          className={stylesheet.innerHomeContainer.kidsImg}
          source={require('src/assets/calendar_kids.png')}
        ></Image>
      </View>
      <View className={stylesheet.innerHomeContainer.body}>
        {categories.map((cat, index) => (
          <InnerCardCategory
            key={index}
            title={cat.title}
            icon={cat.icon}
            path={cat.path}
          />
        ))}
      </View>
    </View>
  );
};

const HomePage = () => {
  const auth = useSelector(authSelector);
  return (
    <AppPageScaffold>
      <Text className={stylesheet.userName}>Olá, {auth!.user!.name}...</Text>
      <CountingDaysTitle />
      <InnerHomeContainer />
    </AppPageScaffold>
  );
};

export default HomePage;
