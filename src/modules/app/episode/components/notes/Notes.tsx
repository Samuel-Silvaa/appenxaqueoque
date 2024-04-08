import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import Card from '../form/card/Card';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { useApp } from 'src/infra/app/app';

const stylesheet = {
  wrapper: 'flex-col w-full items-center justify-between',
  title: 'font-semibold text-black my-2 mx-auto text-lg',
  label: 'text-md font-semibold text-black self-start mt-14 pl-4',
  inputWrapper: 'flex-row items-center justify-center w-full',
};

interface NotesSchema {
  notes: number;
}

const notesSchema = yup.object<NotesSchema>().shape({
  notes: yup.number(),
});

const Notes = () => {
  const { episodeFormState, handleFormChange, submitEpisode } = useApp();

  const {
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(notesSchema) });

  return (
    <View className={stylesheet.wrapper}>
      <Text className={stylesheet.title}>Estamos quase lá</Text>

      <Text className={stylesheet.label}>Alguma observação?</Text>

      <Card
        className='bg-[#000571]/10 mt-2'
        children={
          <View className={stylesheet.inputWrapper}>
            <InputContainer
              name='notes'
              control={control}
              errors={errors}
              defaultValue={episodeFormState.notes}
              className='bg-white w-full p-4 min-h-[140px] my-0'
              numberOfLines={4}
              multiline={true}
              onChange={(e) => handleFormChange({ notes: e.target.value })}
            ></InputContainer>
          </View>
        }
      />
      <ExPressable
        onPress={submitEpisode}
        title='Salvar cadastro'
        className='bg-[#8FD7FF] '
      />
    </View>
  );
};

export default Notes;
