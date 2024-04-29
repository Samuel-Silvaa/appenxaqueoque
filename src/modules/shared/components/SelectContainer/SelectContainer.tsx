import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const stylesheet = {
  view: 'w-full my-1 ',
  input: 'flex h-[60px] bg-gray-light rounded rounded-3xl p-5 ',
  label: 'pl-2 text-black text-[15px]',
  error: 'text-error pl-2 font-medium',
};

interface SelectContainerProps {
  label?: string;
  name: string;
  labelicon?: ImageSourcePropType;
  options: Array<{ title: string; value: string | number }>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
}

const SelectContainer = ({
  label,
  name,
  errors,
  options,
  labelicon,
  setValue,
}: SelectContainerProps) => {
  return (
    <View className={stylesheet.view}>
      <View className='w-full flex-row justify-between items-end my-2'>
        {label && <Text className={stylesheet.label}>{label}</Text>}
        {labelicon && (
          <Image
            source={labelicon}
            className='w-14 h-14'
            resizeMode='contain'
          ></Image>
        )}
      </View>
      <SelectDropdown
        data={options}
        onSelect={(selectedItem) => {
          setValue(name, selectedItem.value);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View>
              <Text className={stylesheet.input}>
                {(selectedItem && selectedItem.title) || 'Selecione o sexo'}
              </Text>
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View>
              <Text
                className={
                  stylesheet.input +
                  ' text-md capitalize font-bold bg-beige-tertiary rounded-none'
                }
              >
                {item.title}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      {errors[name] && (
        <Text className={stylesheet.error}>
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default SelectContainer;
