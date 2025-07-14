import React, { useEffect, useState } from 'react';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import {
  requestConfirmEmail,
  requestSendEmailConfirmation,
} from 'src/infra/app/reducers/auth.reducer';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useSelector } from 'react-redux';
import { authSelector } from 'src/infra/app/selectors';
import { Loader } from 'src/modules/shared/components/loader/Loader';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useApp } from 'src/infra/app/app';
import { Image } from 'react-native';

const stylesheet = {
  title: 'text-black dark:text-d-text-gray text-2xl font-bold  mb-2',
  subtitle: 'text-base text-black dark:text-d-text-gray mb-8 text-center p-6',
  successTitle:
    'text-black dark:text-d-text-graytext-2xl font-bold text-green-400 mb-2 text-lg',
  errorTitle: 'text-2xl font-bold text-red-400 mb-2',
  formContainer: 'gap-y-4',
  codeInput:
    'text-center text-2xl font-bold text-white bg-white/10 rounded-lg p-4 mb-4',
};

interface RouteParams {
  email: string;
}

interface ConfirmEmailSchema {
  token: string;
}

const validationSchema = yup.object({
  token: yup
    .string()
    .length(6, 'O código deve ter 6 dígitos')
    .matches(/^\d+$/, 'O código deve conter apenas números')
    .required('Código é obrigatório'),
});

const ConfirmEmail = () => {
  const { handleToast } = useApp();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useAsyncAppDispatch();
  const { loading, error } = useSelector(authSelector);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [timer, setTimer] = useState(30);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConfirmEmailSchema>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    countdownTimer();
    const params = route.params as RouteParams;
    if (!params.email) {
      setStatus('error');

      handleToast('Email não cadastrado!', 'danger');
    }
  }, []);

  const onSubmit = async (data: ConfirmEmailSchema) => {
    try {
      const params = route.params as RouteParams;

      const res = await dispatch(
        requestConfirmEmail({
          token: data.token,
          email: params.email.toLowerCase(),
        })
      );

      if (res.meta.requestStatus == 'fulfilled') {
        setStatus('success');
      } else if (res.meta.requestStatus == 'rejected') {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error confirming email:', error);
      setStatus('error');
    }
  };

  const countdownTimer = () => {
    setTimer(30);
    setInterval(() => {
      if(timer > 0)
      setTimer((prevState) => prevState - 1);
    }, 1000)
  }

  const handleResendConfirmationCode = async () => {
    try {
      const params = route.params as RouteParams;
      const res = await dispatch(
        requestSendEmailConfirmation({ email: params.email })
      );

      countdownTimer();

      if (res.meta.requestStatus == 'fulfilled') {
        handleToast('Código enviado com sucesso. Verifique sua caixa de entrada e lixo eletrônico.', 'sucess')
      }
    } catch (error) {
      console.error('Error sending email confirmation:', error);
    }
  };


  if (status === 'success') {
    return (
      <AuthScaffold
        ctaPrimary={() => {
          navigation.navigate('login');
        }}
        ctaPrimaryText='Login'
      >
        <View className='flex-1 justify-center items-center'>
          <Image source={require('src/assets/welcome.png')} />
          <Text className={stylesheet.subtitle}>
            Email confirmado com sucesso.
          </Text>
        </View>
      </AuthScaffold>
    );
  }

  if (status === 'error') {
    return (
      <AuthScaffold
        ctaPrimary={() => {
          setStatus('idle');
          setValue('token', '');
        }}
        ctaPrimaryText='Tentar novamente'
      >
        <View className='flex-1 justify-center items-center'>
        <Image source={require('src/assets/arthur_lego.png')} />
          <Text className={stylesheet.subtitle}>
            Não foi possível confirmar seu email. Tente novamente ou entre em
            contato com o suporte.
          </Text>
        </View>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      hasArrowBack
      ctaPrimary={handleSubmit(onSubmit)}
      ctaPrimaryText='Confirmar Email'
    >
      <View className='flex-1 justify-center'>
        <Text className={stylesheet.title}>Confirmar Email</Text>
        <Text className={stylesheet.subtitle}>
          Digite o código de 6 dígitos enviado para seu email
        </Text>

        <View className={stylesheet.formContainer}>
          <InputContainer
            control={control}
            name='token'
            placeholder='000000'
            keyboardType='numeric'
            maxLength={6}
            autoCapitalize='none'
            errors={errors}
            setValue={setValue}
          />

          <TouchableOpacity
            disabled={timer > 0}
            onPress={() => {
              handleResendConfirmationCode();
            }}
          >
           
            <Text className={stylesheet.subtitle}>  {timer > 0  && (
            <Text>Aguarde {timer} segundos  para</Text> )} Reenviar o código</Text>
          </TouchableOpacity>

          {error && (
            <Text className='text-red-500 text-sm text-center'>{error}</Text>
          )}
        </View>
      </View>
    </AuthScaffold>
  );
};

export default ConfirmEmail;
