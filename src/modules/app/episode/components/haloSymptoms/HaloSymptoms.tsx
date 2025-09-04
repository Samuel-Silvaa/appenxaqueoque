import { Appearance, ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import { useApp } from 'src/infra/app/app';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { HaloSymptom } from 'src/infra/@types/app.types';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label:
      'Alterações visuais - A criança enxerga linhas ou manchas brilhantes antes ou durante os episódios de dor.',
    img: require('src/assets/halo.png'),
    value: HaloSymptom.VISUAL_DISTORTIONS,
  },
  {
    label: 'Formigamento - A criança pode sentir dormência nos braços, na face ou na língua.',
    img: require('src/assets/formigamento.png'),
    value: HaloSymptom.TINGLING,
  },
  {
    label: 'Alterações na fala - A criança pode emitir sons incompreensíveis ou ter dificuldade em pronunciar algumas palavras.',
    img: require('src/assets/fala.png'),
    value: HaloSymptom.SPEECH_DISTORTIONS,
  },
];

const HaloSymptoms = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);

  const handleSetSymptomsValues = (value: string) => {
    // Ensure haloSymptoms is always an array
    const currentHaloSymptoms = Array.isArray(appState.episode.haloSymptoms) 
      ? appState.episode.haloSymptoms 
      : [];
    
    if (currentHaloSymptoms.includes(value)) {
      dispatch(handleFormChanging({
        haloSymptoms: currentHaloSymptoms.filter((tr) => tr !== value),
      }));
    } else {
      dispatch(handleFormChanging({
        haloSymptoms: [...currentHaloSymptoms, value],
      }));
    }
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='Quais foram os sintomas da aura? '>
        {data.map((act, index) => (
          <Card
            key={index}
            onPress={() => {
              handleSetSymptomsValues(act.value);
            }}
            children={
              <View className='flex-row items-center w-[80%] '>
                <BouncyCheckbox
                  size={22}
                  fillColor='#CEB0FA'
                  unfillColor='#FFFFFF00'
                  textStyle={{
                    textDecorationLine: 'none',
                    color:
                      Appearance.getColorScheme() == 'dark'
                        ? '#9DA3A9'
                        : '#2E3E4B',
                    flexWrap: 'wrap',
                    flex: 1,
                    flexShrink: 1,
                  }}
                  text={act.label}
                  isChecked={appState.episode.haloSymptoms.includes(act.value)}
                  onPress={(isChecked: boolean) => {
                    handleSetSymptomsValues(act.value);
                  }}
                />
              </View>
            }
            image={act?.img}
          />
        ))}
      </Wrapper>
    </View>
  );
};

export default HaloSymptoms;
