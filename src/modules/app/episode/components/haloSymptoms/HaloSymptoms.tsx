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
    label: 'Formigamento',
    img: require('src/assets/halo.png'),
    value: HaloSymptom.TINGLING,
  },
  {
    label: 'Alterações na fala',
    img: require('src/assets/halo.png'),
    value: HaloSymptom.SPEECH_DISTORTIONS,
  },
];

const HaloSymptoms = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);

  const handleSetSymptomsValues = (value: string) => {
    if (appState.episode.symptoms?.includes(value)) {
      dispatch(handleFormChanging({
        haloSymptoms: Array.from(appState.episode.haloSymptoms).filter(
          (tr) => tr !== value
        ),
      }));
    } else {
     dispatch( handleFormChanging({
        haloSymptoms: [...appState.episode.haloSymptoms, value],
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
                  }}
                  text={act.label}
                  isChecked={appState.episode.symptoms?.includes(act.value)}
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
