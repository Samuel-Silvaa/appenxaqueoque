import { Text, TextInputProps, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const stylesheet = {
  view: 'w-full my-4',
  input: 'flex h-[60px] bg-gray-light rounded rounded-3xl p-4 my-4 ',
  label: 'pl-2 text-gray',
};

interface InputContainerProps extends TextInputProps {
  label: string;
}

const InputContainer = ({ label, ...res }: InputContainerProps) => {
  return (
    <View className={stylesheet.view}>
      <Text className={stylesheet.label}>{label}</Text>
      <TextInput {...res} className={stylesheet.input}></TextInput>
    </View>
  );
};

export default InputContainer;
