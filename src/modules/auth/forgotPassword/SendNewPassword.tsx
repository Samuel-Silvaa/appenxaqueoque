import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useSelector } from 'react-redux';
import { authSelector } from 'src/infra/app/selectors';
import { useRoute } from '@react-navigation/native';
import {
  requestSendNewPasswordWithCode,
  requestSendPasswordEmailConfirmation,
} from 'src/infra/app/reducers/auth.reducer';
import Card from 'src/modules/app/episode/components/form/card/Card';
import { useToast } from 'react-native-toast-notifications';

const stylesheet = {
  title: 'text-2xl font-bold text-dark mb-2',
  subtitle: 'text-base text-dark/80 mb-8',
  formContainer: 'gap-y-4',
};

interface RouteParams {
  email: string;
  code: string;
}

interface SendNewPassword {
  password: string;
  confirmPassword: string;
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
});

const SendNewPasswordPage = ({ navigation }: any) => {
  const dispatch = useAsyncAppDispatch();
  const route = useRoute();
  const params = route.params as RouteParams;
  const toast = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SendNewPassword>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SendNewPassword) => {
    try {
      const res = await dispatch(
        requestSendNewPasswordWithCode({
          email: params.email,
          code: params.code,
          newPassword: data.password,
        })
      );

      if (res.meta.requestStatus == 'fulfilled') {
        toast.show(res.payload!.message, { type: 'success' });
        navigation.navigate('login');
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };

  return (
    <AuthScaffold
      hasArrowBack
      ctaPrimary={handleSubmit(onSubmit)}
      ctaPrimaryText='Salvar senha'
    >
      <View className='flex-1 w-full justify-center p-2 gap-y-2'>
        <Text className={stylesheet.title}>Redefinir senha</Text>
        <Card>
          <View className=' flex flex-col items-center w-full'>
            <InputContainer
              secureTextEntry={true}
              label='Digite sua nova senha'
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
          </View>
        </Card>
        <Text className='text-md font-bold'>
          A senha deve conter pelo menos:{' '}
        </Text>
        <Text className='text-xs'>
          1 letra maiúscula {'\n'}1 letra minuscula {'\n'}1 número e {'\n'}1
          caractere especial incluindo 8 digitos{' '}
        </Text>
      </View>
    </AuthScaffold>
  );
};

export default SendNewPasswordPage;
