import { ImageSourcePropType, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useApp } from 'src/infra/app/app';
import { ImprovementFactor as ImprovementFactorType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Descanso',
    value: ImprovementFactorType.SLEEP,
  },
  {
    label: 'Alimentação',
    value: ImprovementFactorType.FOOD,
  },
  {
    label: 'Medicação',
    value: ImprovementFactorType.MEDICINE,
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
  const { episodeFormState, handleFormChange } = useApp();
  const isMedicineEditable = !episodeFormState.improvementFactor?.includes(
    ImprovementFactorType.MEDICINE
  );
  const {
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(improvementSchema) });

  const handleSetImprovementFactorValues = (value: string) => {
    if (episodeFormState.improvementFactor.includes(value)) {
      handleFormChange({
        improvementFactor: Array.from(
          episodeFormState.improvementFactor
        ).filter((tr) => tr !== value),
      });
    } else {
      handleFormChange({
        improvementFactor: [...episodeFormState.improvementFactor, value],
      });
    }
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga o que te ajudou a melhorar'>
        {data.map((act, index) => (
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
                  unfillColor='#FFFFFF'
                  textStyle={{ textDecorationLine: 'none' }}
                  text={act.label}
                  isChecked={episodeFormState.triggers?.includes(act.value)}
                  onPress={(isChecked: boolean) => {
                    handleSetImprovementFactorValues(act.value);
                  }}
                />
              </View>
            }
            image={act?.img}
          />
        ))}

        <Card
          className={isMedicineEditable ? 'opacity-25' : 'opacity-100'}
          title='Você tomou algum medicamento?'
          children={
            <View className='w-full flex-col items-center'>
              <InputContainer
                label='Nome do medicamento'
                labelicon={require('assets/medicine.png')}
                name='medicine'
                control={control}
                errors={errors}
                className='bg-tertiary w-full'
                editable={!isMedicineEditable}
                defaultValue={episodeFormState.medicine}
                onChange={(e) => handleFormChange({ medicine: e.target.value })}
              ></InputContainer>
              <InputContainer
                label='Dosagem'
                name='dosage'
                control={control}
                errors={errors}
                className='bg-tertiary w-full'
                editable={!isMedicineEditable}
                defaultValue={episodeFormState.medicineDosage?.toString()}
                onChange={(e) =>
                  handleFormChange({ medicineDosage: e.target.value })
                }
              ></InputContainer>
              <Text className='font-semibold text-black my-4 text-lg'>
                Você notou alguma melhora?
              </Text>
              <RadioButton.Group
                onValueChange={(value) =>
                  handleFormChange({ medicineImprovement: value })
                }
                value={episodeFormState.medicineImprovement}
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
      </Wrapper>
      <InputContainer
        editable={episodeFormState.improvementFactor?.includes(
          ImprovementFactorType.FOOD
        )}
        label='Qual alimento ajudou a melhorar?'
        labelicon={require('assets/avocado.png')}
        name='foodImprovement'
        control={control}
        errors={errors}
        className={
          !episodeFormState.improvementFactor?.includes(
            ImprovementFactorType.FOOD
          )
            ? 'opacity-25' + ' bg-white drop-shadow-sm'
            : 'opacity-100' + ' bg-white drop-shadow-sm'
        }
        defaultValue={episodeFormState.foodImprovement}
        onChange={(e) => handleFormChange({ foodImprovement: e.target.value })}
      ></InputContainer>
    </View>
  );
};

export default ImprovementFactor;
