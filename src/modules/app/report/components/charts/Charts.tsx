import { format } from "date-fns";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import {
  Acuteness,
  Episode,
  HaloSymptom,
  ImpairFactor,
  ImprovementFactor,
  Location,
  PainType,
  Report,
  Symptom,
  Time,
  Trigger,
} from "src/infra/@types/app.types";
import { useSelector } from "react-redux";
import { useAsyncAppDispatch } from "src/infra/app/store";
import { handleFetchReportEpisodesRange } from "src/infra/app/reducers/app.reducer";
import { appStateSelector } from "src/infra/app/selectors";

import AppPageScaffold from "src/modules/app/shared/components/appPageScaffold/AppPageScaffold";
import PhysicianEmailModal from "src/modules/shared/components/physicianEmailModal/PhysicianEmailModal";
import PieChartComponent from "./components/PieChartComponent";
import { BarChartComponent } from "./components/BarChartComponent";
import { ReportCard } from "./components/ReportCard";
import {
  episodePinColors,
  parseImpairFactor,
  parsePainType,
} from "src/infra/utils/appUtils";

const stylesheet = {
  footer: "w-full ",
  footerBtn:
    "bg-[#F8ECDE] dark:bg-d-blue-primary w-full h-[70px] rounded-full p-2 my-2",
  footerBtnInner:
    "bg-white dark:bg-d-blue-primary-dark w-ful h-full rounded-full p-1 flex-row items-center justify-center",
};

const colorList = [
  "#C8F7E166",
  "#FFCBA666",
  "#FFA6A666",
  "#FFB0B566",
  "#9193E866",
  "#FFDAF266",
];

const normalizeText = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
};

const toUniqueList = (value: unknown): string[] => {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[\n,;]+/)
      : [];

  const uniqueMap = new Map<string, string>();
  raw.forEach((item) => {
    const normalized = normalizeText(item);
    if (!normalized) return;
    const key = normalized.toLocaleLowerCase();
    if (!uniqueMap.has(key)) uniqueMap.set(key, normalized);
  });

  return Array.from(uniqueMap.values());
};

const includesOption = (value: unknown, option: string): boolean => {
  const normalizedOption = normalizeText(option).toLocaleLowerCase();
  return toUniqueList(value).some(
    (entry) => entry.toLocaleLowerCase() === normalizedOption,
  );
};

const uniqueFromEpisodes = (
  episodes: Episode[],
  selector: (episode: Episode) => unknown,
): string[] => {
  const uniqueMap = new Map<string, string>();
  episodes.forEach((episode) => {
    toUniqueList(selector(episode)).forEach((item) => {
      const key = item.toLocaleLowerCase();
      if (!uniqueMap.has(key)) uniqueMap.set(key, item);
    });
  });
  return Array.from(uniqueMap.values());
};

const ChartsPage = () => {
  const route = useRoute();
  const asyncDispatch = useAsyncAppDispatch();
  const appState = useSelector(appStateSelector);
  // Type assertion for route.params
  const params = route.params as { reportDetails: Report };
  const [report, _] = useState<Report>(params.reportDetails);
  // episodes will come from redux state (reports is used for both reports and episodes)
  const episodes = appState.reportEpisodes || [];
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  useEffect(() => {
    if (report.episodesIds) {
      asyncDispatch(handleFetchReportEpisodesRange(report.episodesIds));
    }
  }, [report.episodesIds]);

  const acuteness = useMemo(() => {
    const dataList: Array<{ value: number; name: string; color: string }> = [];
    [Acuteness.LIGHT, Acuteness.MILD, Acuteness.SEVERE].forEach(
      (act, index) => {
        let count = 0;
        episodes.map((ep: Episode) => {
          if (ep.acuteness == act) {
            count++;
          }
        });
        dataList.push({ value: count, name: act, color: colorList[index] });
        count = 0;
      },
    );
    return dataList;
  }, [episodes]);

  const painType = useMemo(() => {
    const dataList: Array<{ value: number; name: string; color: string }> = [];
    [PainType.THROB, PainType.TIGHT].forEach((pt, index) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (ep.painType == pt) {
          count++;
        }
      });
      dataList.push({ value: count, name: pt, color: episodePinColors(index) });
      count = 0;
    });
    return dataList;
  }, [episodes]);

  const time = useMemo(() => {
    const dataList: Array<{ value: number; name: string; color: string }> = [];
    [Time.MORNING, Time.EVENING, Time.NIGHT, Time.MIDNIGHT].forEach(
      (pt, index) => {
        let count = 0;
        episodes.map((ep: Episode) => {
          if (ep.time == pt) {
            count++;
          }
        });
        dataList.push({
          value: count,
          name: pt,
          color: episodePinColors(index),
        });
        count = 0;
      },
    );
    return dataList;
  }, [episodes]);

  const location = useMemo(() => {
    const locationList: Array<{
      value: number;
      label: Location;
      frontColor: string;
    }> = [];
    Object.values(Location).forEach((location) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (includesOption(ep.location, location)) {
          count++;
        }
      });
      locationList.push({
        value: count,
        label: location,
        frontColor: episodePinColors(locationList.length % colorList.length),
      });
      count = 0;
    });
    return locationList;
  }, [episodes]);

  const symptoms = useMemo(() => {
    const symptomsList: Array<{
      value: number;
      label: Symptom;
      frontColor: string;
    }> = [];
    Object.values(Symptom).forEach((symptom) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (includesOption(ep.symptoms, symptom)) {
          count++;
        }
      });
      symptomsList.push({
        value: count,
        label: symptom,
        frontColor: episodePinColors(symptomsList.length % colorList.length),
      });
      count = 0;
    });
    return symptomsList;
  }, [episodes]);

  const triggers = useMemo(() => {
    const triggersList: Array<{
      value: number;
      label: Trigger;
      frontColor: string;
    }> = [];
    Object.values(Trigger).forEach((trigger) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (includesOption(ep.triggers, trigger)) {
          count++;
        }
      });
      triggersList.push({
        value: count,
        label: trigger,
        frontColor: episodePinColors(triggersList.length % colorList.length),
      });
      count = 0;
    });
    return triggersList;
  }, [episodes]);

  const halo = useMemo(() => {
    const haloList: Array<{
      value: number;
      label: HaloSymptom;
      frontColor: string;
    }> = [];
    Object.values(HaloSymptom).forEach((hal) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (includesOption(ep.haloSymptoms, hal)) {
          count++;
        }
      });
      haloList.push({
        value: count,
        label: hal,
        frontColor: episodePinColors(haloList.length % colorList.length),
      });
      count = 0;
    });
    return haloList;
  }, [episodes]);

  const locationMaxValue = useMemo(() => {
    let greater = 0;

    location.map((loc) => {
      if (loc.value > greater) {
        greater = loc.value;
      }
    });
    return greater;
  }, [location]);

  const symptomsMaxValue = useMemo(() => {
    let greater = 0;

    symptoms.map((loc) => {
      if (loc.value > greater) {
        greater = loc.value;
      }
    });
    return greater;
  }, [symptoms]);

  const triggersMaxValue = useMemo(() => {
    let greater = 0;

    triggers.map((loc) => {
      if (loc.value > greater) {
        greater = loc.value;
      }
    });
    return greater;
  }, [triggers]);

  const impairFactorData = useMemo(() => {
    const dataList: Array<{
      value: number;
      label: ImpairFactor;
      frontColor: string;
    }> = [];
    [ImpairFactor.JUMP, ImpairFactor.CROUCH, ImpairFactor.ANOTHER].forEach(
      (factor, index) => {
        let count = 0;
        episodes.forEach((ep: Episode) => {
          if (includesOption(ep.impairFactor, factor)) {
            count++;
          }
        });
        dataList.push({
          value: count,
          label: factor,
          frontColor: episodePinColors(index),
        });
        count = 0;
      },
    );
    return dataList;
  }, [episodes]);

  const impairFactorMaxValue = useMemo(() => {
    let greater = 0;
    impairFactorData.forEach((d) => {
      if (d.value > greater) greater = d.value;
    });
    return greater;
  }, [impairFactorData]);

  const haloMaxValue = useMemo(() => {
    let greater = 0;
    halo.forEach((h) => {
      if (h.value > greater) greater = h.value;
    });
    return greater;
  }, [halo]);

  const foodImprovement = useMemo(
    () =>
      uniqueFromEpisodes(episodes, (ep: Episode) =>
        includesOption(ep.improvementFactor, ImprovementFactor.FOOD)
          ? ep.foodImprovement
          : null,
      ),
    [episodes],
  );

  const anotherImprovementFactor = useMemo(
    () =>
      uniqueFromEpisodes(episodes, (ep: Episode) =>
        includesOption(ep.improvementFactor, ImprovementFactor.ANOTHER)
          ? ep.anotherImprovementFactor
          : null,
      ),
    [episodes],
  );

  const foodImpair = useMemo(
    () =>
      uniqueFromEpisodes(episodes, (ep: Episode) =>
        includesOption(ep.triggers, Trigger.FOOD) ? ep.foodImpair : null,
      ),
    [episodes],
  );

  const anotherPainType = useMemo(
    () =>
      uniqueFromEpisodes(episodes, (ep: Episode) =>
        includesOption(ep.painType, PainType.ANOTHER)
          ? ep.anotherPainType
          : null,
      ),
    [episodes],
  );

  const anotherImpairFactor = useMemo(
    () =>
      uniqueFromEpisodes(episodes, (ep: Episode) =>
        includesOption(ep.impairFactor, ImpairFactor.ANOTHER)
          ? ep.anotherImpairFactor
          : null,
      ),
    [episodes],
  );

  const anotherTrigger = useMemo(
    () =>
      uniqueFromEpisodes(episodes, (ep: Episode) =>
        includesOption(ep.triggers, Trigger.ANOTHER) ? ep.anotherTrigger : null,
      ),
    [episodes],
  );

  const medicineList = useMemo(
    () =>
      uniqueFromEpisodes(episodes, (ep: Episode) => {
        if (!includesOption(ep.improvementFactor, ImprovementFactor.MEDICINE)) {
          return null;
        }

        if (!ep.medicine) {
          return null;
        }

        return `${ep.medicine} - ${
          !!ep.combinedDosage ? ep.combinedDosage + "/" : ""
        }${ep.medicineDosage}${!!ep.medicineUnit ? ep.medicineUnit : ""} - ${ep.medicineImprovement}`;
      }),
    [episodes],
  );

  const episodeDatesList = useMemo(
    () =>
      episodes
        .map((ep: Episode) => {
          const raw = ep.dateTime || ep.start;
          if (!raw) return null;
          try {
            return format(new Date(raw), "dd/MM/yyyy");
          } catch {
            return null;
          }
        })
        .filter((d): d is string => !!d)
        .filter((d, i, arr) => arr.indexOf(d) === i),
    [episodes],
  );

  const avgDuration = useMemo(() => {
    const timeToMinutes = (t: string): number | null => {
      const parts = t.split(":").map(Number);
      if (parts.length < 2 || parts.some(isNaN)) return null;
      return parts[0] * 60 + parts[1];
    };

    const durations = episodes
      .filter((ep: Episode) => !!ep.start && !!ep.end)
      .map((ep: Episode) => {
        const startMin = timeToMinutes(ep.start!);
        const endMin = timeToMinutes(ep.end!);
        if (startMin === null || endMin === null) return null;

        const diff =
          endMin >= startMin ? endMin - startMin : 1440 - startMin + endMin;
        return diff;
      })
      .filter((d): d is number => d !== null && d > 0);

    if (!durations.length) return null;

    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const hours = Math.floor(avg / 60);
    const minutes = Math.round(avg % 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  }, [episodes]);

  const improvementFactorData = useMemo(() => {
    const dataList: Array<{
      value: number;
      label: ImprovementFactor;
      frontColor: string;
    }> = [];
    [
      ImprovementFactor.MEDICINE,
      ImprovementFactor.SLEEP,
      ImprovementFactor.FOOD,
      ImprovementFactor.ANOTHER,
    ].forEach((factor, index) => {
      let count = 0;
      episodes.forEach((ep: Episode) => {
        if (includesOption(ep.improvementFactor, factor)) {
          count++;
        }
      });
      dataList.push({
        value: count,
        label: factor,
        frontColor: episodePinColors(index),
      });
      count = 0;
    });
    return dataList;
  }, [episodes]);

  const improvementFactorMaxValue = useMemo(() => {
    let greater = 0;
    improvementFactorData.forEach((d) => {
      if (d.value > greater) greater = d.value;
    });
    return greater;
  }, [improvementFactorData]);

  return (
    <AppPageScaffold>
      <View className={stylesheet.footer}>
        <Pressable className={stylesheet.footerBtn}>
          <Pressable
            className={stylesheet.footerBtnInner}
            onPress={() => {
              setEmailModalOpen(true);
            }}
          >
            <Text className="dark:text-d-text-gray">
              Enviar relatório para o médico{" "}
            </Text>
            <Image
              className="ml-1 h-[24px]"
              resizeMode="contain"
              source={require("src/assets/send.png")}
            ></Image>
          </Pressable>
        </Pressable>
      </View>

      {/* 1 - Data */}
      <ReportCard
        key="dates"
        title={`${format(new Date(report.startDate), "dd/MM/yyyy")} – ${format(new Date(report.endDate), "dd/MM/yyyy")} - ${report.episodeAmount} episódios`}
        description={
          episodeDatesList.length ? episodeDatesList : ["Sem datas registradas"]
        }
      />

      {/* 2 - Horário da crise */}
      <PieChartComponent assets={time} title="Horário da crise" key="time" />

      {/* 3 - Média de duração da crise */}
      {!!avgDuration && (
        <ReportCard
          key="avg-duration"
          title="Média de duração da crise"
          description={[avgDuration]}
        />
      )}

      {/* 4 - Localização da dor */}
      <BarChartComponent
        key="location-bar"
        title="Localização da dor"
        dataset={location}
        maxValue={locationMaxValue}
      />

      {/* 5 - Intensidade da dor */}
      <PieChartComponent
        assets={acuteness}
        title="Intensidade da dor"
        key="acuteness-pie"
      />

      {/* 6 - Característica da dor */}
      <PieChartComponent
        assets={painType}
        title="Característica da dor"
        key="painType-pie"
        outros={[{ label: "Outros", items: anotherPainType }]}
      />

      {/* 7 - Sintomas associados */}
      <BarChartComponent
        key="symptoms-bar"
        title="Sintomas associados à dor"
        dataset={symptoms}
        maxValue={symptomsMaxValue}
      />

      {/* 8 - Sintomas da aura */}
      <BarChartComponent
        key="halo-bar"
        title="Sintomas da aura"
        dataset={halo}
        maxValue={haloMaxValue}
      />

      {/* 9 - Fatores de piora */}
      <BarChartComponent
        key="impairFactor-bar"
        title="Fatores de piora"
        dataset={impairFactorData}
        maxValue={impairFactorMaxValue}
        outros={[{ label: "Outros", items: anotherImpairFactor }]}
      />

      {/* 10 - Fatores desencadeantes */}
      <BarChartComponent
        key="triggers-bar"
        title="Fatores desencadeantes da dor"
        dataset={triggers}
        maxValue={triggersMaxValue}
        outros={[
          { label: "Alimentação", items: foodImpair },
          { label: "Outros", items: anotherTrigger },
        ]}
      />

      {/* 11 - Fatores de melhora */}
      <BarChartComponent
        key="improvementFactor-bar"
        title="Fatores de melhora"
        dataset={improvementFactorData}
        maxValue={improvementFactorMaxValue}
        outros={[
          ...(medicineList.length
            ? [{ label: "Medicamentos", items: medicineList }]
            : []),
          ...(foodImprovement.length
            ? [{ label: "Alimentação", items: foodImprovement }]
            : []),
          ...(anotherImprovementFactor.length
            ? [{ label: "Outros", items: anotherImprovementFactor }]
            : []),
        ]}
      />

      {/* 12 - Período menstrual */}
      {(() => {
        const simCount = episodes.filter(
          (ep: Episode) => ep.period === "true" || ep.period === true,
        ).length;
        const naoCount = episodes.filter(
          (ep: Episode) => ep.period === "false" || ep.period === false,
        ).length;
        const naCount = episodes.filter(
          (ep: Episode) =>
            ep.period === "N/A" ||
            ep.period === null ||
            ep.period === undefined,
        ).length;
        const periodNotesList = uniqueFromEpisodes(
          episodes,
          (ep: Episode) => ep.periodNotes,
        );

        const lines: string[] = [];
        if (simCount > 0) lines.push(`Sim: ${simCount} episódio(s)`);
        if (naoCount > 0) lines.push(`Não: ${naoCount} episódio(s)`);
        if (naCount > 0) lines.push(`Não se aplica: ${naCount} episódio(s)`);
        periodNotesList.forEach((n) => lines.push(`Obs: ${n}`));

        return (
          <ReportCard
            key="period-notes"
            title="Período menstrual"
            description={lines.length ? lines : ["Sem informação registrada"]}
          />
        );
      })()}

      {/* 13 - Observações finais */}
      {!!report.notes && (
        <ReportCard
          key="notes"
          title="Observações finais"
          description={toUniqueList(report.notes)}
        />
      )}

      <PhysicianEmailModal
        isOpen={emailModalOpen}
        report={report}
        onClose={() => {
          setEmailModalOpen(false);
        }}
      />
    </AppPageScaffold>
  );
};

export default ChartsPage;
