import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppPageScaffold from "../shared/components/appPageScaffold/AppPageScaffold";
import { sharedStyleSheet } from "src/modules/auth/shared/style/stylesheet";
import { useNavigation } from "@react-navigation/native";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSelector } from "react-redux";
import { appStateSelector, authSelector } from "src/infra/app/selectors";

const stylesheet = {
  userName:
    "text-2xl font-bold px-4 pb-4 dark:text-d-blue-title w-[90%] truncate break-words",
  countingDays: {
    card: "w-full bg-white dark:bg-d-blue-primary-dark rounded-[20px] flex justify-center items-start h-[52px] mb-14 mt-4 px-4",
    title: "text-start font-semibold dark:text-d-text-gray",
  },
  innerHomeContainer: {
    container:
      "relative w-full h-[90vw] dark:bg-d-blue-primary-dark flex-row flex-wrap justify-between rounded-[30px] mt-[80px] p-2  bg-beige-primary/100",
    header: "w-full h-[15%] flex items-center p-4",
    body: "flex-row flex-wrap justify-evenly items-end w-full h-[80%] p-1",
    innerCardCategory:
      "bg-white w-[45%] h-[45%] rounded-[30px] p-2 pt-4 box-border m-1 dark:bg-d-blue-primary shadow-lg",
    innerCardImage: "m-2 w-6 h-6",
    kidsImg: "absolute top-[-120px] w-[100%] h-[185]",
  },
  footer: "w-full ",
  footerBtn:
    "bg-[#F8ECDE] dark:bg-d-blue-primary w-full h-[70px] rounded-full p-2 my-2",
  footerBtnInner:
    "bg-white dark:bg-d-blue-primary-dark w-ful h-full rounded-full flex-row items-center justify-between",
};

interface HomeCategory {
  title: string;
  icon: ImageSourcePropType;
  path: string;
  child?: string;
}

const categories: Array<HomeCategory> = [
  {
    title: "Cadastro de episódios",
    icon: require("src/assets/plus-dark.png"),
    path: "Episode",
  },
  {
    title: "Enviar relatórios",
    icon: require("src/assets/stats.png"),
    path: "Report",
    child: "ReportOptions",
  },
  {
    title: "Calendário de episódios",
    icon: require("src/assets/calendar.png"),
    path: "Calendar",
  },
  {
    title: "Perfil",
    icon: require("src/assets/user.png"),
    path: "Profile",
  },
];

const CountingDaysTitle = () => {
  const appState = useSelector(appStateSelector);

  const getDaysRange = () =>
    appState.episodes?.length > 0
      ? differenceInDays(
          format(new Date(), "yyyy-MM-dd", { locale: ptBR }),
          format(new Date(appState.episodes[0].dateTime!), "yyyy-MM-dd", {
            locale: ptBR,
          }),
        )
      : 0;
  return (
    <View className={stylesheet.countingDays.card}>
      {!!appState.episodes && (
        <Text className={stylesheet.countingDays.title}>
          Você está há {getDaysRange()} dias sem crises!
        </Text>
      )}
    </View>
  );
};

const InnerCardCategory = ({ title, icon, path, child }: HomeCategory) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(path as never);
      }}
      className={stylesheet.innerHomeContainer.innerCardCategory}
    >
      <View className="flex items-start">
        <Image
          className={stylesheet.innerHomeContainer.innerCardImage}
          source={icon}
          tintColor="#262D33"
        ></Image>
        <Text
          className={
            sharedStyleSheet.subtitle + " mx-2 w-3/4 dark:text-d-text-gray "
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
          source={require("src/assets/calendar_kids.png")}
        ></Image>
      </View>
      <View className={stylesheet.innerHomeContainer.body}>
        {categories.map((cat, index) => (
          <InnerCardCategory
            key={index}
            title={cat.title}
            icon={cat.icon}
            path={cat.path}
            child={cat.child}
          />
        ))}
      </View>
    </View>
  );
};

const FirtAccessInnerHomeContainer = () => {
  const navigation = useNavigation();

  return (
    <View className={stylesheet.innerHomeContainer.header}>
      <View className={stylesheet.footer}>
        <Pressable className={stylesheet.footerBtn}>
          <TouchableOpacity
            className={stylesheet.footerBtnInner}
            onPress={() => {
              navigation.navigate("Episode" as never);
            }}
          >
            <Text className="dark:text-d-text-gray w-[70%] text-xs margin-auto text-center pl-2">
              Vamos registrar seu primeiro episódio?
            </Text>
            <Image
              className=" h-full ml-1.5"
              resizeMode="contain"
              source={require("src/assets/doublearrowrightbg.png")}
            ></Image>
          </TouchableOpacity>
        </Pressable>
      </View>
    </View>
  );
};

const HomePage = () => {
  const auth = useSelector(authSelector);
  const appstate = useSelector(appStateSelector);
  const isEpisodesPopulated = appstate.episodes.length;

  return (
    <AppPageScaffold paddingInset={isEpisodesPopulated ? 4 : 0}>
      <View>
        <View className="flex flex-row items-center p-0">
          {!isEpisodesPopulated && !appstate.loading && (
            <Image
              className=" h-[200] w-[30vw]"
              resizeMode="contain"
              source={require("src/assets/ruiva-sem-episodio.png")}
            ></Image>
          )}
          <Text className={stylesheet.userName}>
            Olá, {!!auth!.user ? auth.user!.name : "..."}
          </Text>
        </View>
        {!!isEpisodesPopulated && (
          <View>
            <CountingDaysTitle />
            <InnerHomeContainer />
          </View>
        )}

        {!isEpisodesPopulated && !appstate.loading && (
          <FirtAccessInnerHomeContainer />
        )}
      </View>
    </AppPageScaffold>
  );
};

export default HomePage;
