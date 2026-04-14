import { ImageSourcePropType, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import Wrapper from "../form/wrapper/Wrapper";
import Card from "../form/card/Card";
import InputContainer from "src/modules/shared/components/inputContainer/InputContainer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ImprovementFactor as ImprovementFactorType } from "src/infra/@types/app.types";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { handleFormChanging } from "src/infra/app/reducers/app.reducer";
import SelectContainer from "src/modules/shared/components/selectContainer/SelectContainer";

const data: {
  label: string;
  value: string;
  img?: ImageSourcePropType;
}[] = [
  {
    label: "Medicação",
    value: ImprovementFactorType.MEDICINE,
  },
  {
    label: "Descanso",
    value: ImprovementFactorType.SLEEP,
  },
  {
    label: "Alimentação",
    value: ImprovementFactorType.FOOD,
  },
  {
    label: "Outros",
    value: ImprovementFactorType.ANOTHER,
  },
];

interface ImprovementSchema {
  medicine: string;
  medicineDosage: number;
  medicineImprovement: string;
  foodImprovement: string;
  anotherImprovementFactor: string;
}

const improvementSchema = yup.object<ImprovementSchema>().shape({
  medicine: yup.string(),
  medicineDosage: yup.number(),
  combinedDosage: yup.number(),
  foodImprovement: yup.string(),
  medicineImprovement: yup.string(),
  anotherImprovementFactor: yup.string(),
});

const ImprovementFactor = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const [isCombinedDosage, setIsCombinedDosage] = useState(
    !!appState.episode.combinedDosage,
  );

  const getImprovementFactors = (): string[] => {
    if (Array.isArray(appState.episode.improvementFactor)) {
      return appState.episode.improvementFactor;
    }
    if (typeof appState.episode.improvementFactor === "string") {
      return appState.episode.improvementFactor
        .split(",")
        .filter((v) => v !== "");
    }
    return [];
  };

  const isMedicineEditable = !getImprovementFactors().includes(
    ImprovementFactorType.MEDICINE,
  );

  const {
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ resolver: yupResolver(improvementSchema) });

  const handleSetImprovementFactorValues = useCallback(
    (value: string) => {
      const currentImprovementFactor = getImprovementFactors();

      if (currentImprovementFactor.includes(value)) {
        const update: Record<string, any> = {
          improvementFactor: currentImprovementFactor.filter(
            (tr) => tr !== value,
          ),
        };
        if (value === ImprovementFactorType.FOOD) {
          update.foodImprovement = null;
          reset({ foodImprovement: "" });
        }
        if (value === ImprovementFactorType.ANOTHER) {
          update.anotherImprovementFactor = null;
          reset({ anotherImprovementFactor: "" });
        }
        if (value === ImprovementFactorType.MEDICINE) {
          update.medicine = null;
          update.medicineDosage = null;
          update.combinedDosage = null;
          update.medicineImprovement = null;
          reset({
            medicine: "",
            medicineDosage: 0,
            medicineImprovement: "",
            combinedDosage: 0,
          });
        }
        dispatch(handleFormChanging(update));
      } else {
        dispatch(
          handleFormChanging({
            improvementFactor: [...currentImprovementFactor, value],
          }),
        );
      }
    },
    [appState.episode.improvementFactor],
  );

  useEffect(() => {
    if (!isCombinedDosage) {
      dispatch(
        handleFormChanging({
          combinedDosage: null,
        }),
      );
    }
  }, [isCombinedDosage]);

  return (
    <View className="h-full w-full">
      <Wrapper title="O que ajudou a melhorar?">
        {data.map((act, index) => (
          <Fragment key={index}>
            <Card
              key={index}
              children={
                <View className="flex-row items-center">
                  <BouncyCheckbox
                    size={22}
                    fillColor="#CEB0FA"
                    unfillColor="#FFFFFF00"
                    textStyle={{
                      textDecorationLine: "none",
                      flexWrap: "wrap",
                      flex: 1,
                      flexShrink: 1,
                    }}
                    text={act.label}
                    isChecked={getImprovementFactors().includes(act.value)}
                    onPress={() => handleSetImprovementFactorValues(act.value)}
                  />
                </View>
              }
              image={act?.img}
            />

            {act.value == ImprovementFactorType.MEDICINE && (
              <Card
                key={`subcard-${index}`}
                className={isMedicineEditable ? "opacity-25" : "opacity-100"}
                title="A criança foi medicada?"
                children={
                  <View className="w-full flex-col items-center">
                    <InputContainer
                      label="Nome do medicamento"
                      labelicon={require("src/assets/medicine.png")}
                      name="medicine"
                      setValue={setValue}
                      control={control}
                      errors={errors}
                      maxLength={40}
                      className="bg-tertiary w-full"
                      editable={!isMedicineEditable}
                      defaultValue={appState.episode.medicine!}
                      onChange={(e) =>
                        dispatch(
                          handleFormChanging({ medicine: e.nativeEvent.text }),
                        )
                      }
                    ></InputContainer>
                    <BouncyCheckbox
                      size={22}
                      fillColor="#CEB0FA"
                      isChecked={isCombinedDosage}
                      unfillColor="#FFFFFF00"
                      textStyle={{
                        textDecorationLine: "none",
                        flexWrap: "wrap",
                        flex: 1,
                        flexShrink: 1,
                        marginTop: 10,
                      }}
                      text="Medicamento de dosagem combinada"
                      onPress={() =>
                        setIsCombinedDosage((prevState) => !prevState)
                      }
                    />
                    <InputContainer
                      editable={isCombinedDosage}
                      keyboardType="numeric"
                      label={isCombinedDosage ? "Primeira dosagem" : ""}
                      name="combinedDosage"
                      setValue={setValue}
                      control={control}
                      errors={errors}
                      maxLength={4}
                      className={
                        !isCombinedDosage
                          ? "opacity-25  drop-shadow-sm"
                          : "opacity-100 drop-shadow-sm" + " bg-tertiary w-full"
                      }
                      defaultValue={appState.episode.combinedDosage?.toString()}
                      onChange={(e) => {
                        let numbers = e.nativeEvent.text.replace(/[^0-9]/g, "");
                        dispatch(
                          handleFormChanging({
                            combinedDosage: numbers,
                          }),
                        );
                      }}
                    ></InputContainer>
                    <InputContainer
                      keyboardType="numeric"
                      label={isCombinedDosage ? "Segunda dosagem" : "Dosagem"}
                      name="dosage"
                      setValue={setValue}
                      control={control}
                      errors={errors}
                      maxLength={4}
                      className="bg-tertiary w-full"
                      editable={!isMedicineEditable}
                      defaultValue={appState.episode.medicineDosage?.toString()}
                      onChange={(e) => {
                        let numbers = e.nativeEvent.text.replace(/[^0-9]/g, "");
                        dispatch(
                          handleFormChanging({
                            medicineDosage: numbers,
                          }),
                        );
                      }}
                    ></InputContainer>
                    <SelectContainer
                      control={control}
                      label="Unidade de medida"
                      placeholder="Escolha uma unidade de medida"
                      setValue={setValue}
                      defaultValue={appState.episode.medicineUnit!}
                      options={[
                        { title: "Grama - g", value: "g" },
                        { title: "Miligrama - mg", value: "mg" },
                        { title: "Micrograma - mcg", value: "mcg" },
                        { title: "Mililitro - mL", value: "mL" },
                        { title: "Litro - L", value: "L" },
                        { title: "Unidade Internacional - IU", value: "IU" },
                        { title: "Dose", value: "dose" },
                        { title: "Gota", value: "gota" },
                      ]}
                      name="medicineUnit"
                      onChange={(value) =>
                        dispatch(
                          handleFormChanging({
                            medicineUnit: value,
                          }),
                        )
                      }
                      errors={errors}
                    />
                    <Text className="font-semibold text-black my-4 text-lg">
                      Você notou alguma melhora?
                    </Text>
                    <RadioButton.Group
                      onValueChange={(value) =>
                        dispatch(
                          handleFormChanging({ medicineImprovement: value }),
                        )
                      }
                      value={appState.episode.medicineImprovement!}
                    >
                      <View className="flex-row items-center bg-tertiary w-full rounded-full">
                        <RadioButton
                          disabled={isMedicineEditable}
                          value="Melhorou"
                          color="#CEB0FA"
                        />
                        <Text style={{ flexWrap: "wrap", flex: 1 }}>
                          Melhorou
                        </Text>
                      </View>
                      <View className="flex-row items-center bg-tertiary w-full rounded-full ">
                        <RadioButton
                          disabled={isMedicineEditable}
                          value="Melhorou parcialmente"
                          color="#CEB0FA"
                        />
                        <Text style={{ flexWrap: "wrap", flex: 1 }}>
                          Melhorou parcialmente
                        </Text>
                      </View>
                      <View className="flex-row items-center bg-tertiary w-full rounded-full">
                        <RadioButton
                          disabled={isMedicineEditable}
                          value="Não melhorou"
                          color="#CEB0FA"
                        />
                        <Text style={{ flexWrap: "wrap", flex: 1 }}>
                          Não melhorou
                        </Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                }
              />
            )}

            {act.value == ImprovementFactorType.FOOD && (
              <InputContainer
                editable={getImprovementFactors().includes(
                  ImprovementFactorType.FOOD,
                )}
                setValue={setValue}
                label="Qual alimento ajudou a melhorar?"
                name="foodImprovement"
                control={control}
                errors={errors}
                placeholder="Descreva brevemente"
                className={
                  !getImprovementFactors().includes(ImprovementFactorType.FOOD)
                    ? "opacity-25 bg-white drop-shadow-sm"
                    : "opacity-100 bg-white drop-shadow-sm"
                }
                defaultValue={appState.episode.foodImprovement!}
                onChange={(e) =>
                  dispatch(
                    handleFormChanging({
                      foodImprovement: e.nativeEvent.text,
                    }),
                  )
                }
              />
            )}

            {act.value == ImprovementFactorType.ANOTHER && (
              <InputContainer
                editable={getImprovementFactors().includes(
                  ImprovementFactorType.ANOTHER,
                )}
                setValue={setValue}
                label="Qual outro fator de melhora?"
                name="anotherImprovementFactor"
                control={control}
                errors={errors}
                placeholder="Descreva brevemente"
                className={
                  !getImprovementFactors().includes(
                    ImprovementFactorType.ANOTHER,
                  )
                    ? "opacity-25 bg-white drop-shadow-sm"
                    : "opacity-100 bg-white drop-shadow-sm"
                }
                defaultValue={appState.episode.anotherImprovementFactor!}
                onChange={(e) =>
                  dispatch(
                    handleFormChanging({
                      anotherImprovementFactor: e.nativeEvent.text,
                    }),
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

export default ImprovementFactor;
