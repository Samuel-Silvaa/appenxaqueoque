import { ImageSourcePropType, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';

const data: {
  key: string;
  img?: ImageSourcePropType;
}[] = [
  {
    key: '1',
    img: require('assets/head_front.png'),
  },
  {
    key: '2',
    img: require('assets/head_back.png'),
  },
];

const Location = () => {
  return (
    <View className='h-full w-full'>
      <Wrapper title='Nos mostre onde está localizado a dor : '>
        {data.map((act, index) => (
          <Card
            key={index}
            children={<View className='flex-row items-center'></View>}
            image={act?.img}
          />
        ))}
      </Wrapper>
    </View>
  );
};

export default Location;
