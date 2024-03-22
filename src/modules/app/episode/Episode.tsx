import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { useApp } from 'src/infra/app/app';
import FormSteps from './components';
import { ReactNode, createRef, useEffect } from 'react';

const stylesheet = {
  steps: {
    container: 'flex-row w-full justify-center items-center',
  },
  topic: {
    container: 'flex-row w-full my-8 ',
    item: 'font-semibold min-w-[100px] h-[43px] rounded-full flex items-center justify-center mx-2 p-2',
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

const Topic = () => {
  const { validateStepForward } = useApp();
  const {
    currentStep,
    episodeFormState,
    validateAutomaticEpisodeStepNavigation,
  } = useApp();
  const flatList = createRef<FlatList>();

  useEffect(() => {
    if (validateAutomaticEpisodeStepNavigation()) {
      if (flatList.current) {
        flatList.current.scrollToIndex({
          index: currentStep,
          animated: true,
        });
      }
    }
  }, [episodeFormState]);

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

  return (
    <View className={stylesheet.topic.container}>
      <FlatList
        ref={flatList}
        data={DATA}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }: HeadListProps) => (
          <TouchableOpacity
            onPress={() => {
              if (validateStepForward(index)) {
                if (flatList.current) {
                  flatList.current.scrollToIndex({
                    index: index,
                    animated: true,
                  });
                }
              } else {
                if (flatList.current) {
                  flatList.current.scrollToIndex({
                    index: currentStep,
                    animated: true,
                  });
                }
              }
            }}
            className={
              stylesheet.topic.item +
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

const FormHeader = () => {
  return (
    <View className={stylesheet.form.header.wrapper}>
      <Steps />
      <Topic />
    </View>
  );
};

const getCurrentFormElement = (step: number): ReactNode => {
  switch (step) {
    case 0:
      return <FormSteps.Datetime />;
    case 1:
      return <FormSteps.Location />;
    case 2:
      return <FormSteps.Acuteness />;
    case 3:
      return <FormSteps.PainType />;
    case 4:
      return <FormSteps.Symptoms />;
    case 5:
      return <FormSteps.Trigger />;
    case 6:
      return <FormSteps.ImprovementFactor />;
    case 7:
      return <FormSteps.Period />;
    case 8:
      return <FormSteps.Notes />;
  }
};

const FormContent = () => {
  const { currentStep } = useApp();
  return (
    <View className={stylesheet.form.wrapper}>
      {getCurrentFormElement(currentStep)}
    </View>
  );
};

const FormScaffold = () => {
  return (
    <View className='w-full'>
      <FormHeader />
      <FormContent />
    </View>
  );
};

const EpisodePage = () => {
  return (
    <AppPageScaffold>
      <FormScaffold />
    </AppPageScaffold>
  );
};

export default EpisodePage;
