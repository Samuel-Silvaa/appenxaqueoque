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
    value: SymptomType.HALO,
  },
  {
    label: 'Sensibilidade à luz - A criança busca um lugar escuro.',
    value: SymptomType.PHOTOSENSIBILITY,
  },
  {
    label: 'Sensibilidade ao barulho - A criança busca um lugar silencioso.',
    value: SymptomType.HYPERACUSIS,
  },
  {
    label: 'Náusea - A criança deixa de comer.',
    value: SymptomType.NAUSEA,
  },
  {
    label: 'Dor de barriga.',
    value: SymptomType.SICKNESS,
  },
  {
    label: 'Vômito.',
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
              <View className='flex-row items-center'>
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
