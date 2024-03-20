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
  const isMedicineEditable =
    episodeFormState.improvementFactor != ImprovementFactorType.MEDICINE;
  const {
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(improvementSchema) });

  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos diga o que te ajudou a melhorar'>
        <RadioButton.Group
          onValueChange={(value) =>
            handleFormChange({ improvementFactor: value })
          }
          value={episodeFormState.improvementFactor}
        >
          {data.map((act, index) => (
            <Card
              key={index}
              onPress={() => {
                handleFormChange({ improvementFactor: act.value });
              }}
              children={
                <View className='flex-row items-center'>
                  <RadioButton value={act.value} color='#CEB0FA' />
                  <Text className=''>{act.label}</Text>
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
                  name='medicine'
                  control={control}
                  errors={errors}
                  className='bg-tertiary w-full'
                  editable={!isMedicineEditable}
                  defaultValue={episodeFormState.medicine}
                  onChange={(e) =>
                    handleFormChange({ medicine: e.target.value })
                  }
                ></InputContainer>
                <InputContainer
                  label='Dosagem'
                  name='dosage'
                  control={control}
                  errors={errors}
                  className='bg-tertiary w-full'
                  editable={!isMedicineEditable}
                  defaultValue={episodeFormState.medicineDosage.toString()}
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
                      value='improved'
                      color='#CEB0FA'
                    />
                    <Text>Melhorou</Text>
                  </View>
                  <View className='flex-row items-center bg-tertiary w-full rounded-full '>
                    <RadioButton
                      disabled={isMedicineEditable}
                      value='partialImprovement'
                      color='#CEB0FA'
                    />
                    <Text>Melhorou parcialmente</Text>
                  </View>
                  <View className='flex-row items-center bg-tertiary w-full rounded-full'>
                    <RadioButton
                      disabled={isMedicineEditable}
                      value='notImproved'
                      color='#CEB0FA'
                    />
                    <Text>Não melhorou</Text>
                  </View>
                </RadioButton.Group>
              </View>
            }
          />
        </RadioButton.Group>
      </Wrapper>
      <InputContainer
        editable={
          episodeFormState.improvementFactor == ImprovementFactorType.FOOD
        }
        label='Qual alimento ajudou a melhorar?'
        name='foodImprovement'
        control={control}
        errors={errors}
        className={
          episodeFormState.improvementFactor != ImprovementFactorType.FOOD
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
