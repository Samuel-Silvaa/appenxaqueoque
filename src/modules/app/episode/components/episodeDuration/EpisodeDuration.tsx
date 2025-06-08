import { View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Card from '../form/card/Card';

const durationSchema = yup.object<{ start: string; end: string }>().shape({
  start: yup.string(),
  end: yup.string(),
});

const EpisodeDuration = () => {
  const {
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(durationSchema),
  });

  return (
    <View className='h-full w-full'>
      <Wrapper title='Quanto tempo durou a dor ?'>
        <Card
          children={
            <View className="w-full">
              <InputContainer
                keyboardType='numeric'
                label='Início da dor:'
                name='start'
                setValue={setValue}
                errors={errors}
                placeholder='14:00'
              ></InputContainer>

              <InputContainer
                keyboardType='numeric'
                label='Término da dor:'
                name='end'
                setValue={setValue}
                errors={errors}
                placeholder='16:00'
              ></InputContainer>
            </View>
          }
        ></Card>
      </Wrapper>
    </View>
  );
};

export default EpisodeDuration;
