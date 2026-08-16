import { ImageSourcePropType, View } from "react-native";
import Wrapper from "../form/wrapper/Wrapper";
import Card from "../form/card/Card";
import InputContainer from "src/modules/shared/components/inputContainer/InputContainer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Trigger as TriggerType } from "src/infra/@types/app.types";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";
import { useTheme } from "react-native-paper";

interface TriggerSchema {
  foodImpair?: string;
  anotherTrigger?: string;
}

const triggerSchema = yup.object<TriggerSchema>().shape({
  foodImpair: yup.string(),
  anotherTrigger: yup.string(),
});

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: "Sono irregular",
    value: TriggerType.JAGGEDSLEEP,
  },
  {
    label: "Fatores emocionais",
    value: TriggerType.EMOTIONAL,
  },
  {
    label: "Excesso de tela",
    value: TriggerType.VISUALEFFORT,
  },
  {
    label: "Jejum prolongado",
    value: TriggerType.FASTING,
  },
  {
    label: "Alimentação",
    value: TriggerType.FOOD,
  },
  {
    label: "Outros",
    value: TriggerType.ANOTHER,
  },
];

const Trigger = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const theme = useTheme();
  const hasClinicalOptions = appState.clinicalOptions.length > 0;
  const legacyTriggers = appState.episode.triggers as string | string[];

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<TriggerSchema>({ resolver: yupResolver(triggerSchema) });

  const currentTriggers: string[] =
    hasClinicalOptions && appState.episode.triggerOptionIds?.length
      ? appState.episode.triggerOptionIds
      : Array.isArray(legacyTriggers)
        ? legacyTriggers
        : legacyTriggers
          ? legacyTriggers.split(",").filter(Boolean)
          : [];

  const optionIdFor = (label: string): string | undefined =>
    appState.clinicalOptions.find(
      (option) => option.category === "TRIGGER" && option.label === label,
    )?.id;

  const isTriggerSelected = (label: string): boolean => {
    const optionId = optionIdFor(label);

    return currentTriggers.includes(
      hasClinicalOptions && optionId ? optionId : label,
    );
  };

  const handleSetTriggersValues = (value: string) => {
    const optionId = optionIdFor(value);
    const selectedValue = hasClinicalOptions && optionId ? optionId : value;
    const triggers = currentTriggers.includes(selectedValue)
      ? currentTriggers.filter((trigger) => trigger !== selectedValue)
      : [...currentTriggers, selectedValue];
    const update: Record<string, string | string[]> = hasClinicalOptions
      ? { triggerOptionIds: triggers }
      : { triggers };

    if (currentTriggers.includes(selectedValue) && value === TriggerType.FOOD) {
      update.foodImpair = "";
      setValue("foodImpair", "");
    }
    if (currentTriggers.includes(selectedValue) && value === TriggerType.ANOTHER) {
      update.anotherTrigger = "";
      setValue("anotherTrigger", "");
    }

    dispatch(handleFormChanging(update));
  };

  return (
    <View className="h-full w-full">
      <Wrapper title="Quais fatores podem ter desencadeado a crise? ">
        {data.map((act, index) => (
          <Fragment key={index}>
            <Card
              key={index}
              children={
                <View className="flex-row items-center ">
                  <BouncyCheckbox
                    size={22}
                    fillColor={theme.colors.secondary}
                    unfillColor="transparent"
                    textStyle={{
                      textDecorationLine: "none",
                      flexWrap: "wrap",
                      overflow: "hidden",
                      padding: 4,
                    }}
                    text={act.label}
                    isChecked={isTriggerSelected(act.value)}
                    onPress={() => {
                      handleSetTriggersValues(act.value);
                    }}
                  />
                </View>
              }
              image={act?.img}
            />
            {act.value == TriggerType.FOOD && (
              <InputContainer
                label="Qual alimento?"
                name="foodImpair"
                placeholder="Descreva brevemente"
                setValue={setValue}
                control={control}
                errors={errors}
                editable={
                  isTriggerSelected(TriggerType.FOOD)
                }
                className={`${
                  isTriggerSelected(TriggerType.FOOD)
                    ? " opacity-100"
                    : " opacity-25"
                } bg-white drop-shadow-sm`}
                defaultValue={appState.episode.foodImpair!}
                onChange={(e) =>
                  dispatch(
                    handleFormChanging({ foodImpair: e.nativeEvent.text }),
                  )
                }
              />
            )}
            {act.value == TriggerType.ANOTHER && (
              <InputContainer
                label="Qual outro fator desencadeou a dor?"
                name="anotherTrigger"
                setValue={setValue}
                control={control}
                errors={errors}
                placeholder="Descreva brevemente"
                editable={
                  isTriggerSelected(TriggerType.ANOTHER)
                }
                className={`${
                  isTriggerSelected(TriggerType.ANOTHER)
                    ? " opacity-100 "
                    : " opacity-25"
                } bg-white drop-shadow-sm`}
                defaultValue={appState.episode.anotherTrigger!}
                onChange={(e) =>
                  dispatch(
                    handleFormChanging({ anotherTrigger: e.nativeEvent.text }),
                  )
                }
              />
            )}
          </Fragment>
        ))}
      </Wrapper>
    </View>
  );
};

export default Trigger;
