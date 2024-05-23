import { ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useApp } from 'src/infra/app/app';
import { Trigger as TriggerType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useEffect } from 'react';

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

  const handleSetTriggersValues = (value: string) => {
    if (episodeFormState.triggers?.includes(value)) {
      handleFormChange({
        triggers: Array.from(episodeFormState.triggers).filter(
          (tr) => tr !== value
        ),
      });
    } else {
      handleFormChange({ triggers: [...episodeFormState.triggers, value] });
    }
  };

  useEffect(() => {}, [episodeFormState.triggers]);

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga quais foram os gatilhos : '>
        {data.map((act, index) => (
          <Card
            key={index}
            onPress={() => {
              handleSetTriggersValues(act.value);
            }}
            children={
              <View className='flex-row items-center'>
                <BouncyCheckbox
                  size={22}
                  fillColor='#CEB0FA'
                  unfillColor='#FFFFFF'
                  textStyle={{ textDecorationLine: 'none' }}
                  text={act.label}
                  isChecked={episodeFormState.triggers?.includes(act.value)}
                  onPress={(isChecked: boolean) => {
                    handleSetTriggersValues(act.value);
                  }}
                />
              </View>
            }
            image={act?.img}
          />
        ))}
      </Wrapper>
      <InputContainer
        label='Qual alimento foi o gatilho?'
        labelicon={require('src/assets/cupcake.png')}
        name='foodImpair'
        control={control}
        errors={errors}
        editable={episodeFormState.triggers?.includes(TriggerType.FOOD)}
        className={`${
          episodeFormState.triggers?.includes(TriggerType.FOOD)
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
