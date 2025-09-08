import { FieldErrors, UseFormSetValue, Control, Controller } from 'react-hook-form';
import { useState } from 'react';
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

interface TimeInputWithValidationProps {
  label?: string;
  name: string;
  labelicon?: ImageSourcePropType;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  placeholder?: string;
  disabled?: boolean;
  onTimeChange?: (time: Date) => void;
  mode?: 'time' | 'date' | 'datetime';
  format?: '24h' | '12h';
  minimumDate?: Date;
  maximumDate?: Date;
  minuteInterval?: 1 | 5 | 10 | 15 | 30;
  required?: boolean;
}

const TimeInputWithValidation = ({
  label,
  name,
  errors,
  labelicon,
  setValue,
  control,
  placeholder = 'Selecione o horário',
  disabled = false,
  onTimeChange,
  mode = 'time',
  format = '24h',
  minimumDate,
  maximumDate,
  minuteInterval = 1,
  required = false,
}: TimeInputWithValidationProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    if (!disabled) {
      setDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

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
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const displayValue = value ? formatTime(value) : '';

        const handleConfirm = (selectedTime: Date) => {
          onChange(selectedTime);
          setValue(name, selectedTime);
          onTimeChange?.(selectedTime);
          hideDatePicker();
        };

        return (
          <View className={stylesheet.view}>
            <View className='w-full flex-row justify-between items-end my-2'>
              {label && (
                <Text className={stylesheet.label}>
                  {label}
                  {required && <Text className='text-error'> *</Text>}
                </Text>
              )}
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
              locale='pt-BR'
              isVisible={isDatePickerVisible}
              mode={mode}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={value || new Date()}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              minuteInterval={minuteInterval}
              is24Hour={format === '24h'}
            />
          </View>
        );
      }}
    />
  );
};

export default TimeInputWithValidation; 