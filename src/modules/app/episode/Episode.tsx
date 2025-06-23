import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { useApp } from 'src/infra/app/app';
import { RefObject, createRef, useEffect, useState } from 'react';
import FormSteps from './components';

import { sharedEpisodeStyleSheet } from './shared/SharedEpisodeStyleSheet';
import React from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { clearEpisodeState, handleStepForward, setLoadingState, setPageTitle } from "src/infra/app/reducers/app.reducer";

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
 const appState = useSelector(appStateSelector);

  return (
    <View className={stylesheet.steps.container}>
      {Array(pages.length)
        .fill(0)
        .map((_, index) => {
          return (
            <View
              key={index}
              className={`w-[18px] h-[18px] rounded-full drop-shadow-md ${
                appState.currentEpStep == index
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
  const  appState  = useSelector(appStateSelector);
  const dispatch = useDispatch();

  const DATA: { id: string; title: string }[] = [
    'Data e horário',
    'Duração da dor',
    'Localização',
    'Intensidade',
    'Características da dor',
    'Sintomas associados',
    'Sintomas da aura',
    'Fatores de piora',
    'Fatores desencadentes',
    'Fatores de melhora',
    'Periodo menstrual',
    'Observações',
  ].map((item, indx) => ({ title: item, id: item + indx }));

  useEffect(() => {
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
  }, [appState.currentEpStep]);

  return (
    <View className={sharedEpisodeStyleSheet.topic.container}>
      <FlatList
        ref={headerStepsFlatListRef}
        data={DATA}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }: HeadListProps) => (
          <TouchableOpacity
          key={`t-${index}`}
            onPress={() => {
                dispatch(handleStepForward(index));
            }}
            className={
              sharedEpisodeStyleSheet.topic.item +
              `${
                appState.currentEpStep == index
                  ? ' bg-purple-dark-primary '
                  : ' bg-purple-dark-secondary'
              }`
            }
          >
            <Text
              key={index}
              className={`${
                appState.currentEpStep == index ? 'text-[#fff]' : 'text-black '
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

const pages = [
  { page: <FormSteps.Datetime /> },
  { page: <FormSteps.EpisodeDuration /> },
  { page: <FormSteps.Location /> },
  { page: <FormSteps.Acuteness /> },
  { page: <FormSteps.PainType /> },
  { page: <FormSteps.Symptoms /> },
  { page: <FormSteps.HaloSymptom /> },
  { page: <FormSteps.ImpairFactor /> },
  { page: <FormSteps.Trigger /> },
  { page: <FormSteps.ImprovementFactor /> },
  { page: <FormSteps.Period /> },
  { page: <FormSteps.Notes /> },
];

const FormContent = ({ episodePagesFlatListRef }: EpisodeScaffold) => {
  const appState = useSelector(appStateSelector)

  return (
    <FlatList
      ref={episodePagesFlatListRef}
      scrollEnabled={false}
      windowSize={3}
      initialNumToRender={pages.length}
      initialScrollIndex={appState.currentEpStep}
      maxToRenderPerBatch={0}
      horizontal
      pagingEnabled={false}
      decelerationRate='fast'
      bounces={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View
        key={`list-view-${item.index}`}
          style={{
            width: Dimensions.get('screen').width - 32,
            paddingTop: 20,
          }}
        >
          {item.page}
        </View>
      )}
      onScrollToIndexFailed={() => {}}
      keyExtractor={(item, index) => item.toString() + index}
      scrollEventThrottle={1} // Adjust as needed
      data={pages}
    />
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoadingState(false));
    return () => {
      dispatch(setPageTitle(''));
      dispatch(clearEpisodeState());
    };
  }, []);
  return (
    <AppPageScaffold>
      <FormScaffold />
    </AppPageScaffold>
  );
};

export default EpisodePage;
