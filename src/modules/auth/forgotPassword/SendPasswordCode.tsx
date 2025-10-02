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
import { requestSendPasswordEmailConfirmation } from 'src/infra/app/reducers/auth.reducer';

const stylesheet = {
  title: 'text-2xl font-bold text-dark mb-2',
  subtitle: 'text-base text-dark/80 mb-8',
  formContainer: 'gap-y-4',
};

interface RouteParams {
  email: string;
  password?: string;
}

interface SendPasswordCode {
  email: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
});

const SendPasswordCodePage = ({ navigation }: any) => {
  const dispatch = useAsyncAppDispatch();
  const { error } = useSelector(authSelector);
  const route = useRoute();
  const params = route.params as RouteParams;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SendPasswordCode>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SendPasswordCode) => {
    try {
      const res = await dispatch(
        requestSendPasswordEmailConfirmation({ email: data.email })
      );

      if (res.meta.requestStatus == 'fulfilled') {
        navigation.navigate(
          'confirmEmail' as never,
          { email: data.email, isPasswordConfirmation: true } as never
        );
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };

  useEffect(() => {
    if (params && params.email) {
      setValue('email', params.email);
    }
  }, []);

  return (
    <AuthScaffold
      hasArrowBack
      ctaPrimary={handleSubmit(onSubmit)}
      ctaPrimaryText='Enviar código de validação'
    >
      <View className='flex-1 justify-center'>
        <Text className={stylesheet.title}>Código de redefinição de senha</Text>
        <Text className={stylesheet.subtitle}>
          Um código será enviado para o email informado.
        </Text>

        <View className={stylesheet.formContainer}>
          <InputContainer
            control={control}
            name='email'
            placeholder='Digite seu email'
            keyboardType='email-address'
            autoCapitalize='none'
            errors={errors}
            setValue={setValue}
            defaultValue={params && params.email ? params.email : ''}
          />

          {error && (
            <Text className='text-red-500 text-sm text-center'>{error}</Text>
          )}

          <Text className={stylesheet.subtitle.concat(' text-xs')}>
            Pule esta etapa caso já tenha recebido um código de verificação.
          </Text>
        </View>
      </View>
    </AuthScaffold>
  );
};

export default SendPasswordCodePage;
