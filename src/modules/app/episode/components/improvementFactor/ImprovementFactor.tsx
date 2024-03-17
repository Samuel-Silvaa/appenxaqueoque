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
    label: 'Descanso',
    value: 'throb',
  },
  {
    label: 'Alimentação',
    value: 'mild',
  },
];

const ImprovementFactor = () => {
  const [selectedValue, setSelectedValue] = useState('morning');

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga o que te ajudou a melhorar'>
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

export default ImprovementFactor;
