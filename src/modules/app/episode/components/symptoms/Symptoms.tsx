import { useState } from 'react';
import { ImageSourcePropType, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label:
      'Aura - A criança enxerga pontos ou formas brilhantes antes ou durante os episódios de dor.',
    value: 'throb',
  },
  {
    label: 'Sensibilidade à luz - A criança busca um lugar escuro.',
    value: 'mild',
  },
  {
    label: 'Sensibilidade ao barulho - A criança busca um lugar silencioso.',
    value: 'throb',
  },
  {
    label: 'Náusea - A criança deixa de comer.',
    value: 'mild',
  },
  {
    label: 'Dor de barriga.',
    value: 'throb',
  },
  {
    label: 'Vômito.',
    value: 'mild',
  },
];

const Symptoms = () => {
  const [selectedValue, setSelectedValue] = useState('morning');

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga quais são os sintomas : '>
        <RadioButton.Group
          onValueChange={(value) => setSelectedValue(value)}
          value={selectedValue}
        >
          {data.map((act, index) => (
            <Card
              key={index}
              onPress={() => {
                setSelectedValue(act.value);
              }}
              children={
                <View className='flex-row items-center'>
                  <RadioButton value={act.value} color='#CEB0FA' />
                  <Text className=''>{act.label}</Text>
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
