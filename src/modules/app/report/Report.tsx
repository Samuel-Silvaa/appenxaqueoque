import AppPageScaffold from "../shared/components/appPageScaffold/AppPageScaffold";
import {
  Image,
  Pressable,
  Text,
  View,
  Animated,
  Touchable,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import screenOptions from "src/modules/shared/style/StackOptions";
import { useEffect, useState, useRef } from "react";
import { differenceInDays, format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { pinColor } from "src/infra/utils/appUtils";
import ChartsPage from "./components/charts/Charts";
import { Report } from "src/infra/@types/app.types";
import { useForm } from "react-hook-form";
import ExPressable from "src/modules/auth/shared/components/buttons/pressable/ExPressable";
import ReportDateRangeModal from "src/modules/shared/components/reportDateRangeModal/ReportDateRangeModal";
import { useAsyncAppDispatch } from "src/infra/app/store";
import { useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import {
  handleDeleteReport,
  handleFecthReports,
} from "src/infra/app/reducers/app.reducer";
import SwipeableFlatList from "react-native-swipeable-list";
import CalendarEpisodeListModal from "src/modules/shared/components/actionConfirmationModal/ActionConfirmationModal";
import { useToast } from "react-native-toast-notifications";
import { DeleteComponent } from "src/modules/shared/components/deleteComponent/DeleteComponent";
import { sharedEpisodeStyleSheet } from "../episode/shared/SharedEpisodeStyleSheet";

const stylesheet = {
  reportCard:
    "w-full flex-row items-start p-3 my-1 bg-white dark:bg-d-blue-primary rounded-[30px] h-[90px] shadow-lg overflow-hidden ",
  reportCardColor: "h-[80%] rounded-full w-2 mr-4 py-2 self-center",
  reportCardHeader: "flex-col h-[30%] w-[85%]",
  reportCardDesc:
    "mt-1 h-full opacity-50 dark:text-d-text-gray truncate break-word ",
};

const ResourceCard = ({
  reportDetails,
  navigation,
}: {
  reportDetails: Report;
  navigation?: any;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Pressable
        className={stylesheet.reportCard}
        onPress={() => {
          navigation.navigate("Charts", { reportDetails });
        }}
      >
        <View
          className={stylesheet.reportCardColor}
          style={{ backgroundColor: pinColor(reportDetails.acuteness) }}
        ></View>
        <View className={stylesheet.reportCardHeader}>
          <Text className="font-semibold dark:text-d-text-gray">
            Criado em{" "}
            {format(reportDetails.createdAt || new Date(), "P", {
              locale: ptBR,
            })}{" "}
            <Image
              className="w-2 h-2"
              source={require("src/assets/chart-clock.png")}
            />{" "}
            {format(reportDetails.createdAt || new Date(), "HH:mm", {
              locale: ptBR,
            })}
          </Text>
          <Text className={stylesheet.reportCardDesc}>
            Período entre{" "}
            {format(reportDetails.startDate, "P", { locale: ptBR })} e{" "}
            {format(reportDetails.endDate, "P", { locale: ptBR })}
          </Text>
          <Text className={stylesheet.reportCardDesc}>
            {reportDetails.episodeAmount} episódios
          </Text>
        </View>

        <Image
          resizeMode="contain"
          className="self-center w-4 h-4"
          source={require("src/assets/arrowright.png")}
        ></Image>
      </Pressable>
    </Animated.View>
  );
};

const ReportOptionsPage = ({ navigation }) => {
  const [isEpisodesPopulated, setIsEpisodesPopulated] = useState(true);
  const appState = useSelector(appStateSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAsyncAppDispatch();

  useEffect(() => {
    setIsEpisodesPopulated(appState!.episodes!.length > 0);
  }, [appState.episode, appState.reports]);

  return (
    <AppPageScaffold>
      <View className="flex-row justify-between items-center w-full mt-12">
        <ExPressable
          className={`rounded-full w-2/4 h-[45px] ${
            !isEpisodesPopulated ? "opacity-[0.4]" : ""
          } bg-blue-primary/60 text-white dark:text-white dark:bg-d-blue-primary shadow-lg`}
          title="Gerar relatório"
          onPress={() =>
            isEpisodesPopulated ? setIsModalOpen(true) : () => {}
          }
        />
        <ExPressable
          className={`rounded-full w-[45%] h-[45px] bg-white dark:bg-d-blue-primary text-black shadow-lg`}
          colorScheme="secodary "
          title="Lista de relatórios"
          onPress={() => {
            navigation.navigate("ReportListPage");
          }}
        />
      </View>

      <View className="w-full flex items-center mt-12">
        <Image
          resizeMode="contain"
          className="w-[300] h-[400] opacity-50"
          source={require("src/assets/doctorchild.png")}
        ></Image>
      </View>

      {!!isModalOpen && (
        <ReportDateRangeModal
          isOpen={isModalOpen}
          onClose={(dates) => setIsModalOpen(false)}
        />
      )}
    </AppPageScaffold>
  );
};

const ReportListPage = ({ navigation }) => {
  const dispatch = useAsyncAppDispatch();
  const appState = useSelector(appStateSelector);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const dateStringFormat = "yyyy/MM/dd";
  const [selectedDate, setSelectedDate] = useState({
    start: format(subDays(new Date(), 90), dateStringFormat, { locale: ptBR }),
    end: format(new Date(), dateStringFormat, { locale: ptBR }),
  });
  const [isReportsPopulated, setIsReportsPopulated] = useState(true);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [reportDraggedIndex, setReportDraggedIndex] = useState(0);

  useEffect(() => {
    setIsReportsPopulated(appState!.reports!.length > 0);
  }, [appState.episode, appState.reports]);

  useEffect(() => {
    dispatch(
      handleFecthReports({
        patientId: appState.patient!.id!,
        date: {
          date: {
            startDate: selectedDate.start.replaceAll("/", "-"),
            endDate: selectedDate.end.replaceAll("/", "-"),
          },
        },
      }),
    );
  }, []);

  const {
    formState: { errors },
  } = useForm();
  const toast = useToast();

  const handleDelete = async (report: Report) => {
    if (report.id) {
      const res = await dispatch(handleDeleteReport({ id: report!.id }));
      if (res.meta.requestStatus === "fulfilled") {
        toast.show("Relatório deletado com sucesso!", { type: "success" });
      }
    }
  };

  const renderResource = ({ item }: { index: number; item: Report }) => {
    return (
      <ResourceCard
        key={item.id}
        reportDetails={item}
        navigation={navigation}
      />
    );
  };

  return (
    <AppPageScaffold disabledScroll={true}>
      <View className="flex-col items-center justify-between my-4 gap-y-4">
        {/* <View className='w-full pr-2 h-[45px] mb-4'>
          <InputContainer
            className='bg-[#FAFAFA] rounded-[16px] h-[45px]'
            placeholder='Pesquisar'
            label=''
            name='search'
            setValue={setValue}
            errors={errors}
          ></InputContainer>
        </View> */}

        <View className="self-start px-2 w-full flex flex-row justify-between items-center">
          <View>
            <TouchableOpacity
              className={
                sharedEpisodeStyleSheet.topic.item + " bg-purple-dark-primary"
              }
            >
              <Text className="text-[#fff]">
                Últimos{" "}
                {differenceInDays(
                  new Date(selectedDate.end.replaceAll("/", "-")),
                  new Date(selectedDate.start.replaceAll("/", "-")),
                )}{" "}
                dias
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setIsFilterModalOpen(true)}
            className="flex-row justify-between items-center rounded-full bg-white p-3 shadow-lg"
          >
            <Image
              source={require("src/assets/filter.png")}
              className={`w-5 h-5`}
            />
          </TouchableOpacity>
        </View>
        <View className="bg-snow-white dark:bg-d-blue-primary mb-4 rounded-[44px] w-full h-[45px]">
          <Text className="font-semibold text-black dark:text-d-text-gray mx-auto text-md m-auto ">
            Visualize e envie um relatório ao seu médico
          </Text>
        </View>
      </View>

      {!!appState.reports?.length && (
        <SwipeableFlatList
          maxSwipeDistance={100}
          style={{
            height: Dimensions.get("screen").height * 0.55,
            paddingBottom: 30,
          }}
          keyExtractor={(item: Report, index: string) =>
            String(item!.id ?? index)
          }
          data={appState.reports ? appState.reports : []}
          renderQuickActions={({
            item,
            index,
          }: {
            index: number;
            item: Report;
          }) => {
            return (
              <>
                <DeleteComponent
                  item={item}
                  index={index}
                  onPress={() => {
                    setOpenConfirmationModal(true);
                    setReportDraggedIndex(index);
                  }}
                />
                {openConfirmationModal && index == reportDraggedIndex && (
                  <CalendarEpisodeListModal
                    isOpen={openConfirmationModal}
                    onClose={() => {
                      setOpenConfirmationModal(false);
                      setReportDraggedIndex(0);
                    }}
                    desc={`Você está prestes a deletar o relatório de ${format(
                      item.startDate,
                      "PPP",
                      { locale: ptBR },
                    )} à ${format(item.endDate, "PPP", { locale: ptBR })} `}
                    submitAction={() => {
                      setOpenConfirmationModal(false);
                      setReportDraggedIndex(0);
                      handleDelete(item);
                    }}
                  />
                )}
              </>
            );
          }}
          renderItem={renderResource}
        />
      )}

      {appState.reports?.length == 0 && (
        <View className="rounded-[18px] min-h-[50px] bg-blue-primary/30 flex items-center justify-center m-auto m-4 p-2">
          <Text className="font-semibold">
            Nenhum relatório foi gerado para este período.
          </Text>
        </View>
      )}

      {!!isFilterModalOpen && (
        <ReportDateRangeModal
          filter
          isOpen={isFilterModalOpen}
          onClose={(dates) => {
            setIsFilterModalOpen(false);
            if (dates && dates.start && dates.end && appState.patient?.id) {
              setSelectedDate({
                start: format(dates.start, dateStringFormat, { locale: ptBR }),
                end: format(dates.end, dateStringFormat, { locale: ptBR }),
              });
              dispatch(
                handleFecthReports({
                  patientId: appState.patient.id,
                  date: {
                    date: {
                      startDate: format(dates.start, "yyyy-MM-dd", {
                        locale: ptBR,
                      }),
                      endDate: format(dates.end, "yyyy-MM-dd", {
                        locale: ptBR,
                      }),
                    },
                  },
                }),
              );
            }
          }}
        />
      )}
    </AppPageScaffold>
  );
};

const ReportStack = createNativeStackNavigator();

const ReportStackNavigation = () => {
  const dispatch = useAsyncAppDispatch();
  const appState = useSelector(appStateSelector);
  useEffect(() => {
    if (appState.patient!.id) {
      dispatch(
        handleFecthReports({
          patientId: appState.patient!.id,
          date: {
            date: {
              startDate: format(subDays(new Date(), 15), "yyyy-MM-dd", {
                locale: ptBR,
              }),
              endDate: format(new Date(), "yyyy-MM-dd", { locale: ptBR }),
            },
          },
        }),
      );
    }
  }, [appState.patient]);
  return (
    <ReportStack.Navigator>
      <ReportStack.Screen
        options={screenOptions}
        name="ReportOptions"
        component={ReportOptionsPage}
      ></ReportStack.Screen>

      <ReportStack.Screen
        options={screenOptions}
        name="ReportListPage"
        component={ReportListPage}
      ></ReportStack.Screen>

      <ReportStack.Screen
        options={screenOptions}
        name="Charts"
        component={ChartsPage}
      ></ReportStack.Screen>
    </ReportStack.Navigator>
  );
};

export default ReportStackNavigation;
