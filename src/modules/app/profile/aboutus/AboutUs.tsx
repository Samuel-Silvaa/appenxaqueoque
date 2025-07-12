import React, { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import AppPageScaffold from '../../shared/components/appPageScaffold/AppPageScaffold';
import { useDispatch } from 'react-redux';
import { setPageTitle } from 'src/infra/app/reducers/app.reducer';

const Aboutus = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(setPageTitle('Sobre nós'));
    }, 200);
  }, []);

  return (
    <AppPageScaffold>
      <View className='rounded-[30px] bg-white dark:bg-[#191D33] px-5 py-9'>
        <View>
          <Text className='text-sm text-[#ADB8D3] font-bold'>Autores</Text>
          <Text className='text-sm text-[#ADB8D3]'>
            Bruna Borges Silva{'\n'}
            Jaqueline Jóice Muniz
          </Text>
        </View>
        <View className='mt-8'>
          <Text className='text-sm text-[#ADB8D3] font-bold'>Coautores</Text>
          <Text className='text-sm text-[#ADB8D3]'>
            Filipe Rodrigues da Silva{'\n'}
            Samuel Rodrigues da Silva{'\n'}
            Karen Emilly Alves Marcantônio{'\n'}
            Mariana Rodrigues da Silva
          </Text>
        </View>
        <Image
          source={require('src/assets/ppg.png')}
          className='self-center mt-12'
        ></Image>
      </View>
    </AppPageScaffold>
  );
};

export default Aboutus;
