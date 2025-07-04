import React, { useState } from 'react';
import { Text, View, Alert } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { requestSendEmailConfirmation } from 'src/infra/app/reducers/auth.reducer';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useSelector } from 'react-redux';
import { authSelector } from 'src/infra/app/selectors';

const stylesheet = {
  title: 'text-2xl font-bold text-dark mb-2',
  subtitle: 'text-base text-dark/80 mb-8',
  formContainer: 'gap-y-4',
};

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
  const { loading, error } = useSelector(authSelector);
  const [isSuccess, setIsSuccess] = useState(false);

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
      await dispatch(requestSendEmailConfirmation({ email: data.email }));
      setIsSuccess(true);
      Alert.alert(
        'Email enviado!',
        'Verifique sua caixa de entrada e clique no link de confirmação.',
        [{ text: 'OK', onPress: () => navigation.navigate('login') }]
      );
    } catch (error) {
      console.error('Error sending email confirmation:', error);
    }
  };

  if (isSuccess) {
    return (
      <AuthScaffold>
        <View className="flex-1 justify-center items-center">
          <Text className={stylesheet.title}>Email enviado!</Text>
          <Text className={stylesheet.subtitle}>
            Verifique sua caixa de entrada e clique no link de confirmação.
          </Text>
        </View>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      hasArrowBack
      ctaPrimary={handleSubmit(onSubmit)}
      ctaPrimaryText="Enviar email de confirmação"
    >
      <View className="flex-1 justify-center">
        <Text className={stylesheet.title}>Confirmar Email</Text>
        <Text className={stylesheet.subtitle}>
          Digite seu email para receber um link de confirmação
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