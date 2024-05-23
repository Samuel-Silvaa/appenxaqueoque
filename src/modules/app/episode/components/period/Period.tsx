import { Image, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '../form/card/Card';
import { RadioButton } from 'react-native-paper';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useApp } from 'src/infra/app/app';
import Wrapper from '../form/wrapper/Wrapper';

const stylesheet = {
  wrapper: 'flex-col w-full items-center ',
  cardWrapper: 'flex-row items-center justify-center w-full ',
  cardOption:
    'flex-row items-center bg-white rounded-full w-[45%] mx-1 shadow-sm',
  notesLabel: 'text-md font-semibold text-black self-start mt-14 pl-4',
  notesWrapper:
    'flex-row w-full min-h-[140px] p-2 bg-blue-four rounded-[28px] mt-1 relative',
  notesInput: 'bg-white w-full p-4 flex-grow',
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
        <Wrapper title='Você está no período menstrual? '>
          <Card
            title='Menstruação'
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
        </Wrapper>

        <Text className={stylesheet.notesLabel}>Anotações:</Text>

        <View className={stylesheet.notesWrapper}>
          <Image
            className='absolute top-[-110px] right-0'
            source={require('src/assets/girl_laptop.png')}
          ></Image>
          <InputContainer
            name='notes'
            control={control}
            errors={errors}
            className={stylesheet.notesInput}
            numberOfLines={4}
            multiline={true}
            defaultValue={episodeFormState.periodNotes}
            onChange={(e) => handleFormChange({ periodNotes: e.target.value })}
          ></InputContainer>
        </View>
      </View>
    </RadioButton.Group>
  );
};

export default Period;
