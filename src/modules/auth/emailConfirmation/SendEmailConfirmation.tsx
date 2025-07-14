import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { requestSendEmailConfirmation } from 'src/infra/app/reducers/auth.reducer';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useSelector } from 'react-redux';
import { authSelector } from 'src/infra/app/selectors';
import { useRoute } from "@react-navigation/native";

const stylesheet = {
  title: 'text-2xl font-bold text-dark mb-2',
  subtitle: 'text-base text-dark/80 mb-8',
  formContainer: 'gap-y-4',
};

interface RouteParams {
  email: string;
}

interface SendEmailConfirmationSchema {
  email: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
});

const SendEmailConfirmation = ({ navigation }: any) => {
  const dispatch = useAsyncAppDispatch();
  const {  error } = useSelector(authSelector);
  const route = useRoute();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SendEmailConfirmationSchema>({
    resolver: yupResolver(validationSchema),
  });


  const onSubmit = async (data: SendEmailConfirmationSchema) => {
    try {
      const res = await dispatch(requestSendEmailConfirmation({ email: data.email }));

      if(res.meta.requestStatus == 'fulfilled'){
        navigation.navigate('confirmEmail' as never, { email: data.email } as never);
      }
 
    } catch (error) {
      console.error('Error sending email confirmation:', error);
    }
  };

  
  useEffect(() => {

    const params = route.params as RouteParams;

    if(params && params.email) {
      setValue('email', params.email);
    }
  },[])

  return (
    <AuthScaffold
      hasArrowBack
      ctaPrimary={handleSubmit(onSubmit)}
      ctaPrimaryText="Enviar email de confirmação"
    >
      <View className="flex-1 justify-center">
        <Text className={stylesheet.title}>Receber código de validação</Text>
        <Text className={stylesheet.subtitle}>
          Digite seu email para receber um código de confirmação
        </Text>

        <View className={stylesheet.formContainer}>
          <InputContainer
            control={control}
            name="email"
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            errors={errors}
            setValue={setValue}
            defaultValue={route.params && route.params.email ? route.params.email : '' }
          />

          {error && (
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          )}
        </View>
      </View>
    </AuthScaffold>
  );
};

export default SendEmailConfirmation; 