import { useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import {
  Acuteness,
  Episode,
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
          if (ep.location.includes(location)) {
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
        if (!!ep.symptoms)
          if (ep.symptoms.includes(symptom)) {
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
          if (ep.triggers.includes(trigger)) {
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

  const foodImprovement = useMemo(
    () =>
      episodes
        .map(
          (ep: Episode) =>
            !!ep.improvementFactor.includes(ImprovementFactor.FOOD) &&
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
            !!ep.improvementFactor.includes(ImprovementFactor.ANOTHER) &&
            ep.anotherImprovementFactor
        )
        .filter((e) => !!e),
    [episodes]
  );

  const foodImpair = useMemo(
    () => episodes.map((ep: Episode) => ep.foodImpair).filter((e) => !!e),
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
        .map(
          (ep: Episode) =>
            !!ep.triggers?.includes(Trigger.ANOTHER) && ep.anotherImpairFactor
        )
        .filter((e) => !!e),
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

      <BarChartComponent
        key='location-bar'
        title='Localização da dor'
        dataset={location}
        maxValue={locationMaxValue}
      />

      <BarChartComponent
        key='symptoms-bar'
        title='Sintomas associados à dor'
        dataset={symptoms}
        maxValue={symptomsMaxValue}
      />

      <BarChartComponent
        key='triggers-bar'
        title='Fatores desencadeantes da dor'
        dataset={triggers}
        maxValue={triggersMaxValue}
      />

      <PieChartComponent
        assets={acuteness}
        title='Intensidade da dor'
        key='acuteness-pie'
      />
      <PieChartComponent
        assets={painType}
        title='Característica da dor'
        key='painType-pie'
      />

      <PieChartComponent assets={time} title='Horário da crise' key='time' />

      {!!foodImpair.length && (
        <ReportCard
          key='food-impair'
          title='Alimentos que foram gatilhos para a crise'
          description={foodImpair}
        />
      )}

      {!!anotherImpairFactor!.length && (
        <ReportCard
          key='another-impair'
          title='Outros tipos de gatilhos para a crise'
          description={anotherImpairFactor}
        />
      )}

      {!!report.notes && (
        <ReportCard
          key='notes'
          title='Observações'
          description={normalizeNotes(report.notes)}
        />
      )}

      {parseImprovementFactor(report.improvementFactor) ==
        ImprovementFactor.MEDICINE && (
          <ReportCard
            key='medicine'
            title='Medicamentos'
            description={episodes
              .filter((ep) => ep.medicine != null)
              .map(
                (rpt) =>
                  `${rpt.medicine} - ${!!rpt.combinedDosage ? rpt.combinedDosage + '/' : ''}${rpt.medicineDosage}${!!rpt.medicineUnit ? rpt.medicineUnit + '' : ''} ` || ''
              )}
          />
        )}

      {!!foodImprovement.length && (
        <ReportCard
          key='foodImprovement'
          title='Alimentos que melhoraram a crise'
          description={episodes
            .filter((ep) => ep.foodImprovement != null)
            .map((rpt) => `${rpt.foodImprovement}`)}
        />
      )}

      {!!anotherImprovementFactor.length && (
        <ReportCard
          key='anotherImprovement'
          title='Alternativas que melhoraram a crise'
          description={episodes
            .filter((ep) => ep.anotherImprovementFactor != null)
            .map((rpt) => `${rpt.anotherImprovementFactor}`)}
        />
      )}

      {parseImpairFactor(report.impairFactor) == ImpairFactor.ANOTHER && (
        <ReportCard
          key='impairFactor'
          title='Fatores de melhora'
          description={episodes
            .filter((ep) => ep.impairFactor != null)
            .map((rpt) => `${rpt.anotherImpairFactor}`)}
        />
      )}


      {!!report.periodNotes && (
        <ReportCard
          key='period-notes'
          title='Período menstrual'
          description={report.periodNotes}
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
