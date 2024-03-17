import { ReactNode, useState } from 'react';
import { Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';
import Wrapper from '../form/wrapper/Wrapper';

const data = [
  {
    label: 'Leve - A criança reclama, mas continua brincando.',
    value: 'light',
    img: require('assets/kid_playing_cubes.png'),
  },
  {
    label: 'Moderado - A criança reclama e para de brincar, mas não se deita.',
    value: 'mild',
    img: require('assets/kid_reading.png'),
  },
  {
    label: 'Forte - A criança reclama, deita e pode chorar de dor.',
    value: 'severe',
    img: require('assets/kid_crying.png'),
  },
];

const Acuteness = () => {
  const [selectedValue, setSelectedValue] = useState('morning');

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga qual é a intensidade da dor :'>
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
              image={act.img}
            />
          ))}
        </RadioButton.Group>
      </Wrapper>
    </View>
  );
};

export default Acuteness;
