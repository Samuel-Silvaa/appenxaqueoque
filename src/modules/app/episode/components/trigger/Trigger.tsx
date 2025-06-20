import { ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trigger as TriggerType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";

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
    label:
      'Sono irregular - A criança dormiu pouco ou dormiu mais do que o habitual',
    img: require('src/assets/duck.png'),
    value: TriggerType.JAGGEDSLEEP,
  },
  {
    label: 'Fatores emocionais - Agitação, ansiedade, tristeza.',
    img: require('src/assets/duck.png'),
    value: TriggerType.EMOTIONAL,
  },
  {
    label: 'Esforço visual - Uso excessivo de tela.',
    img: require('src/assets/duck.png'),
    value: TriggerType.VISUALEFFORT,
  },
  {
    label: 'Jejum prolongado - A criança ficou um longo período sem comer.',
    img: require('src/assets/duck.png'),
    value: TriggerType.FASTING,
  },
  {
    label: 'Alimentação',
    img: require('src/assets/duck.png'),
    value: TriggerType.FOOD,
  },
  {
    label: 'Outros',
    img: require('src/assets/duck.png'),
    value: TriggerType.ANOTHER,
  },
];

const Trigger = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(triggerSchema) });

  const handleSetTriggersValues = (value: string) => {
    if (appState.episode.triggers?.includes(value)) {
      dispatch(handleFormChanging({
        triggers: Array.from(appState.episode.triggers).filter(
          (tr) => tr !== value
        ),
      }));
    } else {
      dispatch(handleFormChanging({ triggers: [...appState.episode.triggers, value] }));
    }
  };

  useEffect(() => {}, [appState.episode.triggers]);

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga quais foram os gatilhos : '>
        {data.map((act, index) => (
          <Fragment key={index}>
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
                    unfillColor='#FFFFFF00'
                    textStyle={{ textDecorationLine: 'none' }}
                    text={act.label}
                    isChecked={appState.episode.triggers?.includes(act.value)}
                    onPress={(isChecked: boolean) => {
                      handleSetTriggersValues(act.value);
                    }}
                  />
                </View>
              }
              image={act?.img}
            />
            {act.value == TriggerType.FOOD && (
              <InputContainer
                label='Qual alimento?'
                labelicon={require('src/assets/cupcake.png')}
                name='foodImpair'
                placeholder='Descreva brevemente'
                setValue={setValue}
                control={control}
                errors={errors}
                editable={appState.episode.triggers?.includes(TriggerType.FOOD)}
                className={`${
                  appState.episode.triggers?.includes(TriggerType.FOOD)
                    ? ' opacity-100'
                    : ' opacity-25'
                } bg-white drop-shadow-sm`}
                defaultValue={appState.episode.foodImpair!}
                onChange={(e) =>
                  handleFormChanging({ foodImpair: e.nativeEvent.text })
                }
              />
            )}
            {act.value == TriggerType.ANOTHER && (
              <InputContainer
                label='Qual outro fator desencadeou a dor?'
                name='anotherTrigger'
                setValue={setValue}
                control={control}
                errors={errors}
                placeholder='Descreva brevemente'
                editable={appState.episode.triggers?.includes(
                  TriggerType.ANOTHER
                )}
                className={`${
                  appState.episode.triggers?.includes(TriggerType.ANOTHER)
                    ? ' opacity-100 '
                    : ' opacity-25'
                } bg-white drop-shadow-sm`}
                defaultValue={appState.episode.anotherTrigger!}
                onChange={(e) =>
                  handleFormChanging({ anotherTrigger: e.nativeEvent.text })
                }
              />
            )}
          </Fragment>
        ))}
      </Wrapper>
    </View>
  );
};

export default Trigger;
