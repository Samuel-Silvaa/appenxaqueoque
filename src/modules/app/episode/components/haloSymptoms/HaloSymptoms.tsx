import { Appearance, ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import { useApp } from 'src/infra/app/app';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { HaloSymptom } from 'src/infra/@types/app.types';

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
  const { episodeFormState, handleFormChange } = useApp();

  const handleSetSymptomsValues = (value: string) => {
    if (episodeFormState.symptoms?.includes(value)) {
      handleFormChange({
        haloSymptoms: Array.from(episodeFormState.haloSymptoms).filter(
          (tr) => tr !== value
        ),
      });
    } else {
      handleFormChange({
        haloSymptoms: [...episodeFormState.haloSymptoms, value],
      });
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
                  unfillColor='#FFFFFF'
                  textStyle={{
                    textDecorationLine: 'none',
                    color:
                      Appearance.getColorScheme() == 'dark'
                        ? '#9DA3A9'
                        : '#2E3E4B',
                  }}
                  text={act.label}
                  isChecked={episodeFormState.symptoms?.includes(act.value)}
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
