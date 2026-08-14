import { Appearance, ImageSourcePropType, View } from "react-native";
import Wrapper from "../form/wrapper/Wrapper";
import Card from "../form/card/Card";
import { Symptom as SymptomType } from "src/infra/@types/app.types";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: "Sensibilidade à luz - A criança pode buscar um lugar escuro.",
    img: require("src/assets/photo.png"),
    value: SymptomType.PHOTOSENSIBILITY,
  },
  {
    label:
      "Sensibilidade ao barulho - A criança pode buscar um lugar silencioso.",
    img: require("src/assets/hiperacusis.png"),
    value: SymptomType.HYPERACUSIS,
  },
  {
    label: "Náusea - Vontade de vomitar.",
    img: require("src/assets/nausea.png"),
    value: SymptomType.NAUSEA,
  },
  {
    label: "Vômito",
    img: require("src/assets/vomit.png"),
    value: SymptomType.VOMIT,
  },

  {
    label: "Dor de barriga",
    img: require("src/assets/barriga.png"),

    value: SymptomType.SICKNESS,
  },
  {
    label: "Tontura",
    img: require("src/assets/tontura.png"),
    value: SymptomType.DIZZINESS,
  },
];

const Symptoms = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const hasClinicalOptions = appState.clinicalOptions.length > 0;

  const currentSymptoms = hasClinicalOptions && appState.episode.symptomOptionIds?.length
    ? appState.episode.symptomOptionIds
    : Array.isArray(appState.episode.symptoms)
      ? appState.episode.symptoms
      : appState.episode.symptoms
        ? String(appState.episode.symptoms)
            .split(",")
            .filter((value) => value.trim() !== "")
        : [];

  const optionIdFor = (label: string): string | undefined =>
    appState.clinicalOptions.find(
      (option) => option.category === "SYMPTOM" && option.label === label,
    )?.id;

  const handleSetSymptomsValues = (value: string) => {
    const optionId = optionIdFor(value);
    const selectedValue = hasClinicalOptions && optionId ? optionId : value;
    const symptoms = currentSymptoms.includes(selectedValue)
      ? currentSymptoms.filter((symptom) => symptom !== selectedValue)
      : [...currentSymptoms, selectedValue];

    dispatch(
      handleFormChanging(
        hasClinicalOptions
          ? { symptomOptionIds: symptoms }
          : { symptoms },
      ),
    );
  };

  const isSymptomSelected = (label: string): boolean => {
    const optionId = optionIdFor(label);

    return currentSymptoms.includes(
      hasClinicalOptions && optionId ? optionId : label,
    );
  };

  return (
    <View className="h-full w-full">
      <Wrapper title="Quais foram os sintomas associados ? ">
        {data.map((act, index) => (
          <Card
            key={index}
            onPress={() => {
              handleSetSymptomsValues(act.value);
            }}
            children={
              <View className="flex-row items-center w-[90%] ">
                <BouncyCheckbox
                  size={22}
                  fillColor="#CEB0FA"
                  unfillColor="#FFFFFF00"
                  textStyle={{
                    textDecorationLine: "none",
                    color:
                      Appearance.getColorScheme() == "dark"
                        ? "#9DA3A9"
                        : "#2E3E4B",
                    flexWrap: "wrap",
                    flex: 1,
                    flexShrink: 1,
                  }}
                  text={act.label}
                  isChecked={isSymptomSelected(act.value)}
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

export default Symptoms;
