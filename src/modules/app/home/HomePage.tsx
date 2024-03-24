import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';
import { useAuth } from 'src/infra/auth/auth';
import { useNavigation } from '@react-navigation/native';

const stylesheet = {
  userName: 'text-2xl font-bold p-4',
  countingDays: {
    card: 'w-full bg-whgite rounded-[30px] flex justify-center items-center sticky top-0',
    title:
      'text-start bg-white rounded-[30px] w-full h-[56px] flex  items-center p-4 font-semibold mb-14 mt-4',
  },
  innerHomeContainer: {
    container:
      'relative w-full h-[100vw] bg-beige-primary flex-row flex-wrap justify-between rounded-[30px] mt-[80px] p-2',
    header: 'w-full h-[20%] flex items-center ',
    body: 'flex-row flex-wrap justify-evenly items-end w-full h-[80%] p-1',
    innerCardCategory:
      'bg-white w-[45%] h-[45%] rounded-[30px] p-2 pt-4 box-border m-1',
    innerCardImage: 'm-2 w-[24px] h-[24px]',
    kidsImg: 'absolute top-[-90px]',
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
    icon: require('assets/plus-dark.png'),
    path: 'Episode',
  },
  {
    title: 'Relatórios',
    icon: require('assets/stats.png'),
    path: 'Report',
  },
  {
    title: 'Calendário de episódios',
    icon: require('assets/calendar.png'),
    path: 'Calendar',
  },
  {
    title: 'Perfil',
    icon: require('assets/user.png'),
    path: 'Profile',
  },
];

const CountingDaysTitle = () => {
  return (
    <View className={stylesheet.countingDays.card}>
      <Text className={stylesheet.countingDays.title}>
        Você está a 40 dias sem crises!
      </Text>
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
      <View>
        <Image
          className={stylesheet.innerHomeContainer.innerCardImage}
          source={icon}
          tintColor='#262D33'
        ></Image>
        <Text className={sharedStyleSheet.subtitle + ' mx-2 w-3/4'}>
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
          className={stylesheet.innerHomeContainer.kidsImg}
          source={require('assets/calendar_kids.png')}
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
  const { session } = useAuth();
  return (
    <AppPageScaffold>
      <Text className={stylesheet.userName}>Olá, {session?.user.name}...</Text>
      <CountingDaysTitle />
      <InnerHomeContainer />
    </AppPageScaffold>
  );
};

export default HomePage;
