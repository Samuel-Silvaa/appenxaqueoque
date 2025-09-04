import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import { useAsyncAppDispatch } from 'src/infra/app/store';
import { requestUpdateAvatar } from 'src/infra/app/reducers/auth.reducer';
import { useApp } from "src/infra/app/app";
import { requestFetchPatient } from "src/infra/services/appService";
import { useSelector } from "react-redux";
import { authSelector } from "src/infra/app/selectors";
import { handleFecthPatient } from "src/infra/app/reducers/app.reducer";

type AvatarSelectionRouteParams = {
  email?: string;
  isLogged?: boolean;
};

const AvatarSelection = () => {
  const navigation = useNavigation<any>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const route = useRoute<RouteProp<Record<string, AvatarSelectionRouteParams>, string>>();
  const auth = useSelector(authSelector);

  const dispatch = useAsyncAppDispatch();
  const {handleToast} = useApp();


  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permissões necessárias',
          'Precisamos de permissão para acessar a câmera e galeria para selecionar sua foto de perfil.'
        );
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      handleToast( 'Não foi possível abrir a câmera.', 'danger');
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      handleToast( 'Não foi possível abrir a galeria.', 'danger');
    }
  };

  const handleContinue = async () => {
    const params = route.params as AvatarSelectionRouteParams;
    if (selectedImage) {
      try {
        const res = await dispatch(requestUpdateAvatar({ avatar: selectedImage, email: params?.email ?? '' }));

        if (res.meta.requestStatus !== 'fulfilled') {
          handleToast('Erro', 'Não foi possível atualizar o avatar.');
          return;
        }
      } catch (err) {
        handleToast('Não foi possível atualizar o avatar.', 'danger');
        return;
      }
      if(params.isLogged ) {
        
        navigation.navigate('Profile');
      } else {
        navigation.navigate('patient', { avatar: selectedImage, email: params?.email });
      }
    } else {
      navigation.navigate('patient',  { email: params?.email });
    }
  };

  const handleSkip = () => {
    // Navigate to patient registration without avatar
    const params = route.params as AvatarSelectionRouteParams;
    if(params.isLogged) {
      navigation.navigate('Profile'); 
    } else {
      navigation.navigate('patient');
    }
  };

  return (
    <AuthScaffold
      alignment="center"
      ctaPrimary={selectedImage ? handleContinue : pickFromGallery}
      ctaPrimaryText={selectedImage ? "Continuar" : 'Galeria'}
      ctaSecondary={handleSkip}
      ctaSecondaryText={route!.params!.isLogged ? "Cancelar" : "Pular"}
    >
      <View className="flex-1 justify-center items-center p-6">
        <Text className={sharedStyleSheet.title}>{selectedImage ? 'Sua foto ficou boa?' : 'Escolha uma foto'}</Text>
        {!selectedImage && (
            <Text className={sharedStyleSheet.subtitle}>
            Tira uma foto da criança ou se preferir selecione uma da galeria.
          </Text>
        )}

        {/* Avatar Preview */}
        <View className="w-52 h-52 mb-8 justify-center items-center relative z-10 mt-6">
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-full overflow-visible rounded-full"
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity onPress={takePhoto}>
                <View className="w-52 h-52 rounded-full justify-center items-center">
                <Image resizeMode="contain" className="w-[100%] h-[200]" source={require('src/assets/camera.png')}/>
            </View>
            </TouchableOpacity>
          )}
       

          {selectedImage && (
                 <TouchableOpacity
                 onPress={() => {setSelectedImage(null)}}
                 className="p-2  items-center justify-center bg-blue-secondary rounded-full absolute inline-flex top-[10px] right-[-10px] z-50"
               >
                     <Image source={require('src/assets/close-white.png')}style={{width: 24, height: 24}} tintColor={'white'}/>
               </TouchableOpacity>
          )}

         {selectedImage && (
            <TouchableOpacity
            onPress={takePhoto}
            className="bg-gray-secondary dark:bg-d-blue-primary p-4 items-center justify-center rounded-full absolute inline-flex bottom-[-20px] z-50"
          >
            <Text className="text-white font-semibold ">
                     <Image source={require('src/assets/camera-icon.png')} style={{width: 24, height: 24}} tintColor={'white'}/>
            </Text>
          </TouchableOpacity>
         )}
        </View>


      </View>
    </AuthScaffold>
  );
};

export default AvatarSelection; 