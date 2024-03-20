import { ImageSourcePropType, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import { useApp } from 'src/infra/app/app';
import { Symptom as SymptomType } from 'src/infra/@types/app.types';

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

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga quais são os sintomas : '>
        <RadioButton.Group
          onValueChange={(value) => handleFormChange({ symptoms: value })}
          value={episodeFormState.symptoms}
        >
          {data.map((act, index) => (
            <Card
              key={index}
              onPress={() => {
                handleFormChange({ symptoms: act.value });
              }}
              children={
                <View className='flex-row items-center'>
                  <RadioButton value={act.value} color='#CEB0FA' />
                  <Text>{act.label}</Text>
                </View>
              }
              image={act?.img}
            />
          ))}
        </RadioButton.Group>
      </Wrapper>
    </View>
  );
};

export default Symptoms;
