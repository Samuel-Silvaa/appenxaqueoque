import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { CloseButton } from '../closeButton/CloseButton';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  rejectLabel?: string;
  confirmLabel?: string;
  onReject?: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  rejectLabel = 'Cancelar',
  confirmLabel = 'Confirmar',
  onReject,
  onConfirm,
}: ConfirmModalProps) => {
  const handleReject = () => {
    onReject?.();
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType='fade'
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50 justify-center items-center px-6'>
        <View className='w-full bg-white dark:bg-d-blue-primary rounded-[30px] shadow-2xl shadow-blue-primary p-6'>
          <View className='w-full items-end mb-4'>
            <CloseButton onClose={onClose} />
          </View>

          <Text className='text-black dark:text-d-text-gray text-lg font-bold text-center mb-2'>
            {title}
          </Text>

          {subtitle && (
            <Text className='text-black dark:text-d-text-gray text-sm text-center mb-6 opacity-70'>
              {subtitle}
            </Text>
          )}

          <View className='flex-row gap-x-3 mt-4'>
            <TouchableOpacity
              onPress={handleReject}
              className='flex-1 rounded-full py-3 items-center justify-center border border-gray-300 bg-white dark:bg-d-blue-primary'
            >
              <Text className='text-black dark:text-d-text-gray font-semibold'>
                {rejectLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className='flex-1 rounded-full py-3 items-center justify-center bg-error'
            >
              <Text className='text-white font-semibold'>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
