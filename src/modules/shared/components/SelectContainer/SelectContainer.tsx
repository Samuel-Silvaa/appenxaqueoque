import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { Dimensions, Image, ImageSourcePropType, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useState, useEffect } from 'react';

const stylesheet = {
  view: 'w-full my-1 ',
  input:
    'flex h-[60px] bg-gray-light dark:bg-d-blue-primary rounded rounded-3xl p-5 dark:text-d-text-gray',
  label: 'pl-2 text-black dark:text-d-text-gray text-[15px]',
  error: 'text-error pl-2 font-medium',
};

interface SelectContainerProps {
  label?: string;
  name: string;
  labelicon?: ImageSourcePropType;
  options: Array<{ title: string; value: string | number }>;
  errors: FieldErrors<any>;
  control?: Control<any>;
  setValue: UseFormSetValue<any>;
  onChange?: (item: string) => void;
  watch?: UseFormWatch<any>;
  placeholder?: string;
  defaultValue?: string;
}

const SelectContainer = ({
  label,
  name,
  errors,
  options,
  labelicon,
  setValue,
  onChange,
  placeholder,
  defaultValue,
  control,
}: SelectContainerProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Find the default option based on the defaultValue string
  const defaultOption = defaultValue
    ? options.find((option) => option.value === defaultValue)
    : undefined;

  // Set the default value when component mounts or defaultValue changes
  useEffect(() => {
    if (defaultOption) {
      setSelectedItem(defaultOption);
      setValue(name, defaultOption.value);
    }
  }, [defaultOption, name, setValue]);

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
      {control && (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <SelectDropdown
              {...field}
              defaultValue={options.find((o) => o.value === field.value)}
              data={options}
              dropdownStyle={{
                borderRadius: 20,
                shadowOffset: { width: 4, height: 2 },
                padding: 0,
                top: Dimensions.get('window').height / 3,
              }}
              onSelect={(selectedItem) => {
                setSelectedItem(selectedItem);
                setValue(name, selectedItem.value);
                if (onChange) onChange(selectedItem.value);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View>
                    <Text className={stylesheet.input}>
                      {(selectedItem && selectedItem.title) ||
                        placeholder ||
                        'Selecione uma opção'}
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
                        'text-md capitalize bg-beige-tertiary dark:bg-d-blue-primary-dark rounded-none dark:text-d-text-gray px-6 rounded'
                      }
                    >
                      • {item.title}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        ></Controller>
      )}

      {!control && (
        <SelectDropdown
          data={options}
          defaultValue={selectedItem}
          dropdownStyle={{
            borderRadius: 20,
            shadowOffset: { width: 4, height: 2 },
            padding: 0,
          top: Dimensions.get('window').height / 3,
          }}
          onSelect={(selectedItem) => {
            setSelectedItem(selectedItem);
            setValue(name, selectedItem.value);
            if (onChange) onChange(selectedItem.value);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View>
                <Text className={stylesheet.input}>
                  {(selectedItem && selectedItem.title) ||
                    placeholder ||
                    'Selecione uma opção'}
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
                    ' text-md capitalize bg-beige-tertiary dark:bg-d-blue-primary-dark rounded-none dark:text-d-text-gray rounded px-6'
                  }
                >
                  • {item.title}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {errors[name] && (
        <Text className={stylesheet.error}>
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default SelectContainer;
