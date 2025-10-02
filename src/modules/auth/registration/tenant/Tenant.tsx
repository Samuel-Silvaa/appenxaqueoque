import { Text } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import {
  requestLogin,
  requestSignup,
} from 'src/infra/app/reducers/auth.reducer';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { authSelector } from 'src/infra/app/selectors';

interface TenantSchema {
  email: string;
  password: string;
  confirmPassword: string;
}

const tenantSchema = yup.object<TenantSchema>().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Preencha seu email')
    .default(''),
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
    .default(''),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não coincidem')
    .required('Preencha sua senha')
    .default(''),
});

const Tenant = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const dispatch = useAsyncAppDispatch();
  const auth = useSelector(authSelector);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(tenantSchema),
  });

  const onSubmitHandler = async (data: TenantSchema) => {
    const res = await dispatch(
      requestSignup({
        email: data.email,
        password: data.password,
        userType: 'PATIENT',
      })
    );

    if (res.meta.requestStatus == 'fulfilled') {
      dispatch(
        requestLogin({
          email: res.meta.arg.email,
          password: res.meta.arg.password,
        })
      );
      navigation.navigate(
        'sendEmailConfirmation' as never,
        { email: data.email, password: data.password } as never
      );
    }
  };

  return (
    <AuthScaffold
      alignment='start'
      ctaPrimaryText='Continuar'
      ctaPrimary={handleSubmit(onSubmitHandler)}
    >
      <Text className={sharedStyleSheet.title}>Cadastre-se</Text>
      <Text className={sharedStyleSheet.subtitle}>
        Informe seu e-mail e crie uma senha
      </Text>

      <InputContainer
        keyboardType='email-address'
        label='E-mail'
        name='email'
        setValue={setValue}
        errors={errors}
        placeholder='Digite seu e-mail'
      ></InputContainer>
      <InputContainer
        secureTextEntry={true}
        label='Crie uma senha'
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

      <Text className='text-md font-bold'>
        A senha deve conter pelo menos:{' '}
      </Text>
      <Text className='text-xs'>
        1 letra maiúscula {'\n'}1 letra minuscula {'\n'}1 número e {'\n'}1
        caractere especial incluindo 8 digitos{' '}
      </Text>
    </AuthScaffold>
  );
};

export default Tenant;
