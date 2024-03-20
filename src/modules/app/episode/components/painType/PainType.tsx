import { ImageSourcePropType, Text, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';
import { useApp } from 'src/infra/app/app';
import { PainType as PainTypeEnum } from 'src/infra/@types/app.types';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Pulsátil: como um coração batendo na cabeça.',
    value: PainTypeEnum.THROB,
  },
  {
    label: 'Em aperto: como um capacete muito apertado.',
    value: PainTypeEnum.TIGHT,
  },
];

const PainType = () => {
  const { episodeFormState, handleFormChange } = useApp();

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos mostre como você sente a dor :'>
        <RadioButton.Group
          onValueChange={(value) => handleFormChange({ painType: value })}
          value={episodeFormState.painType}
        >
          {data.map((act, index) => (
            <Card
              key={index}
              onPress={() => {
                handleFormChange({ painType: act.value });
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
