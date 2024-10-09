import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import {
  Image,
  ImageSourcePropType,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

const stylesheet = {
  view: 'w-full my-1 ',
  input: 'flex h-[60px] bg-gray-light rounded rounded-3xl p-4 z-20',
  label: 'pl-2 text-black text-[15px]',
  error: 'text-error pl-2 font-medium',
};

interface InputContainerProps extends TextInputProps {
  label?: string;
  name: string;
  labelicon?: ImageSourcePropType;
  control?: Control<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
}

const InputContainer = ({
  label,
  control,
  name,
  errors,
  labelicon,
  setValue,
  ...rest
}: InputContainerProps) => {
  return (
    <View className={stylesheet.view}>
      <View className='w-full flex-row justify-between items-end my-2'>
        {label && <Text className={stylesheet.label}>{label}</Text>}
        {labelicon && rest.editable && (
          <Image
            source={labelicon}
            className='w-14 h-14'
            resizeMode='contain'
          ></Image>
        )}
      </View>
      <TextInput
        onChangeText={(text) => setValue(name, text)}
        id={name}
        className={stylesheet.input}
        {...rest}
      ></TextInput>
      {errors[name] && (
        <Text className={stylesheet.error}>
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default InputContainer;
