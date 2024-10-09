import { Appearance, Text, View } from 'react-native';
import Card from '../form/card/Card';
import Wrapper from '../form/wrapper/Wrapper';
import { useApp } from 'src/infra/app/app';
import { ImpairFactor as ImpairFactorType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Fragment } from 'react';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const data = [
  {
    label: 'Pular',
    value: ImpairFactorType.JUMP,
    img: require('src/assets/duck.png'),
  },
  {
    label: 'Agachar',
    value: ImpairFactorType.CROUCH,
    img: require('src/assets/duck.png'),
  },
  {
    label: 'Outros',
    value: ImpairFactorType.ANOTHER,
    img: require('src/assets/duck.png'),
  },
];

const impairSchema = yup.object<{ anotherImpairFactor: string }>().shape({
  anotherImpairFactor: yup.string(),
});

const ImpairFactor = () => {
  const { episodeFormState, handleFormChange } = useApp();

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(impairSchema) });

  const handleSetImpairFactors = (value: string) => {
    if (episodeFormState.impairFactor?.includes(value)) {
      handleFormChange({
        impairFactor: Array.from(episodeFormState.impairFactor).filter(
          (tr) => tr !== value
        ),
      });
    } else {
      handleFormChange({
        impairFactor: [...episodeFormState.impairFactor, value],
      });
    }
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='O que piora a dor? '>
        {data.map((act, index) => (
          <Fragment>
            <Card
              key={index}
              onPress={() => {
                handleSetImpairFactors(act.value);
              }}
              children={
                <View className='flex-row items-center w-[80%] '>
                  <BouncyCheckbox
                    size={22}
                    fillColor='#CEB0FA'
                    unfillColor='#FFFFFF'
                    textStyle={{
                      textDecorationLine: 'none',
                      color:
                        Appearance.getColorScheme() == 'dark'
                          ? '#9DA3A9'
                          : '#2E3E4B',
                    }}
                    text={act.label}
                    isChecked={episodeFormState.symptoms?.includes(act.value)}
                    onPress={(isChecked: boolean) => {
                      handleSetImpairFactors(act.value);
                    }}
                  />
                </View>
              }
              image={act?.img}
            />
            {act.value == ImpairFactorType.ANOTHER && (
              <InputContainer
                editable={episodeFormState.impairFactor?.includes(
                  ImpairFactorType.ANOTHER
                )}
                setValue={setValue}
                label='Qual outro fator de piora?'
                name='anotherImpairFactor'
                placeholder='Descreva brevemente'
                control={control}
                errors={errors}
                className={
                  !episodeFormState.impairFactor?.includes(
                    ImpairFactorType.ANOTHER
                  )
                    ? 'opacity-25' + ' bg-white drop-shadow-sm'
                    : 'opacity-100' + ' bg-white drop-shadow-sm'
                }
                defaultValue={episodeFormState.anotherImpairFactor}
                onChange={(e) =>
                  handleFormChange({ anotherImpairFactor: e.target.value })
                }
              />
            )}
          </Fragment>
        ))}
      </Wrapper>
    </View>
  );
};

export default ImpairFactor;
