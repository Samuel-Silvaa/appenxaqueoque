import { useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputContainer from "src/modules/shared/components/inputContainer/InputContainer";
import ExPressable from "src/modules/auth/shared/components/buttons/pressable/ExPressable";
import { useApp } from "src/infra/app/app";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import {
  handleFetchEpisodes,
  handleFormChanging,
} from "src/infra/app/reducers/app.reducer";
import { useAsyncAppDispatch } from "src/infra/app/store";
import { ToastOptions, useToast } from "react-native-toast-notifications";

const stylesheet = {
  wrapper: "flex-col w-full items-center justify-between relative",
  title: "font-semibold text-black my-2  mb-10 mx-auto text-lg",
  label: "text-md font-semibold text-black self-start mt-14 pl-4 mb-4",
  notesWrapper:
    "flex-row w-full min-h-[140px] max-h-[150px] p-2 pt-0 bg-blue-four rounded-[28px] mt-1 mb-4 relative",
  notesInput: "bg-white w-full p-4 h-[95%]",
};

interface NotesSchema {
  notes: string;
}

const notesSchema = yup.object<NotesSchema>().shape({
  notes: yup.string(),
});

const Notes = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const navigation = useNavigation();
  const toast = useToast();
  const asyncDispatch = useAsyncAppDispatch();
  const { submitEpisode } = useApp();
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(notesSchema) });

  const handleSubmit = async () => {
    try {
      const res = await submitEpisode();

      // false = validation/API failure, toast already shown in submitEpisode
      if (res === false || !res) {
        return;
      }

      if (res.id) {
        asyncDispatch(handleFetchEpisodes(appState.patient!.id!));
        navigation.navigate("Success" as never);
        return;
      }

      toast.hideAll();
      toast.show(
        `Erro inesperado ao ${appState.episode.isEdition ? "editar" : "cadastrar"} episódio. Entre em contato com nosso suporte!`,
        { type: "danger" },
      );
    } catch (err) {
      console.log('[handleSubmit] error:', err);
      toast.show('Erro inesperado. Tente novamente.', { type: 'danger' });
    }
  };

  return (
    <View className={stylesheet.wrapper}>
      <Image
        className="absolute top-[20px] right-[-20px] w-[148px] h-[148px] z-40"
        resizeMode="contain"
        source={require("src/assets/boy_magnifier.png")}
      ></Image>
      <Text className={stylesheet.title}>Estamos quase lá</Text>

      <Text className={stylesheet.label}>Alguma observação?</Text>

      <View className={stylesheet.notesWrapper}>
        <InputContainer
          textAlignVertical="top"
          className={stylesheet.notesInput}
          name="notes"
          setValue={setValue}
          control={control}
          errors={errors}
          defaultValue={appState.episode.notes!}
          numberOfLines={4}
          multiline={true}
          onChange={(e) =>
            dispatch(handleFormChanging({ notes: e.nativeEvent.text }))
          }
        ></InputContainer>
      </View>

      <ExPressable
        onPress={handleSubmit}
        title="Salvar episódio"
        className="bg-[#8FD7FF] "
      />
    </View>
  );
};

export default Notes;
