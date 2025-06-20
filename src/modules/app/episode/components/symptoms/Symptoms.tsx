import { Appearance, ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import { useApp } from 'src/infra/app/app';
import { Symptom as SymptomType } from 'src/infra/@types/app.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector } from 'src/infra/app/selectors';
import { handleFormChanging } from 'src/infra/app/reducers/app.reducer';

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: 'Sensibilidade à luz - A criança busca um lugar escuro.',
    img: require('src/assets/photo.png'),
    value: SymptomType.PHOTOSENSIBILITY,
  },
  {
    label: 'Náusea - A criança deixa de comer.',
    img: require('src/assets/nausea.png'),
    value: SymptomType.NAUSEA,
  },
  {
    label: 'Vômito.',
    img: require('src/assets/vomit.png'),
    value: SymptomType.VOMIT,
  },
  {
    label: 'Sensibilidade ao barulho - A criança busca um lugar silencioso.',
    img: require('src/assets/hiperacusis.png'),
    value: SymptomType.HYPERACUSIS,
  },
  {
    label: 'Dor de barriga.',
    img: require('src/assets/sickness.png'),

    value: SymptomType.SICKNESS,
  },
  {
    label: 'Tontura.',
    img: require('src/assets/vomit.png'),
    value: SymptomType.DIZZINESS,
  },
];

const Symptoms = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);

  const handleSetSymptomsValues = (value: string) => {
    if (appState.episode.symptoms?.includes(value)) {
      dispatch(
        handleFormChanging({
          symptoms: Array.from(appState.episode.symptoms).filter(
            (tr) => tr !== value
          ),
        })
      );
    } else {
      dispatch(
        handleFormChanging({ symptoms: [...appState.episode.symptoms, value] })
      );
    }
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='Quais foram os sintomas associados ? '>
        {data.map((act, index) => (
          <Card
            key={index}
            onPress={() => {
              handleSetSymptomsValues(act.value);
            }}
            children={
              <View className='flex-row items-center w-[80%] '>
                <BouncyCheckbox
                  size={22}
                  fillColor='#CEB0FA'
                  unfillColor='#FFFFFF00'
                  textStyle={{
                    textDecorationLine: 'none',
                    color:
                      Appearance.getColorScheme() == 'dark'
                        ? '#9DA3A9'
                        : '#2E3E4B',
                  }}
                  text={act.label}
                  isChecked={appState.episode.symptoms?.includes(act.value)}
                  onPress={(isChecked: boolean) => {
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

export default Symptoms;
