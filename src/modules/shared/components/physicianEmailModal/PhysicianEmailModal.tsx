import {
  Image,
  Modal,
  NativeSyntheticEvent,
  Text,
  TextInputTextInputEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import AppPageScaffold from 'src/modules/app/shared/components/appPageScaffold/AppPageScaffold';
import { useApp } from 'src/infra/app/app';
import InputContainer from '../inputContainer/InputContainer';
import { useForm } from 'react-hook-form';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';
import { AppActions } from 'src/infra/app/actions';
import { Report } from 'src/infra/@types/app.types';
import { useState } from 'react';

const stylesheet = {
  wrapper: 'w-full',
  header: 'w-full flex-row items-center justify-between mb-4',
  arrowdown: 'flex items-center justify-center p-2',
  inputCard:
    'w-4/5 bg-white shadow-sm rounded-[16px] flex-col items-center jusitfy-center p-6 gap-y-2 m-auto self-center z-20 overflow-hidden',
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
  const { dispatch } = useApp();
  const {
    control,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState('');

  const handleSubmitEmailSender = () => {
    if (email !== '') {
      try {
        dispatch(AppActions.REQUEST_GENERATE_PDF_REPORT, {
          id: report.id,
          physicianEmail: email,
        });
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
        dispatch(AppActions.REQUEST_FETCH_REPORTS, {});
        onClose();
      }}
    >
      <AppPageScaffold
        alignment='items-center'
        className='h-3/4 rounded-t-[16px]'
      >
        <View className={stylesheet.header}>
          <Text className={sharedStyleSheet.title}>
            Envie um pdf do seu relatório de episódios para o seu médico.
          </Text>
          <TouchableOpacity onPress={() => onClose()}>
            <Image
              className={stylesheet.arrowdown}
              source={require('assets/arrowdown.png')}
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
            onTextInput={(
              ev: NativeSyntheticEvent<TextInputTextInputEventData>
            ) => {
              setEmail(ev.nativeEvent.previousText + ev.nativeEvent.text);
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
