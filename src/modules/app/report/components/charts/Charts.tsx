import { useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
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
} from 'src/infra/@types/app.types';
import { useSelector } from 'react-redux';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { handleFetchReportEpisodesRange } from 'src/infra/app/reducers/app.reducer';
import { appStateSelector } from 'src/infra/app/selectors';

import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
import PhysicianEmailModal from 'src/modules/shared/components/physicianEmailModal/PhysicianEmailModal';
import PieChartComponent from './components/PieChartComponent';
import { BarChartComponent } from './components/BarChartComponent';
import { SummedUpReport } from './components/SummedUpRepost';
import { ReportCard } from './components/ReportCard';
import {
  episodePinColors,
  parseImpairFactor,
  parseImprovementFactor,
  parsePainType,
} from 'src/infra/utils/appUtils';

const stylesheet = {
  footer: 'w-full ',
  footerBtn:
    'bg-[#F8ECDE] dark:bg-d-blue-primary w-full h-[70px] rounded-full p-2 my-2',
  footerBtnInner:
    'bg-white dark:bg-d-blue-primary-dark w-ful h-full rounded-full p-1 flex-row items-center justify-center',
};

const colorList = [
  '#C8F7E166',
  '#FFCBA666',
  '#FFA6A666',
  '#FFB0B566',
  '#9193E866',
  '#FFDAF266',
];

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
      }
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
      }
    );
    return dataList;
  }, [episodes]);

  const duration = useMemo(() => {
    const durationList: Array<{
      value: number;
      label: string;
      frontColor: string;
    }> = [
        { label: 'Até 1h', value: 0, frontColor: episodePinColors(0) },
        { label: '1 a 2h', value: 0, frontColor: episodePinColors(1) },
        { label: '2 a 4h', value: 0, frontColor: episodePinColors(2) },
        { label: 'Mais de 4h', value: 0, frontColor: episodePinColors(3) },
      ];

    episodes.forEach((ep: Episode) => {
      if (!ep.start || !ep.end) return;

      const [sh, sm] = ep.start.split(':').map(Number);
      const [eh, em] = ep.end.split(':').map(Number);
      if (
        [sh, sm, eh, em].some(
          (n) => Number.isNaN(n) || n == null || typeof n !== 'number'
        )
      ) {
        return;
      }

      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;
      const diff = endMinutes - startMinutes;
      if (diff <= 0) return;

      if (diff <= 60) {
        durationList[0].value += 1;
      } else if (diff <= 120) {
        durationList[1].value += 1;
      } else if (diff <= 240) {
        durationList[2].value += 1;
      } else {
        durationList[3].value += 1;
      }
    });

    return durationList;
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
        if (!!ep.location)
          if (ep.location?.includes(location)) {
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
        if (Array.isArray(ep.symptoms)) {
          if (!!ep.symptoms?.includes(symptom)) count++;
        } else if (ep.symptoms === symptom) {
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

  function normalizeNotes(notes: unknown): string[] | null {
    if (Array.isArray(notes)) {
      const filtered = notes.filter((n): n is string => typeof n === 'string');
      return filtered.length > 0 ? filtered : null;
    }

    if (typeof notes === 'string') {
      const parts = notes
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);
      return parts.length > 0 ? parts : null;
    }

    return null;
  }

  const uniqueStrings = (
    list: Array<string | null | undefined | false> | null | undefined
  ): string[] => {
    if (!list) return [];
    return Array.from(
      new Set(
        list.filter(
          (item): item is string =>
            typeof item === 'string' && item.trim().length > 0
        )
      )
    );
  };

  const triggers = useMemo(() => {
    const triggersList: Array<{
      value: number;
      label: Trigger;
      frontColor: string;
    }> = [];
    Object.values(Trigger).forEach((trigger) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (!!ep.triggers)
          if (ep.triggers?.includes(trigger)) {
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

  const haloSymptoms = useMemo(() => {
    const haloList: Array<{
      value: number;
      label: HaloSymptom;
      frontColor: string;
    }> = [];

    Object.values(HaloSymptom).forEach((haloSymptom) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (Array.isArray(ep.haloSymptoms)) {
          if (ep.haloSymptoms?.includes(haloSymptom)) count++;
        } else if (typeof ep.haloSymptoms === 'string') {
          if (ep.haloSymptoms.split(',')?.includes(haloSymptom)) count++;
        }
      });

      haloList.push({
        value: count,
        label: haloSymptom,
        frontColor: episodePinColors(haloList.length % colorList.length),
      });
      count = 0;
    });

    return haloList;
  }, [episodes]);

  const impairFactors = useMemo(() => {
    const impairList: Array<{
      value: number;
      label: ImpairFactor;
      frontColor: string;
    }> = [];

    Object.values(ImpairFactor).forEach((factor) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (Array.isArray(ep.impairFactor)) {
          if (ep.impairFactor?.includes(factor)) count++;
        } else if (ep.impairFactor === factor) {
          count++;
        }
      });

      impairList.push({
        value: count,
        label: factor,
        frontColor: episodePinColors(impairList.length % colorList.length),
      });
      count = 0;
    });

    return impairList;
  }, [episodes]);

  const improvementFactors = useMemo(() => {
    const improvementList: Array<{
      value: number;
      label: ImprovementFactor;
      frontColor: string;
    }> = [];

    Object.values(ImprovementFactor).forEach((factor) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (Array.isArray(ep.improvementFactor)) {
          if (ep.improvementFactor?.includes(factor)) count++;
        } else if (ep.improvementFactor === factor) {
          count++;
        }
      });

      improvementList.push({
        value: count,
        label: factor,
        frontColor: episodePinColors(
          improvementList.length % colorList.length
        ),
      });
      count = 0;
    });

    return improvementList;
  }, [episodes]);

  const period = useMemo(() => {
    const dataList: Array<{ value: number; name: string; color: string }> = [];

    let yesCount = 0;
    let noCount = 0;

    episodes.forEach((ep: Episode) => {
      if (ep.period === 'true' || ep.period === 1) {
        yesCount++;
      } else if (ep.period === 'false' || ep.period === 0) {
        noCount++;
      }
    });

    dataList.push({
      value: yesCount,
      name: 'Sim',
      color: colorList[0],
    });

    dataList.push({
      value: noCount,
      name: 'Não',
      color: colorList[1],
    });

    return dataList;
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

  const durationMaxValue = useMemo(() => {
    let greater = 0;

    duration.map((item) => {
      if (item.value > greater) {
        greater = item.value;
      }
    });

    return greater;
  }, [duration]);

  const triggersMaxValue = useMemo(() => {
    let greater = 0;

    triggers.map((loc) => {
      if (loc.value > greater) {
        greater = loc.value;
      }
    });
    return greater;
  }, [triggers]);

  const haloMaxValue = useMemo(() => {
    let greater = 0;

    haloSymptoms.map((item) => {
      if (item.value > greater) {
        greater = item.value;
      }
    });

    return greater;
  }, [haloSymptoms]);

  const impairMaxValue = useMemo(() => {
    let greater = 0;

    impairFactors.map((item) => {
      if (item.value > greater) {
        greater = item.value;
      }
    });

    return greater;
  }, [impairFactors]);

  const improvementMaxValue = useMemo(() => {
    let greater = 0;

    improvementFactors.map((item) => {
      if (item.value > greater) {
        greater = item.value;
      }
    });

    return greater;
  }, [improvementFactors]);

  const foodImprovement = useMemo(
    () =>
      episodes
        .map(
          (ep: Episode) =>
            !!ep.improvementFactor?.includes(ImprovementFactor.FOOD) &&
            ep.foodImprovement
        )
        .filter((e) => !!e),
    [episodes]
  );

  const anotherImprovementFactor = useMemo(
    () =>
      episodes
        .map(
          (ep: Episode) =>
            !!ep.improvementFactor?.includes(ImprovementFactor.ANOTHER) &&
            ep.anotherImprovementFactor
        )
        .filter((e) => !!e),
    [episodes]
  );

  const foodImpair = useMemo(
    () =>
      episodes
        .map((ep: Episode) => ep.foodImpair)
        .filter((e): e is string => typeof e === 'string' && !!e),
    [episodes]
  );

  const anotherPainType = useMemo(
    () =>
      episodes
        .map(
          (ep: Episode) =>
            !!ep.painType?.includes(PainType.ANOTHER) && ep.anotherPainType
        )
        .filter((e) => !!e),
    [episodes]
  );

  const anotherImpairFactor = useMemo(
    () =>
      episodes
        .map((ep: Episode) =>
          ep.triggers && ep.triggers?.includes(Trigger.ANOTHER)
            ? ep.anotherImpairFactor
            : null
        )
        .filter((e): e is string => typeof e === 'string' && !!e),
    [episodes]
  );

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
            <Text className='dark:text-d-text-gray'>
              Enviar relatório para o médico{' '}
            </Text>
            <Image
              className='ml-1 h-[24px]'
              resizeMode='contain'
              source={require('src/assets/send.png')}
            ></Image>
          </Pressable>
        </Pressable>
      </View>

      {!!report && <SummedUpReport report={report} />}

      {/* 1 - Data e horário */}
      <PieChartComponent assets={time} title='Horário da crise' key='time' />

      {/* 2 - Duração da crise */}
      <BarChartComponent
        key='duration-bar'
        title='Duração da crise'
        dataset={duration}
        maxValue={durationMaxValue}
      />

      {/* 3 - Localização */}
      <BarChartComponent
        key='location-bar'
        title='Localização da dor'
        dataset={location}
        maxValue={locationMaxValue}
      />

      {/* 4 - Intensidade */}
      <PieChartComponent
        assets={acuteness}
        title='Intensidade da dor'
        key='acuteness-pie'
      />

      {/* 5 - Características da dor */}
      <PieChartComponent
        assets={painType}
        title='Característica da dor'
        key='painType-pie'
      />

      {/* 6 - Sintomas associados */}
      <BarChartComponent
        key='symptoms-bar'
        title='Sintomas associados à dor'
        dataset={symptoms}
        maxValue={symptomsMaxValue}
      />

      {/* 7 - Sintomas da aura */}
      <BarChartComponent
        key='haloSymptoms-bar'
        title='Sintomas da aura'
        dataset={haloSymptoms}
        maxValue={haloMaxValue}
      />

      {/* 8 - Fatores de piora */}
      <BarChartComponent
        key='impairFactors-bar'
        title='Fatores de piora'
        dataset={impairFactors}
        maxValue={impairMaxValue}
      />

      {/* 9 - Fatores desencadeantes */}
      <BarChartComponent
        key='triggers-bar'
        title='Fatores desencadeantes da dor'
        dataset={triggers}
        maxValue={triggersMaxValue}
      />


      {
        !!foodImpair.length && (
          <ReportCard
            key='food-impair'
            title='Alimentos que foram gatilhos para a crise'
            description={uniqueStrings(foodImpair)}
          />
        )
      }

      {
        !!anotherImpairFactor!.length && (
          <ReportCard
            key='another-impair'
            title='Outros tipos de gatilhos para a crise'
            description={uniqueStrings(anotherImpairFactor)}
          />
        )
      }

      {
        parseImpairFactor(report.impairFactor) == ImpairFactor.ANOTHER && (
          <ReportCard
            key='impairFactor'
            title='Fatores de melhora'
            description={uniqueStrings(
              episodes
                .filter((ep) => ep.impairFactor != null)
                .map((rpt) => `${rpt.anotherImpairFactor}`)
            )}
          />
        )
      }



      {/* 10 - Fatores de melhora */}
      <BarChartComponent
        key='improvementFactors-bar'
        title='Fatores de melhora'
        dataset={improvementFactors}
        maxValue={improvementMaxValue}
      />

      {
        parseImprovementFactor(report.improvementFactor) ==
        ImprovementFactor.MEDICINE && (
          <ReportCard
            key='medicine'
            title='Medicamentos'
            description={uniqueStrings(
              episodes
                .filter((ep) => ep.medicine != null)
                .map(
                  (rpt) =>
                    `${rpt.medicine} - ${!!rpt.combinedDosage ? rpt.combinedDosage + '/' : ''
                    }${rpt.medicineDosage}${!!rpt.medicineUnit ? rpt.medicineUnit + '' : ''
                    } ` || ''
                )
            )}
          />
        )
      }

      {
        !!foodImprovement.length && (
          <ReportCard
            key='foodImprovement'
            title='Alimentos que melhoraram a crise'
            description={uniqueStrings(
              episodes
                .filter((ep) => ep.foodImprovement != null)
                .map((rpt) => `${rpt.foodImprovement}`)
            )}
          />
        )
      }

      {
        !!anotherImprovementFactor.length && (
          <ReportCard
            key='anotherImprovement'
            title='Alternativas que melhoraram a crise'
            description={uniqueStrings(
              episodes
                .filter((ep) => ep.anotherImprovementFactor != null)
                .map((rpt) => `${rpt.anotherImprovementFactor}`)
            )}
          />
        )
      }

      {/* 11 - Período menstrual */}
      <PieChartComponent
        key='period-pie'
        title='Período menstrual'
        assets={period}
      />

      {
        !!report.periodNotes && (
          <ReportCard
            key='period-notes'
            title='Período menstrual'
            description={report.periodNotes}
          />
        )
      }

      {/* 12 - Observações */}
      {
        !!report.notes && (
          <ReportCard
            key='notes'
            title='Observações'
            description={uniqueStrings(normalizeNotes(report.notes))}
          />
        )
      }

      <PhysicianEmailModal
        isOpen={emailModalOpen}
        report={report}
        onClose={() => {
          setEmailModalOpen(false);
        }}
      />
    </AppPageScaffold >
  );
};

export default ChartsPage;