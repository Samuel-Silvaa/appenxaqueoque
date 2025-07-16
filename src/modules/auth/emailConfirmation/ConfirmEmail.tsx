import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Alert, TouchableOpacity, TextInput } from 'react-native';
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
import { useApp } from 'src/infra/app/app';
import { Image } from 'react-native';
import { requestLogin } from 'src/infra/app/reducers/auth.reducer';
import { handleFecthPatient } from 'src/infra/app/reducers/app.reducer';
import * as SecureStore from 'expo-secure-store';
import { appStateSelector } from 'src/infra/app/selectors';

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
  password?: string;
}

const ConfirmEmail = () => {
  const { handleToast } = useApp();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useAsyncAppDispatch();
  const { loading, error } = useSelector(authSelector);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [timer, setTimer] = useState(30);
  const auth = useSelector(authSelector);

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  useEffect(() => {
    countdownTimer();
    const params = route.params as RouteParams;
    if (!params.email) {
      setStatus('error');

      handleToast('Email não cadastrado!', 'danger');
    }
  }, []);

  const handleDigitChange = (value: string, idx: number) => {
    if (!/^[0-9]*$/.test(value)) return; // Only allow digits
    const newDigits = [...digits];
    newDigits[idx] = value.slice(-1); // Only last digit
    setDigits(newDigits);

    // Move to next input if filled
    if (value && idx < 5) {
      inputRefs[idx + 1].current?.focus();
    }
    // Move to previous input if deleted
    if (!value && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    }
  };

  const onSubmit = async () => {
    const token = digits.join('');
    if (token.length !== 6) {
      handleToast('Preencha todos os dígitos do código!', 'danger');
      return;
    }
    try {
      const params = route.params as RouteParams;
      const res = await dispatch(
        requestConfirmEmail({
          token,
          email: params.email.toLowerCase(),
        })
      );
      if (res.meta.requestStatus == 'fulfilled') {
        // Automatic login after email confirmation
        if (params.password) {
          const loginRes = await dispatch(
            requestLogin({
              email: params.email.toLowerCase(),
              password: params.password,
            })
          );
          if (loginRes.meta.requestStatus === 'fulfilled') {
            // Fetch patient by userId from SecureStore
            console.log(auth.user!.id!);

            if (auth.user!.id!) {
              const patientRes = await dispatch(handleFecthPatient(auth.user!.id!));
              // If patient is not found or not populated, go to avatar selection
              const patient: any = patientRes.payload;
              console.log(patientRes);
              if (!patient || !patient.id || !patient.name) {
                setStatus('success'); // triggers avatar selection
              } else {
                navigation.navigate('welcome');
              }
            } else {
              setStatus('success'); // fallback to avatar selection
            }
          } else {
            setStatus('error');
          }
        } else {
          setStatus('success');
        }
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
          const params = route.params as RouteParams;
          navigation.navigate('avatarSelection' as never, {email: params!.email });
        }}
        ctaPrimaryText='Continuar'
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
          setDigits(['', '', '', '', '', '']);
          setStatus('idle')
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
      ctaPrimary={onSubmit}
      ctaPrimaryText='Confirmar Email'
    >
      <View className='flex-1 justify-center'>
        <Text className={stylesheet.title}>Confirmar Email</Text>
        <Text className={stylesheet.subtitle}>
          Digite o código de 6 dígitos enviado para seu email
        </Text>

        <View className={stylesheet.formContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            {digits.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={inputRefs[idx]}
                value={digit}
                onChangeText={value => handleDigitChange(value, idx)}
                keyboardType="numeric"
                maxLength={1}
                style={{
                  width: 53,
                  height: 53,
                  marginHorizontal: 3,
                  textAlign: 'center',
                  fontSize: 24,
                  backgroundColor: 'white',
                }}
                className="rounded-full"
                returnKeyType={idx === 5 ? 'done' : 'next'}
                onSubmitEditing={onSubmit}
              />
            ))}
          </View>

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
