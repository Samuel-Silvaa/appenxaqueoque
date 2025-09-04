import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
import { useSelector } from 'react-redux';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { handleGeneratePdfReport } from 'src/infra/app/reducers/app.reducer';
import { appStateSelector } from 'src/infra/app/selectors';
import InputContainer from '../inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';
import { Report } from 'src/infra/@types/app.types';
import { useState } from 'react';
import { ToastOptions, useToast } from "react-native-toast-notifications";

const stylesheet = {
  wrapper: 'w-full',
  header: 'w-full flex-row items-center justify-between mb-4',
  arrowdown: 'flex items-center justify-center p-2',
  closeButton: 'p-3',
  inputCard:
    'w-4/5 bg-white dark:bg-d-blue-primary shadow-sm rounded-[16px] flex-col items-center jusitfy-center p-6 gap-y-2 m-auto self-center z-20 overflow-hidden',
};

const PhysicianEmailModal = ({
  isOpen,
  onClose,
  report,
}: {
  isOpen: boolean;
  onClose: () => void;
  report: Report;
}) => {
  const asyncDispatch = useAsyncAppDispatch();
  const appState = useSelector(appStateSelector);
  const {
    control,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSubmitEmailSender = async ()  => {
    if (email !== '') {
      try {
        if (report.id) {
          const res = await asyncDispatch(handleGeneratePdfReport({
            id: report.id,
            physicianEmail: email,
          }));
          
              if(res.meta.requestStatus == 'rejected') {
                  toast.hideAll();
                  const toastOptions: ToastOptions = {
                    type: 'danger',
                  };
                  toast.show(`Error inesperado ao  ${appState.episode.isEdition ? 'editar' : 'cadastrar'} episódio. Entre em contato com nosso suporte!`, toastOptions);
                  return;
              } else if(res.meta.requestStatus == 'fulfilled') {
                  toast.hideAll();
                  const toastOptions: ToastOptions = {
                    type: 'success',
                  };
                  toast.show(`Email eviado com sucesso para o endereço: ${email} `, toastOptions);
                  return; 
              }
          
        }
      } catch (err) {
        console.log(err);
      }
      onClose();
    }
  };

  return (
    <Modal
      transparent={false}
      animationType='slide'
      visible={isOpen}
      onRequestClose={() => {
        onClose();
      }}
    >
      <AppPageScaffold
        alignment='items-center'
      >
        <View className={stylesheet.header}>
          <Text className={sharedStyleSheet.title}>
            Envie um pdf do seu relatório de episódios para o seu médico.
          </Text>
          <TouchableOpacity 
            onPress={() => onClose()}
            className={stylesheet.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              className={stylesheet.arrowdown}
              source={require('src/assets/arrowdown.png')}
            ></Image>
          </TouchableOpacity>
        </View>

        <Text className={sharedStyleSheet.subtitle + ' w-3/4 m-auto my-4'}>
          Digite o email do seu médico
        </Text>
        <View className={stylesheet.inputCard}>
          <InputContainer
            label='E-mail do médico'
            inputMode='email'
            name='email'
            setValue={setEmail}
            onChangeText={(
              value: string
            ) => {
              setEmail(value);
            }}
            control={control}
            errors={errors}
          ></InputContainer>
          <ExPressable title='Enviar PDF' onPress={handleSubmitEmailSender} />
        </View>
      </AppPageScaffold>
    </Modal>
  );
};

export default PhysicianEmailModal;
