import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
    container: 'flex-row w-full justify-center items-center',
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
              } mx-2`}
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
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Data e horário',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Localização',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Intensidade',
    },
    {
      id: '1oj12b3o-3da1-471f-bd96-145571e29d72',
      title: 'Características da dor',
    },
    {
      id: '102830hu1-3da1-471f-bd96-145571e29d72',
      title: 'Sintomas associados',
    },
    {
      id: '1o273g091b72-3da1-471f-bd96-145571e29d72',
      title: 'Gatilhos',
    },
    {
      id: '1027hd01ud-3da1-471f-bd96-145571e29d72',
      title: 'Fatores de melhora',
    },
    {
      id: '01h01n2-3da1-471f-bd96-145571e29d72',
      title: 'Período mestrual',
    },
    {
      id: 'c0710d1d-3da1-471f-bd96-145571e29d72',
      title: 'Observações',
    },
  ];

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
const pages = [
  { page: <FormSteps.Datetime /> },
  { page: <FormSteps.Location /> },
  { page: <FormSteps.Acuteness /> },
  { page: <FormSteps.PainType /> },
  { page: <FormSteps.Symptoms /> },
  { page: <FormSteps.Trigger /> },
  { page: <FormSteps.ImprovementFactor /> },
  { page: <FormSteps.Period /> },
  { page: <FormSteps.Notes /> },
];

const FormContent = ({
  episodePagesFlatListRef,
  headerStepsFlatListRef,
}: EpisodeScaffold) => {
  const { currentStep, validateStepForward } = useApp();
  const [screenOfffset, setScreenOffset] = useState(0);

  const handleHeaderAndEpisodeSlidesAction = (direction: number) => {
    if (direction == 0 && currentStep < pages.length - 1) {
      if (validateStepForward(currentStep + 1)) {
        if (headerStepsFlatListRef?.current) {
          headerStepsFlatListRef?.current.scrollToIndex({
            index: currentStep + 1,
            animated: true,
          });
        }
        if (episodePagesFlatListRef?.current) {
          episodePagesFlatListRef?.current.scrollToIndex({
            index: currentStep + 1,
            animated: true,
          });
        }
      }
    } else if (direction == 1) {
      if (validateStepForward(currentStep - 1)) {
        if (headerStepsFlatListRef?.current) {
          headerStepsFlatListRef?.current.scrollToIndex({
            index: currentStep - 1,
            animated: true,
          });
        }
        if (episodePagesFlatListRef?.current) {
          episodePagesFlatListRef?.current.scrollToIndex({
            index: currentStep - 1,
            animated: true,
          });
        }
      }
    }
  };

  const handleScrollBeginDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    setScreenOffset(event.nativeEvent.contentOffset.x);
  };

  const handleScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const endOffset = event.nativeEvent.contentOffset.x;
    handleHeaderAndEpisodeSlidesAction(endOffset > screenOfffset ? 0 : 1);
  };

  return (
    <FlatList
      ref={episodePagesFlatListRef}
      windowSize={3}
      initialNumToRender={pages.length}
      initialScrollIndex={currentStep}
      maxToRenderPerBatch={0}
      horizontal
      pagingEnabled={true}
      decelerationRate='fast'
      bounces={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <View
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
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
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
  const { setPageTitle } = useApp();

  useEffect(() => {
    return () => {
      if (setPageTitle) setPageTitle('');
    };
  }, [this]);
  return (
    <AppPageScaffold>
      <FormScaffold />
    </AppPageScaffold>
  );
};

export default EpisodePage;
