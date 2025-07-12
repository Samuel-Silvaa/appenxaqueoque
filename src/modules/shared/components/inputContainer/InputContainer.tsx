import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import {
  Image,
  ImageSourcePropType,
  Text,
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';

const stylesheet = {
  view: 'w-full my-1 ',
  input: 'flex h-[60px] bg-gray-light rounded rounded-3xl p-4 z-20',
  label: 'pl-2 text-black text-[15px] dark:text-d-text-gray',
  error: 'text-error pl-2 font-medium',
  inputContainer: 'relative',
};

interface InputContainerProps extends TextInputProps {
  label?: string;
  name: string;
  labelicon?: ImageSourcePropType;
  control?: Control<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  mask?: string;
}

const InputContainer = ({
  label,
  control,
  name,
  errors,
  labelicon,
  setValue,
  mask,
  secureTextEntry,
  ...rest
}: InputContainerProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry || name.toLowerCase().includes('password');
  const shouldShowEyeIcon = isPassword && rest.editable !== false;
  
  // Calculate the final secureTextEntry value
  const finalSecureTextEntry = isPassword ? !showPassword : secureTextEntry;

  const EyeIcon = () => (
    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      style={{
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -12 }],
        zIndex: 30,
        padding: 4,
      }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          {showPassword ? (
            // Eye open icon - when password is visible
            <Path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              fill="#6B7280"
            />
          ) : (
            // Eye closed icon - when password is hidden
            <Path
              d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
              fill="#6B7280"
            />
          )}
        </Svg>
      </View>
    </TouchableOpacity>
  );

  const renderInput = () => {
    // Use regular TextInput for password fields, MaskedTextInput for others with masks
    if (mask && !isPassword) {
      return (
        <MaskedTextInput
          onChangeText={(text, rawText) => setValue(name, rawText)}
          id={name}
          className={stylesheet.input}
          mask={mask}
          secureTextEntry={finalSecureTextEntry}
          {...rest}
        />
      );
    }

    return (
      <TextInput
        onChangeText={(text) => setValue(name, text)}
        id={name}
        className={stylesheet.input}
        secureTextEntry={finalSecureTextEntry}
        {...rest}
      />
    );
  };

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
      <View style={{ position: 'relative' }}>
        {renderInput()}
        {shouldShowEyeIcon && <EyeIcon />}
      </View>
      {errors[name] && (
        <Text className={stylesheet.error}>
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default InputContainer;
