import { ImageSourcePropType, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ImprovementFactor as ImprovementFactorType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Fragment } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Medicação',
    value: ImprovementFactorType.MEDICINE,
  },
  {
    label: 'Descanso',
    value: ImprovementFactorType.SLEEP,
  },
  {
    label: 'Alimentação',
    value: ImprovementFactorType.FOOD,
  },
  {
    label: 'Outros',
    value: ImprovementFactorType.ANOTHER,
  },
];

interface ImprovementSchema {
  medicine: string;
  dosage: number;
}

const improvementSchema = yup.object<ImprovementSchema>().shape({
  medicine: yup.string(),
  dosage: yup.number(),
  foodImprovement: yup.string(),
});

const ImprovementFactor = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const isMedicineEditable = !appState.episode.improvementFactor?.includes(
    ImprovementFactorType.MEDICINE
  );
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(improvementSchema) });

  const handleSetImprovementFactorValues = (value: string) => {
    if (appState.episode.improvementFactor!.includes(value)) {
      dispatch(handleFormChanging({
        improvementFactor: Array.from(
          appState.episode.improvementFactor
        ).filter((tr) => tr !== value),
      }));
    } else {
      dispatch(handleFormChanging({
        improvementFactor: [...appState.episode.improvementFactor, value],
      }));
    }
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='O que ajudou a melhorar?'>
        {data.map((act, index) => (
          <Fragment 
              key={index}
          >
            <Card
              key={index}
              onPress={() => {
                handleSetImprovementFactorValues(act.value);
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
                      handleSetImprovementFactorValues(act.value);
                    }}
                  />
                </View>
              }
              image={act?.img}
            />

            {act.value == ImprovementFactorType.MEDICINE && (
              <Card
                key={`subcard-${index}`}
                className={isMedicineEditable ? 'opacity-25' : 'opacity-100'}
                title='Você tomou algum medicamento?'
                children={
                  <View className='w-full flex-col items-center'>
                    <InputContainer
                      label='Nome do medicamento'
                      labelicon={require('src/assets/medicine.png')}
                      name='medicine'
                      setValue={setValue}
                      control={control}
                      errors={errors}
                      className='bg-tertiary w-full'
                      editable={!isMedicineEditable}
                      defaultValue={appState.episode.medicine!}
                      onChange={(e) =>
                        handleFormChanging({ medicine: e.nativeEvent.text })
                      }
                    ></InputContainer>
                    <InputContainer
                      label='Dosagem'
                      name='dosage'
                      setValue={setValue}
                      control={control}
                      errors={errors}
                      className='bg-tertiary w-full'
                      editable={!isMedicineEditable}
                      defaultValue={appState.episode.medicineDosage?.toString()}
                      onChange={(e) =>
                        handleFormChanging({ medicineDosage: e.nativeEvent.text })
                      }
                    ></InputContainer>
                    <Text className='font-semibold text-black my-4 text-lg'>
                      Você notou alguma melhora?
                    </Text>
                    <RadioButton.Group
                      onValueChange={(value) =>
                        handleFormChanging({ medicineImprovement: value })
                      }
                      value={appState.episode.medicineImprovement!}
                    >
                      <View className='flex-row items-center bg-tertiary w-full rounded-full'>
                        <RadioButton
                          disabled={isMedicineEditable}
                          value='Melhorou'
                          color='#CEB0FA'
                        />
                        <Text>Melhorou</Text>
                      </View>
                      <View className='flex-row items-center bg-tertiary w-full rounded-full '>
                        <RadioButton
                          disabled={isMedicineEditable}
                          value='Melhorou parcialmente'
                          color='#CEB0FA'
                        />
                        <Text>Melhorou parcialmente</Text>
                      </View>
                      <View className='flex-row items-center bg-tertiary w-full rounded-full'>
                        <RadioButton
                          disabled={isMedicineEditable}
                          value='Não melhorou'
                          color='#CEB0FA'
                        />
                        <Text>Não melhorou</Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                }
              />
            )}
            {act.value == ImprovementFactorType.FOOD &&
              !appState.episode.improvementFactor?.includes(
                ImprovementFactorType.FOOD
              ) && (
                <InputContainer
                  editable={appState.episode.improvementFactor?.includes(
                    ImprovementFactorType.FOOD
                  )}
                  setValue={setValue}
                  label='Qual alimento ajudou a melhorar?'
                  labelicon={require('src/assets/avocado.png')}
                  name='foodImprovement'
                  control={control}
                  errors={errors}
                  placeholder='Descreva brevemente'
                  className={
                    !appState.episode.improvementFactor?.includes(
                      ImprovementFactorType.FOOD
                    )
                      ? 'opacity-25' + ' bg-white drop-shadow-sm'
                      : 'opacity-100' + ' bg-white drop-shadow-sm'
                  }
                  defaultValue={appState.episode.foodImprovement!}
                  onChange={(e) =>
                    handleFormChanging({ foodImprovement: e.nativeEvent.text })
                  }
                />
              )}
            {act.value == ImprovementFactorType.ANOTHER &&
              !appState.episode.improvementFactor?.includes(
                ImprovementFactorType.ANOTHER
              ) && (
                <InputContainer
                  editable={appState.episode.improvementFactor?.includes(
                    ImprovementFactorType.ANOTHER
                  )}
                  setValue={setValue}
                  label='Qual outro fator de melhora?'
                  name='anotherImprovementFactor'
                  control={control}
                  errors={errors}
                  placeholder='Descreva brevemente'
                  className={
                    !appState.episode.improvementFactor?.includes(
                      ImprovementFactorType.ANOTHER
                    )
                      ? 'opacity-25' + ' bg-white drop-shadow-sm'
                      : 'opacity-100' + ' bg-white drop-shadow-sm'
                  }
                  defaultValue={appState.episode.anotherImprovementFactor!}
                  onChange={(e) =>
                    handleFormChanging({
                      anotherImprovementFactor: e.nativeEvent.text,
                    })
                  }
                />
              )}
          </Fragment>
        ))}
      </Wrapper>
    </View>
  );
};

export default ImprovementFactor;
