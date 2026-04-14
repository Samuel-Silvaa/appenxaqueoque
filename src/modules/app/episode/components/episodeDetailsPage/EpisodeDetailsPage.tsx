import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { createRef, useEffect, useMemo, useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import AppPageScaffold from "src/modules/app/shared/components/appPageScaffold/AppPageScaffold";
import { ptBR } from "date-fns/locale";
import { useNavigation, useRoute } from "@react-navigation/native";
import { episodePinColors, pinColor } from "src/infra/utils/appUtils";
import {
  Acuteness,
  Episode,
  ImpairFactor,
  ImprovementFactor,
  PainType,
  Trigger,
} from "src/infra/@types/app.types";
import {
  handleDeleteEpisode,
  handleFormChanging,
} from "src/infra/app/reducers/app.reducer";
import { useDispatch } from "react-redux";
import ExPressable from "src/modules/auth/shared/components/buttons/pressable/ExPressable";
import CalendarEpisodeListModal from "../../../../shared/components/actionConfirmationModal/ActionConfirmationModal";
import { useAsyncAppDispatch } from "src/infra/app/store";
import { useToast } from "react-native-toast-notifications";
import { CloseButton } from "src/modules/shared/components/closeButton/CloseButton";

const stylesheet = {
  wrapper: "w-full pt-10",
  header: "w-full flex-row items-center justify-between mb-4",
  arrowdown: "flex items-center justify-center p-2 w-5 h-5",
  closeButton: "p-3",
  edition:
    "flex-col items-center justify-center w-[48px] h-[48px] rounded-full p-2  shadow-lg ",
  editText: "text-[8px] text-black dark:text-d-text-gray",
  headerTitle: "text-md font-bold text-black dark:text-d-text-gray",
  headerDate: "text-black dark:text-d-text-gray text-sm",
  contentWrapper:
    "my-2 w-full flex justify-center overflow-hidden gap-y-2 pb-2 items-center rounded-[30px] px-2 py-4 mt-5 shadow-xl bg-white/30",
  smallInfoBlock:
    "w-[92%] rounded-[30px] bg-primary dark:bg-d-blue-primary m-auto shadow-lg shadow-black-200 ",
  smallInfoContainer: "w-full flex-row justify-start items-center px-3 py-4",
  smallInfoTitle: "font-bold dark:text-d-text-gray",
  smallInfoDesc: "w-3/4 dark:text-d-text-gray break-word",
  smallInfoImgContainer: "flex-col justify-start items-start py-3 w-full",
  smInfoImgContainer:
    "mr-4 w-[50] h-[50] p-2 flex items-center justify-center rounded-[16px]",
};

// --- Utils ---
const sanitizeString = (value?: string | null): string => value?.trim() || "";

const toArray = (v: string | string[] | null | undefined): string[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const formatPainType = (ep: Episode): string | null => {
  if (!ep.painType) return null;
  if (ep.painType === PainType.ANOTHER && ep.anotherPainType?.trim())
    return `${ep.painType}: ${ep.anotherPainType.trim()}`;
  return ep.painType;
};

const formatTriggers = (ep: Episode): string | null => {
  const factors = toArray(ep.triggers);
  if (!factors.length) return null;
  return (
    factors
      .map((f) => {
        if (f === Trigger.FOOD && ep.foodImpair?.trim())
          return `${f}: ${ep.foodImpair.trim()}`;
        if (f === Trigger.ANOTHER && ep.anotherTrigger?.trim())
          return `${f}: ${ep.anotherTrigger.trim()}`;
        return f;
      })
      .join("\n") || null
  );
};

const formatImprovementFactors = (ep: Episode): string | null => {
  const factors = toArray(ep.improvementFactor);
  if (!factors.length) return null;
  return (
    factors
      .map((f) => {
        if (f === ImprovementFactor.MEDICINE) {
          const namePart = ep.medicine?.trim() || "";
          const dosagePart = ep.combinedDosage
            ? `${ep.combinedDosage}/${ep.medicineDosage}${ep.medicineUnit || ""}`
            : ep.medicineDosage
              ? `${ep.medicineDosage}${ep.medicineUnit || ""}`
              : "";
          const detail = [namePart, dosagePart].filter(Boolean).join(" - ");
          const label = detail ? `${f}: ${detail}` : f;
          return ep.medicineImprovement?.trim()
            ? `${label} - ${ep.medicineImprovement.trim()}`
            : label;
        }
        if (f === ImprovementFactor.FOOD && ep.foodImprovement?.trim())
          return `${f}: ${ep.foodImprovement.trim()}`;
        if (
          f === ImprovementFactor.ANOTHER &&
          ep.anotherImprovementFactor?.trim()
        )
          return `${f}: ${ep.anotherImprovementFactor.trim()}`;
        return f;
      })
      .join("\n") || null
  );
};

const formatImpairFactors = (ep: Episode): string | null => {
  const factors = toArray(ep.impairFactor);
  if (!factors.length) return null;
  return (
    factors
      .map((f) => {
        if (f === ImpairFactor.ANOTHER && ep.anotherImpairFactor?.trim())
          return `${f}: ${ep.anotherImpairFactor.trim()}`;
        return f;
      })
      .join("\n") || null
  );
};

const EpisodeDetailsPage = ({}: {}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const dispatchAsync = useAsyncAppDispatch();
  const [episode, setEpisode] = useState<Episode>({} as Episode);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const toast = useToast();
  const route = useRoute();

  const getDifferenceInHours = (startTime: string, endTime: string) => {
    const date = new Date(episode.dateTime!);
    const startDate = new Date(date);
    const endDate = new Date(date);

    startDate.setUTCHours(parseFloat(startTime.substring(0, 2)));
    endDate.setUTCHours(parseFloat(endTime.substring(0, 2)));

    startDate.setUTCMinutes(parseFloat(startTime.substring(3, 6)));
    endDate.setUTCMinutes(parseFloat(endTime.substring(3, 6)));

    const hours = String(differenceInHours(endDate, startDate)).padStart(
      2,
      "0",
    );
    const minutes = String(
      differenceInMinutes(endDate, startDate) - 60 * parseFloat(hours),
    ).padStart(2, "0");

    return hours + ":" + minutes + "m";
  };

  const acutenessIcon = () => {
    if (episode.acuteness?.includes(Acuteness.LIGHT))
      return require("src/assets/acuteness-light.png");

    if (episode.acuteness?.includes(Acuteness.MILD))
      return require("src/assets/acuteness-mild.png");

    if (episode.acuteness?.includes(Acuteness.SEVERE))
      return require("src/assets/acuteness-severe.png");

    return require("src/assets/acuteness-light.png");
  };

  useEffect(() => {
    setEpisode(route.params!.episode as Episode);
  }, []);

  const fullDetails = [
    {
      icon: require("src/assets/timer.png"),
      title: "Horário do episódio",
      desc: sanitizeString(episode?.time) || null,
    },
    {
      icon: require("src/assets/chart-clock.png"),
      title: "Horas de duração",
      desc:
        episode!.start && episode!.end
          ? getDifferenceInHours(episode!.start, episode!.end)
          : null,
    },
    {
      icon: require("src/assets/chart-header-location.png"),
      title: "Localização",
      desc: (() => {
        const arr = toArray(episode.location as string | string[]);
        return arr.length ? arr.join("\n") : null;
      })(),
    },
    {
      icon: acutenessIcon(),
      title: "Intensidade",
      desc: sanitizeString(episode.acuteness) || null,
    },
    {
      icon: require("src/assets/chart-sad.png"),
      title: "Característica da dor",
      desc: formatPainType(episode),
    },
    {
      icon: require("src/assets/chart-symptoms.png"),
      title: "Sintomas associados",
      desc: (() => {
        const arr = toArray(episode.symptoms as string | string[]);
        return arr.length ? arr.join("\n") : null;
      })(),
    },
    {
      icon: require("src/assets/chart-header-location.png"),
      title: "Sintomas da aura",
      desc: (() => {
        const arr = toArray(episode.haloSymptoms as string | string[]);
        return arr.length ? arr.join("\n") : null;
      })(),
    },
    {
      icon: require("src/assets/chart-bad-sleep.png"),
      title: "Fatores de piora",
      desc: formatImpairFactors(episode),
    },
    {
      icon: require("src/assets/chart-trigger.png"),
      title: "Gatilhos",
      desc: formatTriggers(episode),
    },
    {
      icon: require("src/assets/chart-improvement.png"),
      title: "Fatores de melhora",
      desc: formatImprovementFactors(episode),
    },
    {
      icon: require("src/assets/chart-period.png"),
      title: "Período menstrual",
      desc: (() => {
        const p = episode.period;
        if (p == null) return null;
        if (p === "false" || p === false || p === 0) return "N/A";
        return sanitizeString(episode.periodNotes) || "Sim";
      })(),
    },
    {
      icon: require("src/assets/chart-notes.png"),
      title: "Observações",
      desc: sanitizeString(episode.notes) || null,
    },
  ];

  const { details, nullDetails } = useMemo(() => {
    const details = fullDetails.filter((d) => !!d.desc);
    const nullDetails = fullDetails.filter((d) => !d.desc);
    return { details, nullDetails };
  }, [episode]);

  const handleDelete = async (id: string) => {
    if (id) {
      const res = await dispatchAsync(handleDeleteEpisode({ id: id }));
      if (res.meta.requestStatus === "fulfilled") {
        navigation.navigate("Home" as never);
        toast.show("Episódio deletado com sucesso!", { type: "success" });
      }
    }
  };

  return (
    <AppPageScaffold disabledScroll={false} hasArrowBack={false}>
      <View className={stylesheet.wrapper}>
        <View className={stylesheet.header}>
          <TouchableOpacity
            onPress={() => {
              dispatch(
                handleFormChanging({
                  ...episode,
                  isEdition: true,
                  dates: {
                    [format(
                      String(episode?.dateTime),
                      "yyyy-MM-dd",
                    ).toString()]: {
                      selected: true,
                      marked: true,
                      selectedColor: pinColor(episode.acuteness!),
                      dotColor: pinColor(episode.acuteness!),
                    },
                  },
                }),
              );
              navigation.navigate("Episode" as never);
            }}
            style={{ backgroundColor: pinColor(episode.acuteness!) }}
            className={stylesheet.edition}
          >
            <Image
              className="w-4 h-4"
              source={require("src/assets/pencil.png")}
            />
            <Text className={stylesheet.editText}>Editar</Text>
          </TouchableOpacity>

          <View className="items-center">
            <Text className={stylesheet.headerTitle}>
              Resumo do epísodio {""}
            </Text>
            {!!episode?.dateTime && (
              <Text className={stylesheet.headerDate}>
                {format(episode?.dateTime, "PPP", { locale: ptBR })}
              </Text>
            )}
          </View>

          <CloseButton onClose={() => navigation.navigate("Home" as never)} />
        </View>

        {/* Filled details */}
        {!!details.length && (
          <View className={stylesheet.contentWrapper}>
            {details.map((dtl, index) => {
              return (
                <View key={dtl.title} className={stylesheet.smallInfoBlock}>
                  <View className={stylesheet.smallInfoContainer}>
                    {dtl.icon && (
                      <View
                        style={{ backgroundColor: episodePinColors(index) }}
                        className={stylesheet.smInfoImgContainer}
                      >
                        <Image className="w-4 h-4" source={dtl.icon} />
                      </View>
                    )}
                    <View className={stylesheet.smallInfoImgContainer}>
                      <Text className={stylesheet.smallInfoTitle}>
                        {dtl.title}
                      </Text>

                      {!!dtl.desc && (
                        <Text className={stylesheet.smallInfoDesc}>
                          {dtl.desc}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Empty details */}
        {nullDetails.length > 0 && (
          <Text className="font-semibold pl-2 font-black my- dark:text-d-text-gray">
            Campos não preenchidos
          </Text>
        )}
        <View className={stylesheet.contentWrapper}>
          {nullDetails.map((dtl, index) => (
            <View key={dtl.title} className={stylesheet.smallInfoBlock}>
              <View className={stylesheet.smallInfoContainer}>
                {dtl.icon && (
                  <View
                    style={{ backgroundColor: episodePinColors(index) }}
                    className={stylesheet.smInfoImgContainer}
                  >
                    <Image className="w-4 h-4" source={dtl.icon} />
                  </View>
                )}
                <View className={stylesheet.smallInfoImgContainer}>
                  <Text className={stylesheet.smallInfoTitle}>{dtl.title}</Text>

                  <Text className={stylesheet.smallInfoDesc}>
                    Informação não preenchida
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View>
          <ExPressable
            title="Deletar Episódio"
            className="bg-error"
            onPress={() => {
              setOpenConfirmationModal(true);
            }}
          />
        </View>
      </View>
      {!!openConfirmationModal && (
        <CalendarEpisodeListModal
          isOpen={openConfirmationModal}
          onClose={() => {
            setOpenConfirmationModal(false);
          }}
          desc={`Você está prestes a deletar o episódio do dia ${format(
            episode!.dateTime,
            "PPP",
            { locale: ptBR },
          )}.`}
          submitAction={() => {
            setOpenConfirmationModal(false);
            if (episode.id) handleDelete(episode.id);
          }}
        />
      )}
    </AppPageScaffold>
  );
};

export default EpisodeDetailsPage;
