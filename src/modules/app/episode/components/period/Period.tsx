import { Image, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '../form/card/Card';
import { RadioButton } from 'react-native-paper';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';
import Wrapper from '../form/wrapper/Wrapper';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";

const stylesheet = {
  wrapper: 'flex-col w-full items-center ',
  cardWrapper: 'flex-row items-center justify-center w-full ',
  cardOption:
    'flex-row items-center justify-center bg-white rounded-full w-[50%]',
  notesLabel: 'text-md font-semibold text-black self-start mt-14 pl-4',
  notesWrapper:
    'flex-row w-full min-h-[140px] max-h-[150px] p-2 pt-2 bg-blue-four rounded-[28px] mt-1 relative',
  notesInput: 'w-full p-4 h-[95%] start',
};

interface PeriodSchema {
  period: string;
  periodNotes: string;
}

const periodSchema = yup.object<PeriodSchema>().shape({
  period: yup.string(),
  periodNotes: yup.string(),
});

const Period = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const {
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm({ resolver: yupResolver(periodSchema) });


  return (
    <RadioButton.Group
      onValueChange={(value) => {
        if(value == 'false') {
          dispatch(handleFormChanging({ period: value, periodNotes: null }))
          reset({periodNotes: ''})
        } else if (value == 'true'){
          dispatch(handleFormChanging({ period: value }))
        }
      }}
      value={appState.episode.period!}
    >
      <View className={stylesheet.wrapper}>
        <Wrapper title='A criança está em período menstrual? '>
          <Card
            title='Menstruação'
            children={
              <View className={stylesheet.cardWrapper}>
                <View className={stylesheet.cardOption}>
                  <RadioButton value='true' color='#CEB0FA' />
                  <Text>Sim</Text>
                </View>
                <View className={stylesheet.cardOption}>
                  <RadioButton value='false' color='#CEB0FA' />
                  <Text>Não</Text>
                </View>
              </View>
            }
          />
        </Wrapper>

        <Text className={stylesheet.notesLabel}>Anotações:</Text>

        <View className={stylesheet.notesWrapper}>
          <Image
            className='absolute top-[-125px] right-[-100px] w-[100%] h-[170]'
            resizeMode="contain"
            source={require('src/assets/girl_laptop.png')}
          ></Image>
          <InputContainer
            textAlignVertical='top'
            editable={appState.episode.period != 'false'}
            name='notes'
            control={control}
            setValue={setValue}
            errors={errors}
            className={stylesheet.notesInput.concat(appState.episode.period == 'false' ? ' opacity-75' : ' bg-white')}
            numberOfLines={4}
            multiline={true}
            defaultValue={appState.episode.periodNotes!}
            onChange={(e) => dispatch(handleFormChanging({ periodNotes: e.nativeEvent.text}))}
          ></InputContainer>
        </View>
      </View>
    </RadioButton.Group>
  );
};

export default Period;
