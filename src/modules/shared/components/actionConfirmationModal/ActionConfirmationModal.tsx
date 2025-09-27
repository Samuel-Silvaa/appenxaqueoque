import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import ExPressable from 'src/modules/auth/shared/components/buttons/pressable/ExPressable';
import { sharedStyleSheet } from 'src/modules/auth/shared/style/stylesheet';
import { useToast } from 'react-native-toast-notifications';
import { CloseButton } from '../closeButton/CloseButton';

const stylesheet = {
  header: ' w-[90%] flex items-start justify-start  grow',
  arrowdown: 'flex items-center justify-center p-2 w-5 h-5 ',
  closeButton: 'flex absolute right-5 top-6',
};

const ActionConfirmationModal = ({
  isOpen,
  onClose,
  desc,
  ctaTitle = 'Confirmar',
  submitAction,
}: {
  isOpen: boolean;
  onClose: () => void;
  desc?: string;
  ctaTitle?: string;
  submitAction: () => void;
}) => {
  const {
    formState: { errors },
  } = useForm();

  const toast = useToast();

  return (
    <Modal
      transparent={true}
      animationType='fade'
      visible={isOpen}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View className='flex-1 bg-black/50 justify-center items-center'>
        <View className='w-3/4 min-h-[250px] z-999 m-auto bg-white dark:bg-blue-primary-dark rounded-[30px] shadow-2xl shadow-blue-primary dark:shadow-blue-primary-dark flex items-center justify-between p-6 relative'>
          <View className='mb-6 w-full items-end'>
            <CloseButton onClose={onClose} />
          </View>
          <View className={stylesheet.header}>
            <Text
              className={sharedStyleSheet.subtitle.concat(
                ' text-center font-bold w-[100%]'
              )}
            >
              Deseja realmente prosseguir ?
            </Text>
            {desc && (
              <Text
                className={sharedStyleSheet.subtitle.concat(
                  ' text-sm font-thin text-center'
                )}
              >
                {desc}
              </Text>
            )}
          </View>

          <ExPressable title={ctaTitle} onPress={submitAction} />
        </View>
      </View>
    </Modal>
  );
};

export default ActionConfirmationModal;
