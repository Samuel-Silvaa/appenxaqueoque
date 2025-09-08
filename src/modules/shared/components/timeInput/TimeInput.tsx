import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useCallback, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const stylesheet = {
  view: 'w-full my-1',
  input: 'flex h-[60px] bg-gray-light rounded rounded-3xl p-4 z-20 flex-row items-center justify-between',
  label: 'pl-2 text-black text-[15px] dark:text-d-text-gray',
  error: 'text-error pl-2 font-medium',
  timeText: 'text-black text-[16px] dark:text-d-text-gray',
  placeholderText: 'text-gray-500 text-[16px] dark:text-d-text-gray',
};

interface TimeInputProps {
  label?: string;
  name: string;
  labelicon?: ImageSourcePropType;
  errors: FieldErrors<any>;
  setValue?: UseFormSetValue<any>;
  placeholder?: string;
  value?: Date | null;
  defaultValue?: Date | null;
  disabled?: boolean;
  onTimeChange?: (time: Date) => void;
  mode?: 'time' | 'date' | 'datetime';
  format?: '24h' | '12h';
  minimumDate?: Date;
  maximumDate?: Date;
  minuteInterval?: 1 | 5 | 10 | 15 | 30;
}

const TimeInput = ({
  label,
  name,
  errors,
  labelicon,
  setValue,
  placeholder = 'Selecione o horário',
  value,
  defaultValue,
  disabled = false,
  onTimeChange,
  mode = 'time',
  format = '24h',
  minimumDate,
  maximumDate,
  minuteInterval = 1,
}: TimeInputProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  const showDatePicker = () => {
    if (!disabled) {
      setDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = useCallback( (selectedTime: Date) => {
    setDisplayValue(selectedTime ? formatTime(selectedTime) : '');
    setValue!(name, selectedTime);
    hideDatePicker();

  }, [setValue]);

  const formatTime = (time: Date | null): string => {
    if (!time) return '';
    
    if (mode === 'date') {
      return time.toLocaleDateString('pt-BR');
    } else if (mode === 'datetime') {
      return time.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: format === '12h',
      });
    } else {
      // Time mode
      if (format === '12h') {
        return time.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      } else {
        return time.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      }
    }
  };

  return (
    <View className={stylesheet.view}>
      <View className='w-full flex-row justify-between items-end my-2'>
        {label && <Text className={stylesheet.label}>{label}</Text>}
        {labelicon && !disabled && (
          <Image
            source={labelicon}
            className='w-14 h-14'
            resizeMode='contain'
          />
        )}
      </View>
      
      <TouchableOpacity
        onPress={showDatePicker}
        disabled={disabled}
        className={`${stylesheet.input} ${disabled ? 'opacity-50' : ''}`}
      >
        <Text className={displayValue ? stylesheet.timeText : stylesheet.placeholderText}>
          {displayValue || placeholder}
        </Text>
        <Image
          source={require('src/assets/chart-clock.png')}
          className='w-4 h-4'
          resizeMode='contain'
        />
      </TouchableOpacity>

      {errors[name] && (
        <Text className={stylesheet.error}>
          {errors[name]?.message?.toString()}
        </Text>
      )}

      <DateTimePickerModal
        buttonTextColorIOS="#9194E9"
        locale='pt-BR'
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={value || defaultValue || new Date()}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        minuteInterval={minuteInterval}
        is24Hour={format === '24h'}
      />
    </View>
  );
};

export default TimeInput; 