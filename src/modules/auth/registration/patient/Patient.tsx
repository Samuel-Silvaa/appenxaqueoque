  import { Text } from 'react-native';
  import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
  import { sharedStyleSheet } from '../../shared/style/stylesheet';
  import PatientForm from 'src/modules/shared/components/patientForm/PatientForm';

  import * as yup from 'yup';
  import { Form, useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { useDispatch, useSelector } from 'react-redux';
  import { authSelector, appStateSelector } from 'src/infra/app/selectors';
  import { useAsyncAppDispatch } from 'src/infra/app/store';
  import {
    requestCreatePatient,
    requestUpdatePatient,
  } from 'src/infra/app/reducers/auth.reducer';
  import { useNavigation, useRoute } from '@react-navigation/native';
  import { format } from 'date-fns';
  import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
  import ExPressable from '../../shared/components/buttons/pressable/ExPressable';
  import { useCallback, useEffect } from 'react';
  import { ToastOptions, useToast } from 'react-native-toast-notifications';
  import { setPatientData } from "src/infra/app/reducers/app.reducer";

  interface PatientSchemaProps {
    name: string;
    email: string;
    birthDate: Date;
    gender: string;
    kinship: string;
    height: number;
    weight: number;
  }

  interface RouteParams {
    avatar?: string;
    email?: string;
    isEditMode?: boolean;
  }

  const patientSchema = yup.object<PatientSchemaProps>().shape({
    name: yup.string().required('Preencha seu nome').min(5,'O Nome precisa ter ao menos 5 letras'),
    email: yup.string().email().required('Preencha seu email'),
    birthDate: yup.date().required('Preencha a data de nascimento'),
    gender: yup.string().required('Preencha o sexo'),
    kinship: yup.string().required('Preencha o parentesco'),
    height: yup.number().required('Preencha a altura').min(0.4,'A altura precisa ter no mínimo 0.40m'),
    weight: yup.number().required('Preencha o peso').min(10,'O peso precisa ser maior que 10kg').max(300, 'O peso deve ser menor que 300kg'),
    avatar: yup.string().optional(),
  });

  const Patient = () => {
    const dispatchAsync = useAsyncAppDispatch();
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const appState = useSelector(appStateSelector);
    const navigation = useNavigation();
    const route = useRoute();

    // Check if we're in edit mode
    const routeParams = route.params as RouteParams;
    const isEditMode = routeParams?.isEditMode === true;
    const patientData = appState.patient;
    const toast = useToast();

    const {
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm({
      resolver: yupResolver(patientSchema),
    });

    const onSubmitHandler =  useCallback(async (data: PatientSchemaProps) => {

        if (isEditMode && patientData?.id) {
          const res = await dispatchAsync(
            requestUpdatePatient({
              ...data,
              birthDate: format(data.birthDate, 'yyyy-MM-dd'),
              id: patientData.id,
            })
          );

          if (res.meta.requestStatus == 'rejected') {
            toast.hideAll();
            const toastOptions: ToastOptions = {
              type: 'danger',
            };
            toast.show(
              `Error inesperado ao  ${
                appState.episode.isEdition ? 'editar' : 'cadastrar'
              } paciente. Entre em contato com nosso suporte!`,
              toastOptions
            );
            return;
          } else if (res.meta.requestStatus == 'fulfilled') {
            toast.hideAll();
            const toastOptions: ToastOptions = {
              type: 'success',
            };
            toast.show(
              `Dados editados com sucesso.`,
              toastOptions
            );
            dispatch(setPatientData(res.meta.arg));
            (navigation as any).goBack();
          }
        } else {
          // Create new patient
          const res = await dispatchAsync(
            requestCreatePatient({
              ...data,
              birthDate: format(data.birthDate, 'yyyy-MM-dd'),
            })
          );

          if (res.meta.requestStatus == 'fulfilled') {
            (navigation as any).navigate('welcome');
          }
        }

    },[]);

    useEffect(() => {
      if (patientData) {
        setValue('email', patientData.email);
        setValue('name', patientData.name);
        setValue('birthDate', patientData?.birthDate ? new Date(patientData.birthDate) : new Date());
        setValue('gender', patientData.gender);
        setValue('kinship', patientData.kinship);
        setValue('weight', patientData.weight);
        setValue('height', patientData.height);
      }
      if(auth.sessionEmail){
        setValue('email', auth.sessionEmail);
      }
    }, [patientData, auth.sessionEmail]);

    const Content = () => {
      return (
        <>
          <Text className={sharedStyleSheet.title}>
            {isEditMode ? 'Editar informações' : 'Informações da conta'}
          </Text>
          <Text className={sharedStyleSheet.subtitle}>
            {isEditMode
              ? 'Atualize as informações da criança'
              : 'Insira as informações da criança'}
          </Text>

          <PatientForm
            setValue={setValue}
            errors={errors}
            isEditMode={isEditMode}
            routeParams={routeParams}
          />
        </>
      );
    };

    return !isEditMode ? (
      <AuthScaffold
        alignment='start'
        ctaPrimaryText='Cadastrar'
        ctaPrimary={
          handleSubmit(onSubmitHandler)}
      >
        <Content />
      </AuthScaffold>
    ) : (
      <AppPageScaffold hasArrowBack={true}>
        <Content></Content>
        <ExPressable title='Salvar' onPress={ handleSubmit(onSubmitHandler)} />
      </AppPageScaffold>
    );
  };

  export default Patient;
