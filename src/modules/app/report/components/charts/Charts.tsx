import { useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import {
  Acuteness,
  Episode,
  Location,
  PainType,
  Report,
  Symptom,
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

const stylesheet = {
  footer: 'w-full h-[50px] ',
  footerBtn: 'bg-[#F8ECDE] dark:bg-d-blue-primary w-ful h-full rounded-full p-2 my-2',
  footerBtnInner:
    'bg-white dark:bg-d-blue-primary-dark w-ful h-full rounded-full p-1 flex-row items-center justify-center',
};

const colorList = [
  '#C8F7E1', // Soft mint green
  '#FFCBA6', // Soft peach
  '#FFCACD', // Soft pink
  '#9193E8', // Soft purple
  '#F1E3FF', // Soft lavender
  '#F1F1F1', // Light gray
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
      dataList.push({ value: count, name: pt, color: colorList[index] });
      count = 0;
    });
    return dataList;
  }, [episodes]);

  const location = useMemo(() => {
    const locationList: Array<{
      value: number;
      label: Location;
      frontColor: string;
    }> = [];
    [
      Location.FRONTALRIGHT,
      Location.FRONTALLEFT,
      Location.FRONTALBILATERAL,
      Location.PARIETALRIGHT,
      Location.PARIETALLEFT,
      Location.PARIETALBILATERAL,
      Location.TEMPLERIGHT,
      Location.TEMPLELEFT,
      Location.TEMPLEBILATERAL,
      Location.BACKSIDE,
    ].forEach((location) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (ep.location == location) {
          count++;
        }
      });
      locationList.push({
        value: count,
        label: location,
        frontColor: colorList[locationList.length % colorList.length],
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
          if (ep.symptoms.includes(symptom)) count++;
        } else if (ep.symptoms === symptom) {
          count++;
        }
      });
      symptomsList.push({
        value: count,
        label: symptom,
        frontColor: colorList[symptomsList.length % colorList.length],
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
    [Trigger.FOOD, Trigger.JAGGEDSLEEP, Trigger.EMOTIONAL].forEach(
      (trigger) => {
        let count = 0;
        episodes.map((ep: Episode) => {
          if (trigger?.includes(',')) {
            Array.from(trigger.split(',')).map((t) => {
              if (t == trigger) {
                count++;
              }
            });
          } else if (ep.triggers == trigger) {
            count++;
          }
        });
        triggersList.push({
          value: count,
          label: trigger,
          frontColor: colorList[triggersList.length % colorList.length],
        });
        count = 0;
      }
    );
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
    () => episodes.map((ep: Episode) => ep.foodImprovement).filter((e) => !!e),
    [episodes]
  );

  const foodImpair = useMemo(
    () => episodes.map((ep: Episode) => ep.foodImpair).filter((e) => !!e),
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
            <Text className='dark:text-d-text-gray'>Enviar relatório para o médico </Text>
            <Image
              className='ml-4'
              source={require('src/assets/send.png')}
            ></Image>
          </Pressable>
        </Pressable>
      </View>

      {!!report && <SummedUpReport report={report} />}

      <BarChartComponent
        key="location-bar"
        title='Localização da dor'
        dataset={location}
        maxValue={locationMaxValue}
      />

      <BarChartComponent
        key="symptoms-bar"
        title='Sintomas associados à dor'
        dataset={symptoms}
        maxValue={symptomsMaxValue}
      />

      <BarChartComponent
        key="triggers-bar"
        title='Fatores desencadeantes da dor'
        dataset={triggers}
        maxValue={triggersMaxValue}
      />

      <PieChartComponent assets={acuteness} title='Intensidade da dor' key="acuteness-pie" />
      <PieChartComponent assets={painType} title='Característica da dor' key="painType-pie" />

      {foodImprovement.length > 0 && (
        <ReportCard
          key="food-improvement"
          title='Alimentos que ajudaram a melhorar'
          description={foodImprovement}
        />
      )}

      {foodImpair.length > 0 && (
        <ReportCard
          key="food-impair"
          title='Alimentos que foram gatilhos para a dor'
          description={foodImpair}
        />
      )}

      <ReportCard
        key="notes"
        title='Observações'
        description={
          Array.isArray(report.notes)
            ? (report.notes.filter((n): n is string => typeof n === 'string').length > 0
                ? report.notes.filter((n): n is string => typeof n === 'string')
                : null)
            : typeof report.notes === 'string' && report.notes.includes(',')
              ? (report.notes.split(',').filter((n): n is string => typeof n === 'string').length > 0
                  ? report.notes.split(',').filter((n): n is string => typeof n === 'string')
                  : null)
              : report.notes
        }
      />

      {report.periodNotes && (
        <ReportCard
          key="period-notes"
          title='Período menstrual'
          description={
            report.periodNotes.includes(',')
              ? report.periodNotes.split(',')
              : report.periodNotes
          }
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
