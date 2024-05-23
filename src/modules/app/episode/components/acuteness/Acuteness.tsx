import { Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';
import Wrapper from '../form/wrapper/Wrapper';
import { useApp } from 'src/infra/app/app';
import { Acuteness as AcutenessType } from 'src/infra/@types/app.types';

const data = [
  {
    label: 'Leve - A criança reclama, mas continua brincando.',
    value: AcutenessType.LIGHT,
    img: require('src/assets/kid_playing_cubes.png'),
  },
  {
    label: 'Moderado - A criança reclama e para de brincar, mas não se deita.',
    value: AcutenessType.MILD,
    img: require('src/assets/arthur_lego.png'),
  },
  {
    label: 'Forte - A criança reclama, deita e pode chorar de dor.',
    value: AcutenessType.SEVERE,
    img: require('src/assets/kid_crying.png'),
  },
];

const Acuteness = () => {
  const { episodeFormState, handleFormChange } = useApp();

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga qual é a intensidade da dor :'>
        <RadioButton.Group
          onValueChange={(value) => handleFormChange({ acuteness: value })}
          value={episodeFormState.acuteness}
        >
          {data.map((act, index) => (
            <Card
              key={index}
              onPress={() => {
                handleFormChange({ acuteness: act.value });
              }}
              children={
                <View className='flex-row items-center'>
                  <RadioButton value={act.value} color='#CEB0FA' />
                  <Text className='dark:text-d-text-gray'>{act.label}</Text>
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
