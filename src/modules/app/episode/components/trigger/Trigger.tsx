import { useState } from 'react';
import { ImageSourcePropType, Text, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Alimentação',
    value: 'throb',
  },
  {
    label: 'Sono irregular',
    value: 'mild',
  },
  {
    label: 'Fatores emocionais',
    value: 'throb',
  },
];

const Trigger = () => {
  const [selectedValue, setSelectedValue] = useState('morning');

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga quais foram os gatilhos : '>
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

export default Trigger;
