import { ScrollView, Text, View, Image } from 'react-native';
import InputContainer from '../inputContainer/InputContainer';
import { TimeInput } from '../timeInput';
import SelectContainer from '../selectContainer/SelectContainer';
import { useSelector } from "react-redux";
import { authSelector, appStateSelector } from "src/infra/app/selectors";
import { Control } from "react-hook-form";

interface PatientFormProps {
  setValue: any;
  errors: any;
  control?: Control<any>;
  isEditMode?: boolean;
  routeParams?: any;
}

const PatientForm = ({ setValue, errors, isEditMode = false, control, routeParams }: PatientFormProps) => {
  const auth = useSelector(authSelector);
  const appState = useSelector(appStateSelector);
  const patientData = appState.patient;


  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
    className="w-full h-[85%]"
    >
      {auth?.avatar && (
        <View className="items-start mb-4">
          <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
            <Image
              source={{ uri: auth.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-sm text-gray-600 mt-1">Foto selecionada</Text>
        </View>
      )}
      <InputContainer
        className='opacity-45 bg-white drop-shadow-sm'
        keyboardType='email-address'
        label='E-mail'
        defaultValue={auth?.sessionEmail ?? routeParams?.email ?? ''}
        name='email'
        editable={false}
        style={{opacity: 0.6}}
        setValue={setValue}
        value={patientData?.email}
        errors={errors}
      />
      <InputContainer
        keyboardType='default'
        label='Nome da criança'
        setValue={setValue}
        name='name'
        errors={errors}
      />
      <TimeInput
        label='Data de nascimento'
        name='birthDate'
        setValue={setValue}
        errors={errors}
        placeholder='Selecione a data de nascimento'
        mode='date'
        maximumDate={new Date()}
      />
      <SelectContainer
        label='Gênero'
        placeholder='Selecione o sexo'
        name='gender'
        options={[
          { title: 'Masculino', value: 'male' },
          { title: 'Feminino', value: 'female' },
        ]}
        setValue={setValue}
        defaultValue={patientData?.gender || 'female'}
        errors={errors}
      />
      
      <SelectContainer
        label='Parentesco'
        placeholder='Escolha o parentesco do responsável'
        setValue={setValue}
        options={[
          { title: 'Pai', value: 'father' },
          { title: 'Mãe', value: 'mother' },
          { title: 'Eu', value: 'patient' },
        ]}
        name='kinship'
        defaultValue={patientData?.kinship || 'mother'}
        errors={errors}
      />
      <View className='flex-row justify-between items-center'>
        <View className='w-[45%]'>
          <InputContainer
            defaultValue={patientData?.weight ? patientData.weight.toString() : ''}
            keyboardType='numeric'
            label='Peso da criança'
            setValue={setValue}
            name='weight'
            errors={errors}
            mask='999.9'
            placeholder='0.0'
          />
        </View>

        <View className='w-[45%]'>
          <InputContainer
            defaultValue={patientData?.height ? patientData.height.toString() : ''}
            keyboardType='numeric'
            label='Altura da criança'
            setValue={setValue}
            name='height'
            errors={errors}
            mask='9.99'
            placeholder='0.00'
          />
        </View>
      </View>
      <View className='h-[100px] w-full'></View>
    </ScrollView>
  );
};

export default PatientForm; 