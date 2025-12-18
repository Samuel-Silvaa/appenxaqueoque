import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { RefObject, createRef, useEffect, useMemo } from 'react';
import FormSteps from './components';

import { sharedEpisodeStyleSheet } from './shared/SharedEpisodeStyleSheet';
import React from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector } from 'src/infra/app/selectors';
import {
  handleStepForward,
  setLoadingState,
  setPageTitle,
} from 'src/infra/app/reducers/app.reducer';
import Datetime from './components/datetime/Datetime';
import EpisodeDuration from './components/episodeDuration/EpisodeDuration';
import Acuteness from './components/acuteness/Acuteness';
import PainType from './components/painType/PainType';
import Symptoms from './components/symptoms/Symptoms';
import ImpairFactor from './components/impairFactor/ImpairFactor';
import ImprovementFactor from './components/improvementFactor/ImprovementFactor';
import Trigger from './components/trigger/Trigger';
import Period from './components/period/Period';
import Notes from './components/notes/Notes';
import HaloSymptoms from './components/haloSymptoms/HaloSymptoms';
import Location from './components/location/Location';
import { useRoute, useFocusEffect } from '@react-navigation/native';

const stylesheet = {
  steps: {
    container: 'flex-row w-full justify-evenly items-center ',
  },
  form: {
    wrapper: 'flex-col w-full ',
    header: {
      wrapper: 'flex-col w-full ',
    },
  },
};

const Steps = () => {
  const pageComponents = useMemo(
    () => [
      FormSteps.Datetime,
      FormSteps.EpisodeDuration,
      FormSteps.Location,
      FormSteps.Acuteness,
      FormSteps.PainType,
      FormSteps.Symptoms,
      FormSteps.HaloSymptom,
      FormSteps.ImpairFactor,
      FormSteps.Trigger,
      FormSteps.ImprovementFactor,
      FormSteps.Period,
      FormSteps.Notes,
    ],
    []
  );
  const appState = useSelector(appStateSelector);

  return (
    <View className={stylesheet.steps.container}>
      {Array(pageComponents.length)
        .fill(0)
        .map((_, index) => {
          return (
            <View
              key={`step-${index}`}
              className={`w-[18px] h-[18px] rounded-full drop-shadow-md ${appState.currentEpStep == index
                ? 'bg-blue-dark-secondary border border-blue-dark-primary '
                : 'bg-white border border-gray-opacity'
                }`}
            ></View>
          );
        })}
    </View>
  );
};

interface HeadListProps {
  item: { id: string; title: string };
  index: number;
}

interface EpisodeScaffold {
  headerStepsFlatListRef: RefObject<FlatList>;
  episodePagesFlatListRef: RefObject<FlatList>;
}

const Topic = ({
  headerStepsFlatListRef,
  episodePagesFlatListRef,
}: EpisodeScaffold) => {
  const appState = useSelector(appStateSelector);
  const dispatch = useDispatch();
  const route = useRoute();


  const DATA: { id: string; title: string }[] = useMemo(
    () =>
      [
        'Data e horário',
        'Duração da crise',
        'Localização',
        'Intensidade',
        'Características da dor',
        'Sintomas associados',
        'Sintomas da aura',
        'Fatores de piora',
        'Fatores desencadeantes',
        'Fatores de melhora',
        'Periodo menstrual',
        'Observações',
      ].map((item, indx) => ({ title: item, id: item + indx })),
    []
  );

  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      if (episodePagesFlatListRef.current) {
        episodePagesFlatListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
        });
      }
      if (headerStepsFlatListRef.current) {
        headerStepsFlatListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
        });
      }
    });
  };

  // Define o título quando o step muda


  useFocusEffect(
    React.useCallback(() => {
      if (route.name == 'Episode') {
        dispatch(setPageTitle(DATA[appState.currentEpStep].title));
        if (episodePagesFlatListRef?.current) {
          episodePagesFlatListRef?.current.scrollToIndex({
            index: appState.currentEpStep,
            animated: true,
          });
        }
        if (headerStepsFlatListRef?.current) {
          headerStepsFlatListRef?.current.scrollToIndex({
            index: appState.currentEpStep,
            animated: true,
          });
        }
      }
    }, [appState.currentEpStep])
  );

  return (
    <View className={sharedEpisodeStyleSheet.topic.container}>
      <FlatList
        ref={headerStepsFlatListRef}
        data={DATA}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        renderItem={({ item, index }: HeadListProps) => (
          <TouchableOpacity
            key={`topic-${item.id}`}
            onPress={() => {
              dispatch(handleStepForward(index));
            }}
            className={
              sharedEpisodeStyleSheet.topic.item +
              `${appState.currentEpStep == index
                ? ' bg-purple-dark-primary '
                : ' bg-purple-dark-secondary'
              }`
            }
          >
            <Text
              key={`topic-text-${item.id}`}
              className={`${appState.currentEpStep == index ? 'text-[#fff]' : 'text-black '
                }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
const pageComponents = [
  Datetime,
  EpisodeDuration,
  Location,
  Acuteness,
  PainType,
  Symptoms,
  HaloSymptoms,
  ImpairFactor,
  Trigger,
  ImprovementFactor,
  Period,
  Notes,
];

const FormContent = ({ episodePagesFlatListRef }: EpisodeScaffold) => {
  const appState = useSelector(appStateSelector);
  const PageComponent = pageComponents[appState.currentEpStep];

  return (
    <View
      style={{
        flex: 1,
        width: Dimensions.get('screen').width - 32,
        paddingTop: 20,
      }}
    >
      <PageComponent />
    </View>
  );
};

const FormHeader = ({
  headerStepsFlatListRef,
  episodePagesFlatListRef,
}: EpisodeScaffold) => {
  return (
    <View className={stylesheet.form.header.wrapper}>
      <Steps />
      <Topic
        headerStepsFlatListRef={headerStepsFlatListRef}
        episodePagesFlatListRef={episodePagesFlatListRef}
      />
    </View>
  );
};

const FormScaffold = () => {
  const appState = useSelector(appStateSelector);
  const headerStepsFlatListRef = createRef<FlatList>();
  const episodePagesFlatListRef = createRef<FlatList>();

  useEffect(() => {
    if (appState.currentEpStep == 0) {
      if (headerStepsFlatListRef?.current) {
        headerStepsFlatListRef?.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }

      if (episodePagesFlatListRef?.current) {
        episodePagesFlatListRef?.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }
  }, [appState.currentEpStep]);

  return (
    <View className='w-full'>
      <FormHeader
        headerStepsFlatListRef={headerStepsFlatListRef}
        episodePagesFlatListRef={episodePagesFlatListRef}
      />
      <FormContent
        headerStepsFlatListRef={headerStepsFlatListRef}
        episodePagesFlatListRef={episodePagesFlatListRef}
      />
    </View>
  );
};

const EpisodePage = () => {
  const appState = useSelector(appStateSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoadingState(false));
  }, []);

  // Limpa o título quando a tela perde o foco (navegação para outra tela)
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Cleanup: limpa o título quando sair da tela Episode
        dispatch(setPageTitle(''));
      };
    }, [dispatch])
  );

  return (
    <View>
      <AppPageScaffold>
        <FormScaffold />
      </AppPageScaffold>
      {/* {appState.currentEpStep != 11 && (
        <TouchableOpacity
          onPress={() => {
            dispatch(setEpisodeIndex(11));
          }}
          className=' absolute bottom-10 right-4 bg-blue-primary rounded-full p-4'
        >
          <Image
            className='w-5 h-5'
            source={require('src/assets/arrowrightwhite.png')}
          ></Image>
        </TouchableOpacity>
      )}
      {appState.currentEpStep == 11 && (
        <TouchableOpacity
          onPress={() => {
            dispatch(setEpisodeIndex(0));
          }}
          className=' absolute bottom-10 right-4 bg-purple-dark-primary  rounded-full p-4'
        >
          <Image
            className='w-5 h-5'
            source={require('src/assets/arrowback.png')}
          ></Image>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default EpisodePage;