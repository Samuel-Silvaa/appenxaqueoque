import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import AuthScaffold from '../../../auth/shared/components/authScaffold/AuthScaffold';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useRoute } from '@react-navigation/native';
import { requestResetPassword } from 'src/infra/app/reducers/auth.reducer';
import Card from 'src/modules/app/episode/components/form/card/Card';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector, authSelector } from 'src/infra/app/selectors';
import AppPageScaffold from '../../shared/components/appPageScaffold/AppPageScaffold';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { setPageTitle } from 'src/infra/app/reducers/app.reducer';

const stylesheet = {
  title: 'text-2xl font-bold text-dark mb-2',
  subtitle: 'text-base text-dark/80 mb-8',
  formContainer: 'gap-y-4',
};

interface SendNewPassword {
  password: string;
  confirmPassword: string;
  newPassword: string;
}

const validationSchema = yup.object({
  password: yup
    .string()
    .required('Preencha sua senha')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
    .matches(
      /[^A-Za-z0-9]/,
      'A senha deve conter pelo menos um caractere especial'
    )
    .default('Teste@123'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não coincidem')
    .required('Preencha sua senha')
    .default('Teste@123'),
  newPassword: yup
    .string()
    .required('Preencha sua senha')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
    .matches(
      /[^A-Za-z0-9]/,
      'A senha deve conter pelo menos um caractere especial'
    )
    .default('Teste@123'),
});

const ResetPassword = ({ navigation }: any) => {
  const dispatchAsync = useAsyncAppDispatch();
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const toast = useToast();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SendNewPassword>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SendNewPassword) => {
    try {
      const res = await dispatchAsync(
        requestResetPassword({
          email: appState.patient!.email,
          newPassword: data.newPassword,
          currentPassword: data.password,
        })
      );

      if (res.meta.requestStatus == 'fulfilled') {
        toast.show(res.payload!.message, { type: 'success' });
        navigation.pop();
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      dispatch(setPageTitle('Redefinir senha'));
    }, 200);
  }, []);

  return (
    <AppPageScaffold hasArrowBack>
      <View className='flex-1 w-full justify-center p-2 gap-y-2 pt-12'>
        <Card>
          <View className=' flex flex-col items-center w-full'>
            <InputContainer
              secureTextEntry={true}
              label='Digite sua senha atual'
              setValue={setValue}
              name='password'
              errors={errors}
              placeholder='Digite sua senha'
            ></InputContainer>
            <InputContainer
              secureTextEntry={true}
              label='Repita sua senha'
              setValue={setValue}
              name='confirmPassword'
              errors={errors}
              placeholder='Repita sua senha'
            ></InputContainer>
            <InputContainer
              secureTextEntry={true}
              label='Digite sua nova senha'
              setValue={setValue}
              name='newPassword'
              errors={errors}
              placeholder='Nova senha'
            ></InputContainer>
          </View>
        </Card>
        <Text className='text-md font-bold'>
          A senha deve conter pelo menos:{' '}
        </Text>
        <Text className='text-xs'>
          1 letra maiúscula {'\n'}1 letra minuscula {'\n'}1 número e {'\n'}1
          caractere especial incluindo 8 digitos{' '}
        </Text>
        <ExPressable
          title='Salvar alterações'
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </AppPageScaffold>
  );
};

export default ResetPassword;
