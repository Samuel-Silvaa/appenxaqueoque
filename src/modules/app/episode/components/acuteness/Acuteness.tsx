import { Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Card from '../form/card/Card';
import Wrapper from '../form/wrapper/Wrapper';
import { Acuteness as AcutenessType } from 'src/infra/@types/app.types';
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";
import { pinColor } from "src/infra/utils/appUtils";

const data = [
  {
    label: 'Leve - A criança reclama, mas continua brincando.',
    value: AcutenessType.LIGHT,
    img: require('src/assets/escorregador.png'),
  },
  {
    label: 'Moderada - A criança reclama e para de brincar, mas não se deita.',
    value: AcutenessType.MILD,
    img: require('src/assets/arthur_lego.png'),
  },
  {
    label: 'Forte - A criança reclama, deita e pode chorar de dor.',
    value: AcutenessType.SEVERE,
    img: require('src/assets/kid_crying.png'),
  },
];

const Acuteness = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const hasClinicalOptions = appState.clinicalOptions.length > 0;

  const optionIdFor = (label: AcutenessType): string | undefined =>
    appState.clinicalOptions.find(
      (option) => option.category === 'ACUTENESS' && option.label === label,
    )?.id;

  const selectedAcuteness = hasClinicalOptions
    ? appState.episode.acutenessOptionId ??
      optionIdFor(appState.episode.acuteness as AcutenessType)
    : appState.episode.acuteness;

  const selectAcuteness = (label: AcutenessType) => {
    const optionId = optionIdFor(label);

    dispatch(
      handleFormChanging(
        optionId
          ? { acutenessOptionId: optionId }
          : { acuteness: label },
      ),
    );
  };

  return (
    <View className='h-full w-full'>
      <Wrapper title='Qual foi a intensidade da dor ?'>
        <RadioButton.Group
          onValueChange={(value) => selectAcuteness(value as AcutenessType)}
          value={selectedAcuteness!}
        >
          {data.map((act, index) => (
            <Card
              key={index}
              onPress={() => {
                selectAcuteness(act.value);
              }}
              children={
                <View className='flex-row items-center'>
                  <RadioButton
                    value={optionIdFor(act.value) ?? act.value}
                    color={pinColor(index)}
                  />
                  <Text 
                    className='dark:text-d-text-gray'
                    style={{ flexWrap: 'wrap', flex: 1, flexShrink: 1 }}
                  >
                    {act.label}
                  </Text>
                </View>
              }
              image={act.img}
            />
          ))}
        </RadioButton.Group>
      </Wrapper>
    </View>
  );
};

export default Acuteness;
