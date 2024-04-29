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
import { AppActions } from 'src/infra/app/actions';
import { useApp } from 'src/infra/app/app';

import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
import PhysicianEmailModal from 'src/modules/shared/components/physicianEmailModal/PhysicianEmailModal';
import PieChartComponent from './components/PieChartComponent';
import { BarChartComponent } from './components/BarChartComponent';
import { SummedUpReport } from './components/SummedUpRepost';
import { ReportCard } from './components/ReportCard';

const stylesheet = {
  footer: 'w-full h-[50px] ',
  footerBtn: 'bg-[#F8ECDE] w-ful h-full rounded-full p-2 my-2',
  footerBtnInner:
    'bg-white w-ful h-full rounded-full p-1 flex-row items-center justify-center',
};

const colorList = [
  '#C8F7E1',
  '#FFCBA6',
  '#FFCACD',
  '#9194E9',
  '#EFE6FD',
  '#FFDCF1',
];

const ChartsPage = () => {
  const route = useRoute();
  const { dispatch } = useApp();
  const [report, _] = useState<Report>(route.params['reportDetails']);
  const [episodes, setEpisodes] = useState([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      AppActions.REQUEST_FETCH_REPORTS_EPISODES_RANGE,
      report.episodesIds
    ).then((res) => {
      setEpisodes(res);
    });
  }, [this]);

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
        frontColor: '#177AD5',
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
    [
      Symptom.HALO,
      Symptom.PHOTOSENSIBILITY,
      Symptom.HYPERACUSIS,
      Symptom.NAUSEA,
      Symptom.SICKNESS,
      Symptom.VOMIT,
    ].forEach((symptom) => {
      let count = 0;
      episodes.map((ep: Episode) => {
        if (symptom?.includes(',')) {
          Array.from(symptom.split(',')).map((s) => {
            if (s == symptom) {
              count++;
            }
          });
        } else if (ep.symptoms == symptom) {
          count++;
        }
      });
      symptomsList.push({
        value: count,
        label: symptom,
        frontColor: '#177AD5',
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
          frontColor: '#177AD5',
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
  console.log(foodImpair);
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
            <Text>Enviar relatório para o médico </Text>
            <Image className='ml-4' source={require('assets/send.png')}></Image>
          </Pressable>
        </Pressable>
      </View>

      {!!report && <SummedUpReport report={report} />}

      <BarChartComponent
        title='Localização da dor'
        dataset={location}
        maxValue={locationMaxValue}
      />

      <BarChartComponent
        title='Sintomas associados à dor'
        dataset={symptoms}
        maxValue={symptomsMaxValue}
      />

      <BarChartComponent
        title='Fatores desencadeantes da dor'
        dataset={triggers}
        maxValue={triggersMaxValue}
      />

      <PieChartComponent assets={acuteness} title='Intensidade da dor' />
      <PieChartComponent assets={painType} title='Característica da dor' />

      {foodImprovement.length > 0 && (
        <ReportCard
          title='Alimentos que ajudaram a melhorar'
          description={foodImprovement}
        />
      )}

      {foodImpair.length > 0 && (
        <ReportCard
          title='Alimentos que foram gatilhos para a dor'
          description={foodImpair}
        />
      )}

      {report.notes && (
        <ReportCard
          title='Observações'
          description={
            report.notes.includes(',') ? report.notes.split(',') : report.notes
          }
        />
      )}

      {report.periodNotes && (
        <ReportCard
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
