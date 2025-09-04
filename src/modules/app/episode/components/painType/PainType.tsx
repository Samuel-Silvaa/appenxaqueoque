import {
  ImageSourcePropType,
  NativeSyntheticEvent,
  Text,
  TextInputChangeEventData,
  View,
} from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';
import { PainType as PainTypeEnum } from 'src/infra/@types/app.types';
import { Fragment, useCallback } from 'react';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector } from 'src/infra/app/selectors';
import { handleFormChanging } from 'src/infra/app/reducers/app.reducer';

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
    label: 'Em aperto: como um capacete apertado.',
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
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(painTypeSchema) });

  const handlePainTypeChange = useCallback(
    async (value: string) => {
      if (value !== PainTypeEnum.ANOTHER) {
        dispatch(handleFormChanging({ painType: value, anotherPainType: '' }));
        setValue( 'anotherPainType', '' );
      } else {
        dispatch(handleFormChanging({ painType: value }));
      }
    },
    [appState.episode.painType]
  );

  return (
    <View className='h-full w-full'>
      <Wrapper title='Qual a característica da dor ?'>
        <RadioButton.Group
          onValueChange={(value) =>
           handlePainTypeChange(value)
          }
          value={appState.episode.painType!}
        >
          {data.map((act, index) => (
            <Fragment key={index}>
              <Card
                children={
                  <View className='flex-row items-center'>
                    <RadioButton value={act.value} color='#CEB0FA' />
                    <Text
                      className='dark:text-d-text-gray'
                      style={{ flexWrap: 'wrap', flex: 1, flexShrink: 1 }}
                    >
                      {act.label}
                    </Text>
                  </View>
                }
                image={act?.img}
              />
              <Text></Text>
              {act.value == PainTypeEnum.ANOTHER && (
                <InputContainer
                  editable={appState.episode.painType?.includes(
                    PainTypeEnum.ANOTHER
                  )}
                  setValue={setValue}
                  label='Qual outra característica da dor?'
                  name='anotherPainType'
                  placeholder='Descreva brevemente'
                  control={control}
                  errors={errors}
                  className={
                    appState.episode.painType != PainTypeEnum.ANOTHER
                      ? 'opacity-25' + ' bg-white drop-shadow-sm'
                      : 'opacity-100' + ' bg-white drop-shadow-sm'
                  }
                  defaultValue={appState.episode.anotherPainType!}
                  onChange={(e) => {
                    if (appState.episode.painType == PainTypeEnum.ANOTHER) {
                      dispatch(
                        handleFormChanging({
                          anotherPainType: e.nativeEvent.text,
                        })
                      );
                    }
                  }}
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
