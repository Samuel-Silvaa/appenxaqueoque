import { ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trigger as TriggerType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector } from 'src/infra/app/selectors';
import { handleFormChanging } from 'src/infra/app/reducers/app.reducer';

interface TriggerSchema {
  foodImpair: string;
  anotherTrigger: string;
}

const triggerSchema = yup.object<TriggerSchema>().shape({
  foodImpair: yup.string(),
  anotherTrigger: yup.string(),
});

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Sono irregular',
    value: TriggerType.JAGGEDSLEEP,
  },
  {
    label: 'Fatores emocionais',
    value: TriggerType.EMOTIONAL,
  },
  {
    label: 'Excesso de tela.',
    value: TriggerType.VISUALEFFORT,
  },
  {
    label: 'Jejum prolongado',
    value: TriggerType.FASTING,
  },
  {
    label: 'Alimentação',
    value: TriggerType.FOOD,
  },
  {
    label: 'Outros',
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

  const handleSetTriggersValues = useCallback((value: string) => {
    // Ensure triggers is always an array
    const currentTriggers = Array.isArray(appState.episode.triggers)
      ? appState.episode.triggers 
      : appState.episode.triggers ? appState.episode.triggers.split(",").filter((value) => value != '') : [ ];

    if (currentTriggers.includes(value)) {
      dispatch(
        handleFormChanging({
          triggers: currentTriggers.filter((tr) => tr !== value),
          foodImpair: value == TriggerType.FOOD ? '' : appState.episode!.foodImpair,
          anotherTrigger: value == TriggerType.ANOTHER ? '' : appState.episode!.anotherTrigger,
        })
      );
      if(value == TriggerType.FOOD) {
        setValue('foodImpair', '');
      }
      if(value == TriggerType.ANOTHER) {
        setValue('anotherTrigger', '');
      }
    } else {
      dispatch(handleFormChanging({ triggers: [...currentTriggers, value] }));
    }
  }, [appState.episode.anotherTrigger, appState.episode.foodImpair]);


  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga quais foram os gatilhos : '>
        {data.map((act, index) => (
          <Fragment key={index}>
            <Card
              key={index}
              children={
                <View className='flex-row items-center '>
                  <BouncyCheckbox
                    size={22}
                    fillColor='#CEB0FA'
                    unfillColor='#FFFFFF00'
                    textStyle={{
                      flexWrap: 'wrap',
                      overflow: 'hidden',
                      padding: 4,
                    }}
                    text={act.label}
                    isChecked={
                      appState.episode.triggers ? 
                      appState.episode.triggers && appState.episode.triggers!.includes(act.value) : false
                    }
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
                editable={
                  appState.episode.triggers && appState.episode.triggers!.includes(TriggerType.FOOD)
                }
                className={`${
                  appState.episode.triggers && appState.episode.triggers!.includes(TriggerType.FOOD)
                    ? ' opacity-100'
                    : ' opacity-25'
                } bg-white drop-shadow-sm`}
                defaultValue={appState.episode.foodImpair!}
                onChange={(e) =>
                  dispatch(
                    handleFormChanging({ foodImpair: e.nativeEvent.text })
                  )
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
                editable={
                  appState.episode.triggers && appState.episode.triggers!.includes(TriggerType.ANOTHER)
                }
                className={`${
                  appState.episode.triggers && appState.episode.triggers!.includes(TriggerType.ANOTHER)
                    ? ' opacity-100 '
                    : ' opacity-25'
                } bg-white drop-shadow-sm`}
                defaultValue={appState.episode.anotherTrigger!}
                onChange={(e) =>
                  dispatch(
                    handleFormChanging({ anotherTrigger: e.nativeEvent.text })
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

export default Trigger;
