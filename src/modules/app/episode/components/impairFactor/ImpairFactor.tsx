import { View } from 'react-native';
import Card from '../form/card/Card';
import Wrapper from '../form/wrapper/Wrapper';
import { ImpairFactor as ImpairFactorType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Fragment } from 'react';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector } from 'src/infra/app/selectors';
import { handleFormChanging } from 'src/infra/app/reducers/app.reducer';
import { useTheme } from 'react-native-paper';

const data = [
  {
    label: 'Pular',
    value: ImpairFactorType.JUMP,
    img: require('src/assets/kid_playing_cubes.png'),
  },
  {
    label: 'Agachar',
    value: ImpairFactorType.CROUCH,
    img: require('src/assets/agachar.png'),
  },
  {
    label: 'Outros',
    value: ImpairFactorType.ANOTHER,
  },
];

const impairSchema = yup.object<{ anotherImpairFactor?: string }>().shape({
  anotherImpairFactor: yup.string(),
});

const ImpairFactor = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const theme = useTheme();
  const hasClinicalOptions = appState.clinicalOptions.length > 0;
  const legacyImpairFactors = appState.episode.impairFactor as string | string[];

  const {
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<{ anotherImpairFactor?: string }>({
    resolver: yupResolver(impairSchema),
  });

  const currentImpairFactors: string[] =
    hasClinicalOptions && appState.episode.impairmentFactorOptionIds?.length
      ? appState.episode.impairmentFactorOptionIds
      : Array.isArray(legacyImpairFactors)
        ? legacyImpairFactors
        : legacyImpairFactors
          ? legacyImpairFactors.split(',').filter(Boolean)
          : [];

  const optionIdFor = (label: string): string | undefined =>
    appState.clinicalOptions.find(
      (option) => option.category === 'IMPAIRMENT_FACTOR' && option.label === label,
    )?.id;

  const isImpairFactorSelected = (label: string): boolean => {
    const optionId = optionIdFor(label);

    return currentImpairFactors.includes(
      hasClinicalOptions && optionId ? optionId : label,
    );
  };

  const handleSetImpairFactors = (value: string) => {
    const optionId = optionIdFor(value);
    const selectedValue = hasClinicalOptions && optionId ? optionId : value;
    const isSelected = currentImpairFactors.includes(selectedValue);
    const impairFactors = isSelected
      ? currentImpairFactors.filter((factor) => factor !== selectedValue)
      : [...currentImpairFactors, selectedValue];
    const update: Record<string, string | string[] | null> = hasClinicalOptions
      ? { impairmentFactorOptionIds: impairFactors }
      : { impairFactor: impairFactors };

    if (isSelected && value === ImpairFactorType.ANOTHER) {
      update.anotherImpairFactor = null;
      reset({ anotherImpairFactor: '' });
    }

    dispatch(handleFormChanging(update));
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='O que piora a dor?'>
        {data.map((act, index) => (
          <Fragment key={index}>
            <Card
              key={index}
              children={
                <View className='flex-row items-center w-[80%] '>
                  <BouncyCheckbox
                    size={22}
                    fillColor={theme.colors.secondary}
                    unfillColor='transparent'
                    textStyle={{
                      textDecorationLine: 'none',
                      color: theme.colors.onSurface,
                      flexWrap: 'wrap',
                      flex: 1,
                      flexShrink: 1,
                    }}
                    text={act.label}
                    isChecked={isImpairFactorSelected(act.value)}
                    onPress={() => {
                      handleSetImpairFactors(act.value);
                    }}
                  />
                </View>
              }
              image={act?.img}
            />
            {act.value == ImpairFactorType.ANOTHER && (
              <InputContainer
                editable={
                  isImpairFactorSelected(ImpairFactorType.ANOTHER)
                }
                setValue={setValue}
                label='Qual outro fator de piora?'
                name='anotherImpairFactor'
                placeholder='Descreva brevemente'
                control={control}
                errors={errors}
                className={
                  isImpairFactorSelected(ImpairFactorType.ANOTHER)
                    ? 'opacity-100 bg-white drop-shadow-sm'
                    : 'opacity-25 bg-white drop-shadow-sm'
                }
                defaultValue={appState.episode.anotherImpairFactor!}
                onChange={(e) =>
                  dispatch(
                    handleFormChanging({
                      anotherImpairFactor: e.nativeEvent.text,
                    })
                  )
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
