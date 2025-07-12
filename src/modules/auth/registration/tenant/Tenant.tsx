import {  Text } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAsyncAppDispatch } from "src/infra/app/store";
import {  requestLogin, requestSignup } from "src/infra/app/reducers/auth.reducer";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { authSelector } from "src/infra/app/selectors";

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
    .default('samuelsilva666@gmail.com'),
  password: yup.string().required('Preencha sua senha').default('123123'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não coincidem')
    .required('Preencha sua senha')
    .default('123123'),
});

const Tenant = () => {
  const dispatch = useAsyncAppDispatch();
  const auth = useSelector(authSelector);
  const navigation = useNavigation();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(tenantSchema),
  });

  const onSubmitHandler = async (data: TenantSchema) => {

    const res = await dispatch(requestSignup({email: data.email, password: data.password, userType: 'PATIENT'}));

      if(res.meta.requestStatus == 'fulfilled') {
            dispatch(requestLogin({
            email: res.meta.arg.email,
            password: res.meta.arg.password,
          }))
        navigation.navigate('patient' as never);
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
    </AuthScaffold>
  );
};

export default Tenant;
