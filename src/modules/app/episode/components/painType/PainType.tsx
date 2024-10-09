import { ImageSourcePropType, Text, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';
import { useApp } from 'src/infra/app/app';
import { PainType as PainTypeEnum } from 'src/infra/@types/app.types';
import { Fragment } from 'react';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Pulsátil: como um coração batendo na cabeça.',
    img: require('src/assets/throb.png'),
    value: PainTypeEnum.THROB,
  },
  {
    label: 'Em aperto: como um capacete apertando.',
    img: require('src/assets/helmet.png'),
    value: PainTypeEnum.TIGHT,
  },
  {
    label: 'Outros.',
    value: PainTypeEnum.ANOTHER,
  },
];

const painTypeSchema = yup.object<{ anotherPainType: string }>().shape({
  anotherPainType: yup.string(),
});

const PainType = () => {
  const { episodeFormState, handleFormChange } = useApp();

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(painTypeSchema) });

  return (
    <View className='h-full w-full'>
      <Wrapper title='Qual a característica da dor ?'>
        <RadioButton.Group
          onValueChange={(value) => handleFormChange({ painType: value })}
          value={episodeFormState.painType}
        >
          {data.map((act, index) => (
            <Fragment>
              <Card
                key={index}
                onPress={() => {
                  handleFormChange({ painType: act.value });
                }}
                children={
                  <View className='flex-row items-center'>
                    <RadioButton value={act.value} color='#CEB0FA' />
                    <Text className='dark:text-d-text-gray'>{act.label}</Text>
                  </View>
                }
                image={act?.img}
              />
              {act.value == PainTypeEnum.ANOTHER && (
                <InputContainer
                  editable={episodeFormState.painType?.includes(
                    PainTypeEnum.ANOTHER
                  )}
                  setValue={setValue}
                  label='Qual outra característica da dor?'
                  name='anotherPainType'
                  placeholder='Descreva brevemente'
                  control={control}
                  errors={errors}
                  className={
                    !episodeFormState.painType?.includes(PainTypeEnum.ANOTHER)
                      ? 'opacity-25' + ' bg-white drop-shadow-sm'
                      : 'opacity-100' + ' bg-white drop-shadow-sm'
                  }
                  defaultValue={episodeFormState.anotherPainType}
                  onChange={(e) =>
                    handleFormChange({ anotherPainType: e.target.value })
                  }
                />
              )}
            </Fragment>
          ))}
        </RadioButton.Group>
      </Wrapper>
    </View>
  );
};

export default PainType;
