import { Text } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface TenantSchema {
  email: string;
  password: string;
  confirmPassword: string;
}

const tenantSchema = yup.object<TenantSchema>().shape({
  email: yup.string().email('Email inválido').required('Preencha seu email'),
  password: yup.string().required('Preencha sua senha'),
  confirmPassword: yup.string().required('Preencha sua senha'),
});

const Tenant = ({ navigation }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(tenantSchema),
  });

  const onSubmitHandler = (data: TenantSchema) => {
    console.log({ data });
    navigation.navigate('welcome');
    reset();
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
        control={control}
        errors={errors}
      ></InputContainer>
      <InputContainer
        keyboardType='email-address'
        label='Crie uma senha'
        name='password'
        control={control}
        errors={errors}
      ></InputContainer>
      <InputContainer
        keyboardType='email-address'
        label='Repita sua senha'
        name='confirmPassword'
        control={control}
        errors={errors}
      ></InputContainer>
    </AuthScaffold>
  );
};

export default Tenant;
