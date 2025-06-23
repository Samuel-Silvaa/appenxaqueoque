import { Appearance, View } from 'react-native';
import Card from '../form/card/Card';
import Wrapper from '../form/wrapper/Wrapper';
import { ImpairFactor as ImpairFactorType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Fragment } from 'react';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";

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
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(impairSchema) });

  const handleSetImpairFactors = (value: string) => {
    if (appState.episode.impairFactor?.includes(value)) {
      dispatch(handleFormChanging({
        impairFactor: Array.from(appState.episode.impairFactor).filter(
          (tr) => tr !== value
        ),
      }));
    } else {
      dispatch(handleFormChanging({
        impairFactor: [...appState.episode.impairFactor, value],
      }));
    }
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='O que piora a dor?'>
        {data.map((act, index) => (
          <Fragment 
              key={index}
          >
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
                    unfillColor='#FFFFFF00'
                    textStyle={{
                      textDecorationLine: 'none',
                      color:
                        Appearance.getColorScheme() == 'dark'
                          ? '#9DA3A9'
                          : '#2E3E4B',
                    }}
                    text={act.label}
                    isChecked={appState.episode.symptoms?.includes(act.value)}
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
                editable={appState.episode.impairFactor?.includes(
                  ImpairFactorType.ANOTHER
                )}
                setValue={setValue}
                label='Qual outro fator de piora?'
                name='anotherImpairFactor'
                placeholder='Descreva brevemente'
                control={control}
                errors={errors}
                className={
                  !appState.episode.impairFactor?.includes(
                    ImpairFactorType.ANOTHER
                  )
                    ? 'opacity-25' + ' bg-white drop-shadow-sm'
                    : 'opacity-100' + ' bg-white drop-shadow-sm'
                }
                defaultValue={appState.episode.anotherImpairFactor!}
                onChange={(e) =>
                  handleFormChanging({ anotherImpairFactor: e.nativeEvent.text })
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
