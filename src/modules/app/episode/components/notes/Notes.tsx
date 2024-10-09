import { useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { useApp } from 'src/infra/app/app';
import { useNavigation } from '@react-navigation/native';
import { id } from 'date-fns/locale';

const stylesheet = {
  wrapper: 'flex-col w-full items-center justify-between',
  title: 'font-semibold text-black my-2  mb-10 mx-auto text-lg',
  label: 'text-md font-semibold text-black self-start mt-14 pl-4',
  notesWrapper:
    'flex-row w-full min-h-[140px] p-2 bg-blue-four rounded-[28px] mt-1 mb-4 relative',
  notesInput: 'bg-white w-full p-4 flex-grow',
};

interface NotesSchema {
  notes: number;
}

const notesSchema = yup.object<NotesSchema>().shape({
  notes: yup.number(),
});

const Notes = () => {
  const { episodeFormState, handleFormChange, submitEpisode } = useApp();
  const navigation = useNavigation();
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(notesSchema) });

  const handleSubmit = async () => {
    submitEpisode().then((ep) => {
      const { data } = ep;
      if (data)
        navigation.setOptions({
          ...data,
          triggers: String(data.triggers).split(','),
          improvementFactor: String(data.improvementFactor).split(','),
          symptoms: String(data.symptoms).split(','),
          haloSymptoms: String(data.haloSymptoms).split(','),
          impairFactor: String(data.impairFactor).split(','),
        });
      navigation.navigate('Success');
    });
  };

  return (
    <View className={stylesheet.wrapper}>
      <Image
        className='absolute top-[20px] right-[-20px] w-[148px] h-[148px] z-40'
        resizeMode='contain'
        source={require('src/assets/boy_magnifier.png')}
      ></Image>
      <Text className={stylesheet.title}>Estamos quase lá</Text>

      <Text className={stylesheet.label}>Alguma observação?</Text>

      <View className={stylesheet.notesWrapper}>
        <InputContainer
          className={stylesheet.notesInput}
          name='notes'
          setValue={setValue}
          control={control}
          errors={errors}
          defaultValue={episodeFormState.notes}
          numberOfLines={4}
          multiline={true}
          onChange={(e) => handleFormChange({ notes: e.target.value })}
        ></InputContainer>
      </View>

      <ExPressable
        onPress={handleSubmit}
        title='Salvar episódio'
        className='bg-[#8FD7FF] '
      />
    </View>
  );
};

export default Notes;
