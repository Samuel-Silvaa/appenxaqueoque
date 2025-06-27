import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { useApp } from 'src/infra/app/app';
import FormSteps from './components';
import { RefObject, createRef, useEffect, useState } from 'react';

import { sharedEpisodeStyleSheet } from './shared/SharedEpisodeStyleSheet';
import React from 'react';
import _ from 'lodash';

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
  const { steps, currentStep } = useApp();

  return (
    <View className={stylesheet.steps.container}>
      {Array(steps)
        .fill(0)
        .map((_, index) => {
          return (
            <View
              key={index}
              className={`w-[18px] h-[18px] rounded-full drop-shadow-md ${
                currentStep == index
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
  const { validateStepForward, setPageTitle } = useApp();
  const { currentStep } = useApp();

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
    if (setPageTitle && currentStep > 0) setPageTitle(DATA[currentStep].title);
  }, [currentStep]);

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
              if (validateStepForward(index))
                if (episodePagesFlatListRef?.current) {
                  episodePagesFlatListRef?.current.scrollToIndex({
                    index: index,
                    animated: true,
                  });
                }
              if (headerStepsFlatListRef?.current) {
                headerStepsFlatListRef?.current.scrollToIndex({
                  index: index,
                  animated: true,
                });
              }
            }}
            className={
              sharedEpisodeStyleSheet.topic.item +
              `${
                currentStep == index
                  ? ' bg-purple-dark-primary '
                  : ' bg-purple-dark-secondary'
              }`
            }
          >
            <Text
              key={index}
              className={`${
                currentStep == index ? 'text-[#fff]' : 'text-black '
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
];

const FormContent = ({ episodePagesFlatListRef }: EpisodeScaffold) => {
  const { currentStep } = useApp();

  return (
    <FlatList
      ref={episodePagesFlatListRef}
      scrollEnabled={false}
      windowSize={3}
      initialNumToRender={1}
      maxToRenderPerBatch={1}
      horizontal
      pagingEnabled={false}
      decelerationRate='fast'
      bounces={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ index }) => {
        const PageComponent = pageComponents[index];
        return (
          <View
            key={`list-view-${index}`}
            style={{
              width: Dimensions.get('screen').width - 32,
              paddingTop: 20,
            }}
          >
            <PageComponent />
          </View>
        );
      }}
      onScrollToIndexFailed={() => {}}
      keyExtractor={(_, index) => index.toString()}
      scrollEventThrottle={1} // Adjust as needed
      data={pageComponents}
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
  const { currentStep } = useApp();
  const headerStepsFlatListRef = createRef<FlatList>();
  const episodePagesFlatListRef = createRef<FlatList>();

  useEffect(() => {
    if (currentStep == 0) {
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
  }, [currentStep]);

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
  const { setPageTitle, clearEpisodeFormState } = useApp();

  useEffect(() => {
    return () => {
      if (setPageTitle) setPageTitle('');
      clearEpisodeFormState();
    };
  }, []);
  return (
    <AppPageScaffold>
      <FormScaffold />
    </AppPageScaffold>
  );
};

export default EpisodePage;
