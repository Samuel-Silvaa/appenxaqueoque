import { KeyboardAvoidingView, Text } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'src/infra/auth/auth';
import { AuthenticationActions } from 'src/infra/auth/auth.actions';

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
    .default('mari465@gmail.com'),
  password: yup.string().required('Preencha sua senha').default('123123'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não coincidem')
    .required('Preencha sua senha')
    .default('123123'),
});

const Tenant = () => {
  const { dispatch } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(tenantSchema),
  });

  const onSubmitHandler = (data: TenantSchema) => {
    dispatch(AuthenticationActions.REQUEST_SIGNUP, data);
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
        keyboardType='email-address'
        label='Crie uma senha'
        setValue={setValue}
        name='password'
        errors={errors}
        placeholder='Digite sua senha'
      ></InputContainer>
      <InputContainer
        keyboardType='email-address'
        label='Repita sua senha'
        setValue={setValue}
        name='confirmPassword'
        errors={errors}
        placeholder='Repita sua senha'
      ></InputContainer>
    </AuthScaffold>
  );
};

export default Tenant;
