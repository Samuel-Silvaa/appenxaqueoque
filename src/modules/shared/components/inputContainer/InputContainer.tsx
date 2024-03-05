import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, TextInputProps, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const stylesheet = {
  view: 'w-full my-4',
  input: 'flex h-[60px] bg-gray-light rounded rounded-3xl p-4 my-4 ',
  label: 'pl-2 text-gray',
  error: 'text-error pl-2 font-medium',
};

interface InputContainerProps extends TextInputProps {
  label: string;
  name: string;
  control: Control<any>;
  errors: FieldErrors<any>;
}

const InputContainer = ({
  label,
  control,
  name,
  errors,
  ...rest
}: InputContainerProps) => {
  return (
    <View className={stylesheet.view}>
      <Text className={stylesheet.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextInput
            {...field}
            {...rest}
            className={stylesheet.input}
          ></TextInput>
        )}
      ></Controller>
      {errors[name] && (
        <Text className={stylesheet.error}>
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default InputContainer;
