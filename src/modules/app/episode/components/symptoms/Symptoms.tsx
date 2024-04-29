import { ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import { useApp } from 'src/infra/app/app';
import { Symptom as SymptomType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label:
      'Aura - A criança enxerga pontos ou formas brilhantes antes ou durante os episódios de dor.',
    img: require('assets/halo.png'),
    value: SymptomType.HALO,
  },
  {
    label: 'Sensibilidade à luz - A criança busca um lugar escuro.',
    img: require('assets/photo.png'),
    value: SymptomType.PHOTOSENSIBILITY,
  },
  {
    label: 'Sensibilidade ao barulho - A criança busca um lugar silencioso.',
    img: require('assets/hiperacusis.png'),
    value: SymptomType.HYPERACUSIS,
  },
  {
    label: 'Náusea - A criança deixa de comer.',
    img: require('assets/nausea.png'),
    value: SymptomType.NAUSEA,
  },
  {
    label: 'Dor de barriga.',
    img: require('assets/sickness.png'),

    value: SymptomType.SICKNESS,
  },
  {
    label: 'Vômito.',
    img: require('assets/vomit.png'),
    value: SymptomType.VOMIT,
  },
];

const Symptoms = () => {
  const { episodeFormState, handleFormChange } = useApp();

  const handleSetSymptomsValues = (value: string) => {
    if (episodeFormState.symptoms?.includes(value)) {
      handleFormChange({
        symptoms: Array.from(episodeFormState.symptoms).filter(
          (tr) => tr !== value
        ),
      });
    } else {
      handleFormChange({ symptoms: [...episodeFormState.symptoms, value] });
    }
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga quais são os sintomas : '>
        {data.map((act, index) => (
          <Card
            key={index}
            onPress={() => {
              handleSetSymptomsValues(act.value);
            }}
            children={
              <View className='flex-row items-center w-[80%]'>
                <BouncyCheckbox
                  size={22}
                  fillColor='#CEB0FA'
                  unfillColor='#FFFFFF'
                  textStyle={{ textDecorationLine: 'none' }}
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

export default Symptoms;
