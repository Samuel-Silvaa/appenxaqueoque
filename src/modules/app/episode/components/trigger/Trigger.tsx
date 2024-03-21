import { ImageSourcePropType, Text, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useApp } from 'src/infra/app/app';
import { Trigger as TriggerType } from 'src/infra/@types/app.types';

interface TriggerSchema {
  foodImpair: string;
}

const triggerSchema = yup.object<TriggerSchema>().shape({
  foodImpair: yup.string(),
});

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Alimentação',
    value: TriggerType.FOOD,
  },
  {
    label: 'Sono irregular',
    value: TriggerType.JAGGEDSLEEP,
  },
  {
    label: 'Fatores emocionais',
    value: TriggerType.EMOTIONAL,
  },
];

const Trigger = () => {
  const { episodeFormState, handleFormChange } = useApp();
  const {
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(triggerSchema) });

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga quais foram os gatilhos : '>
        <RadioButton.Group
          onValueChange={(value) => handleFormChange({ triggers: value })}
          value={episodeFormState.triggers}
        >
          {data.map((act, index) => (
            <Card
              key={index}
              onPress={() => {
                handleFormChange({ triggers: act.value });
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
      <InputContainer
        label='Qual alimento foi o gatilho?'
        name='foodImpair'
        control={control}
        errors={errors}
        editable={episodeFormState.triggers == TriggerType.FOOD}
        className={`${
          episodeFormState.triggers == TriggerType.FOOD
            ? 'opacity-100'
            : ' opacity-25'
        } bg-white drop-shadow-sm`}
        defaultValue={episodeFormState.foodImpair}
        onChange={(e) => handleFormChange({ foodImpair: e.target.value })}
      ></InputContainer>
    </View>
  );
};

export default Trigger;
