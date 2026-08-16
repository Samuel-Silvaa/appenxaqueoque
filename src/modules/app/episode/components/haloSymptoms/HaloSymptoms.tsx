import { ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { HaloSymptom } from 'src/infra/@types/app.types';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector } from 'src/infra/app/selectors';
import { handleFormChanging } from 'src/infra/app/reducers/app.reducer';
import { useTheme } from 'react-native-paper';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label:
      'Alterações visuais - A criança enxerga linhas ou manchas brilhantes antes ou durante os episódios de dor.',
    img: require('src/assets/halo.png'),
    value: HaloSymptom.VISUAL_DISTORTIONS,
  },
  {
    label:
      'Formigamento - A criança pode sentir dormência nos braços, na face ou na língua.',
    img: require('src/assets/formigamento.png'),
    value: HaloSymptom.TINGLING,
  },
  {
    label:
      'Alterações na fala - A criança pode emitir sons incompreensíveis ou ter dificuldade em pronunciar algumas palavras.',
    img: require('src/assets/fala.png'),
    value: HaloSymptom.SPEECH_DISTORTIONS,
  },
];

const HaloSymptoms = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const theme = useTheme();
  const hasClinicalOptions = appState.clinicalOptions.length > 0;
  const legacyHaloSymptoms = appState.episode.haloSymptoms as string | string[];

  const currentHaloSymptoms: string[] =
    hasClinicalOptions && appState.episode.haloSymptomOptionIds?.length
      ? appState.episode.haloSymptomOptionIds
      : Array.isArray(legacyHaloSymptoms)
        ? legacyHaloSymptoms
        : legacyHaloSymptoms
          ? legacyHaloSymptoms.split(',').filter(Boolean)
          : [];

  const optionIdFor = (label: string): string | undefined =>
    appState.clinicalOptions.find(
      (option) => option.category === 'HALO_SYMPTOM' && option.label === label,
    )?.id;

  const handleSetSymptomsValues = (value: string) => {
    const optionId = optionIdFor(value);
    const selectedValue = hasClinicalOptions && optionId ? optionId : value;
    const haloSymptoms = currentHaloSymptoms.includes(selectedValue)
      ? currentHaloSymptoms.filter((symptom) => symptom !== selectedValue)
      : [...currentHaloSymptoms, selectedValue];

    dispatch(
      handleFormChanging(
        hasClinicalOptions
          ? { haloSymptomOptionIds: haloSymptoms }
          : { haloSymptoms },
      ),
    );
  };

  const isHaloSymptomSelected = (label: string): boolean => {
    const optionId = optionIdFor(label);

    return currentHaloSymptoms.includes(
      hasClinicalOptions && optionId ? optionId : label,
    );
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='Quais foram os sintomas da aura? '>
        {data.map((act, index) => (
          <Card
            key={index}
            children={
              <View className='flex-row items-center w-[96%] text-justify p-1'>
                <BouncyCheckbox
                  size={22}
                  fillColor={theme.colors.secondary}
                  unfillColor='transparent'
                  textStyle={{
                    textDecorationLine: 'none',
                    color: theme.colors.onSurface,
                    flexWrap: 'wrap',
                    flex: 1,
                    flexShrink: 1,
                    textAlign: 'justify',
                  }}
                  text={act.label}
                  isChecked={isHaloSymptomSelected(act.value)}
                  onPress={() => {
                    handleSetSymptomsValues(act.value);
                  }}
                />
              </View>
            }
            image={act?.img}
          />
        ))}
      </Wrapper>
    </View>
  );
};

export default HaloSymptoms;
