import { Image, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '../form/card/Card';
import { RadioButton } from 'react-native-paper';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useApp } from 'src/infra/app/app';

const stylesheet = {
  wrapper: 'flex-col w-full items-center ',
  cardWrapper: 'flex-row items-center justify-center w-full ',
  cardOption: 'flex-row items-center bg-white rounded-full w-1/3 mx-1',
  notesLabel: 'text-md font-semibold text-black self-start mt-14 pl-4',
  notesWrapper: 'flex-row items-center justify-center w-full',
  notesInput: 'bg-white w-full p-4 min-h-[140px]',
};

interface PeriodSchema {
  period: string;
  periodNotes: number;
}

const periodSchema = yup.object<PeriodSchema>().shape({
  period: yup.string(),
  periodNotes: yup.number(),
});

const Period = () => {
  const { episodeFormState, handleFormChange } = useApp();
  const {
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(periodSchema) });

  return (
    <RadioButton.Group
      onValueChange={(value) => handleFormChange({ period: value })}
      value={episodeFormState.period}
    >
      <View className={stylesheet.wrapper}>
        <Card
          title='Menstruação'
          className='bg-[#000571]/10'
          children={
            <View className={stylesheet.cardWrapper}>
              <View className={stylesheet.cardOption}>
                <RadioButton value={true} color='#CEB0FA' />
                <Text>Sim</Text>
              </View>
              <View className={stylesheet.cardOption}>
                <RadioButton value={false} color='#CEB0FA' />
                <Text>Não</Text>
              </View>
            </View>
          }
        />

        <Text className={stylesheet.notesLabel}>Anotações:</Text>

        <Card
          className='bg-[#680071]/10 mt-2'
          children={
            <View className={stylesheet.notesWrapper}>
              <InputContainer
                name='notes'
                control={control}
                errors={errors}
                className={stylesheet.notesInput}
                numberOfLines={4}
                multiline={true}
                defaultValue={episodeFormState.periodNotes}
                onChange={(e) =>
                  handleFormChange({ periodNotes: e.target.value })
                }
              ></InputContainer>
            </View>
          }
        />
      </View>
    </RadioButton.Group>
  );
};

export default Period;
