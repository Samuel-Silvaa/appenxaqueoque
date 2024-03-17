import { ImageSourcePropType, Text, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';
import { useState } from 'react';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Pulsátil: como um coração batendo na cabeça.',
    value: 'throb',
  },
  {
    label: 'Em aperto: como um capacete muito apertado.',
    value: 'mild',
  },
];

const PainType = () => {
  const [selectedValue, setSelectedValue] = useState('morning');

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos mostre como você sente a dor :'>
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

export default PainType;
