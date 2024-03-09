import { Image, ImageSourcePropType, Text, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';

const stylesheet = {
  userName: 'text-2xl font-bold p-4',
  innerHomeContainer: {
    container:
      'relative w-full h-[100vw] bg-beige-primary flex-row flex-wrap justify-between rounded-[30px] mt-[80px] p-2',
    header: 'w-full h-[20%] flex items-center ',
    body: 'flex-row flex-wrap justify-evenly items-end w-full h-[80%] p-1',
    innerCardCategory:
      'bg-white w-[45%] h-[45%] rounded-[30px] p-2 pt-4 box-border',
    innerCardImage: 'm-2',
    kidsImg: 'absolute top-[-90px]',
  },
};

interface HomeCategory {
  title: string;
  icon: ImageSourcePropType;
}

const categories: Array<HomeCategory> = [
  {
    title: 'Home',
    icon: require('assets/home.svg'),
  },
  {
    title: 'Relatórios',
    icon: require('assets/stats.svg'),
  },
  {
    title: 'Episódio',
    icon: require('assets/calendar.svg'),
  },
  {
    title: 'Perfil',
    icon: require('assets/user.svg'),
  },
];

const CountingDaysTitle = () => {
  return (
    <View className='w-full bg-whgite rounded-[30px] flex justify-center items-center'>
      <Text className='text-start bg-white rounded-[30px] w-full h-[56px] flex  items-center p-4 font-semibold mb-14 mt-4'>
        Você está a 40 dias sem crises!
      </Text>
    </View>
  );
};

const InnerCardCategory = ({
  title,
  icon,
}: {
  title: string;
  icon: ImageSourcePropType;
}) => {
  return (
    <View className={stylesheet.innerHomeContainer.innerCardCategory}>
      <Image
        className={stylesheet.innerHomeContainer.innerCardImage}
        source={icon}
        tintColor='#262D33'
      ></Image>
      <Text className={sharedStyleSheet.subtitle + ' mx-2'}>{title}</Text>
    </View>
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
        {categories.map((cat) => (
          <InnerCardCategory title={cat.title} icon={cat.icon} />
        ))}
      </View>
    </View>
  );
};

const HomePage = () => {
  return (
    <AppPageScaffold>
      <Text className={stylesheet.userName}>Olá, Pietra...</Text>
      <CountingDaysTitle />
      <InnerHomeContainer />
    </AppPageScaffold>
  );
};

export default HomePage;
