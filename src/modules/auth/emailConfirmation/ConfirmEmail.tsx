import React, { useEffect, useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { requestConfirmEmail } from 'src/infra/app/reducers/auth.reducer';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { useSelector } from 'react-redux';
import { authSelector } from 'src/infra/app/selectors';
import { Loader } from 'src/modules/shared/components/loader/Loader';

const stylesheet = {
  title: 'text-2xl font-bold text-white mb-2',
  subtitle: 'text-base text-white/80 mb-8',
  successTitle: 'text-2xl font-bold text-green-400 mb-2',
  errorTitle: 'text-2xl font-bold text-red-400 mb-2',
};

interface RouteParams {
  token: string;
  email: string;
}

const ConfirmEmail = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useAsyncAppDispatch();
  const { loading, error } = useSelector(authSelector);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const params = route.params as RouteParams;
        
        if (!params.token || !params.email) {
          setStatus('error');
          Alert.alert(
            'Erro',
            'Link de confirmação inválido. Token ou email não encontrado.',
            [{ text: 'OK', onPress: () => navigation.navigate('login') }]
          );
          return;
        }

        await dispatch(requestConfirmEmail({
          token: params.token,
          email: params.email,
        }));

        setStatus('success');
        Alert.alert(
          'Email confirmado!',
          'Seu email foi confirmado com sucesso. Você pode fazer login agora.',
          [{ text: 'OK', onPress: () => navigation.navigate('login') }]
        );
      } catch (error) {
        console.error('Error confirming email:', error);
        setStatus('error');
        Alert.alert(
          'Erro',
          'Não foi possível confirmar seu email. Tente novamente.',
          [{ text: 'OK', onPress: () => navigation.navigate('login') }]
        );
      }
    };

    confirmEmail();
  }, []);

  if (loading || status === 'loading') {
    return (
      <AuthScaffold>
        <View className="flex-1 justify-center items-center">
          <Loader />
          <Text className="text-white mt-4">Confirmando email...</Text>
        </View>
      </AuthScaffold>
    );
  }

  if (status === 'success') {
    return (
      <AuthScaffold>
        <View className="flex-1 justify-center items-center">
          <Text className={stylesheet.successTitle}>Email confirmado!</Text>
          <Text className={stylesheet.subtitle}>
            Seu email foi confirmado com sucesso. Você pode fazer login agora.
          </Text>
        </View>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold>
      <View className="flex-1 justify-center items-center">
        <Text className={stylesheet.errorTitle}>Erro na confirmação</Text>
        <Text className={stylesheet.subtitle}>
          Não foi possível confirmar seu email. Tente novamente.
        </Text>
        {error && (
          <Text className="text-red-500 text-sm text-center mt-4">{error}</Text>
        )}
      </View>
    </AuthScaffold>
  );
};

export default ConfirmEmail; 