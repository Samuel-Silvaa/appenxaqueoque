import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import AppPageScaffold from '../../shared/components/appPageScaffold/AppPageScaffold';
import { useDispatch } from "react-redux";
import { setPageTitle } from "src/infra/app/reducers/app.reducer";

const Help = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
  dispatch(setPageTitle('Ajuda'))

    }, 200)
  },[])

  return (
    <AppPageScaffold>
      <View className='rounded-[30px] bg-white dark:bg-[#191D33] px-5 py-9'>
        <Text className='text-sm text-dark dark:text-d-blue-title'>
          Olá! Estamos aqui para te ajudar. Caso você tenha dúvidas,
          reclamações, elogios ou sugestões, pedimos por gentileza que entre em
          contato conosco através dos seguintes meios de comunicação:
        </Text>
        <Text className='text-sm text-dark dark:text-d-blue-title mt-8'>
          E-mail: enxaqueoque@gmail.com {'\n'}
          Telefone: 35 99806-0109 - de seg. à sex. {'\n'}
          das 09:00 às 17:00 horas.
        </Text>
      </View>
    </AppPageScaffold>
  );
};

export default Help;
