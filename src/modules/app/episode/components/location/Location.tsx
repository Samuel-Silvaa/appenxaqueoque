import { Dimensions, Text, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import Svg, { Path } from 'react-native-svg';
import { Location as ILocation } from 'src/infra/@types/app.types';
import { useApp } from 'src/infra/app/app';

const Location = () => {
  const { episodeFormState, handleFormChange } = useApp();

  const handleSelectLocation = (location: string) => {
    const isLocationSet = episodeFormState.location?.includes(location);
    let locations;
    if (isLocationSet) {
      if (Array.isArray(episodeFormState.location)) {
        locations = episodeFormState.location?.filter((l) => l !== location);
      } else {
        locations = episodeFormState.location?.replace(location, '');
      }
    } else {
      if (Array.isArray(episodeFormState.location)) {
        locations = episodeFormState.location;
        locations.push(location);
      } else if (episodeFormState.location?.includes(',')) {
        locations = episodeFormState.location.split(',');
        locations.push(location);
      } else {
        locations = [location];
      }
    }
    handleFormChange({ location: locations });
  };

  const validateLocationSelectedAndReturnColorScheme = (
    location: string
  ): string => {
    if (
      Array.isArray(episodeFormState.location) &&
      Array.from(episodeFormState.location)?.includes(location)
    )
      return '#FF7383';
    if (episodeFormState.location?.includes(location)) return '#FF7383';

    return '#eedfc6';
  };

  return (
    <View>
      <Wrapper title='Nos mostre onde está localizado a dor : '>
        <Card
          children={
            <View className='relative dark:text-d-text-gray'>
              <Text className='dark:text-d-text-gray absolute top-0 w-full ellipsis h-[36px]'>
                {Array.isArray(episodeFormState.location)
                  ? Array.from(episodeFormState.location).join(' - ')
                  : episodeFormState.location?.includes(',')
                  ? episodeFormState.location.split(',').join(' - ')
                  : episodeFormState.location}
              </Text>
              <Text className='dark:text-d-text-gray absolute top-10 left-0'>
                Direita
              </Text>
              <Text className='dark:text-d-text-gray absolute top-10 right-0'>
                Esquerda
              </Text>
              <Svg
                className='z-30 '
                viewBox={`-25 0 ${Dimensions.get('window').width} ${
                  Dimensions.get('window').width
                }`}
                width={Dimensions.get('window').width - 80}
                height={Dimensions.get('window').width}
                id='Cabeça'
              >
                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  fill='#eedfc6'
                  d='M103.4,289.84c.43,23.01-7.48,43.78-20.09,63.02-3.92,5.98-2.83,13.9,2.6,18.56,42.77,36.65,86.9,38.36,132.62-.87,4.98-4.27,6.36-11.45,3.27-17.24-10.64-19.94-16.8-41-16.58-63.63.08-7.87-6.19-14.33-14.06-14.33h-73.71c-7.94,0-14.21,6.56-14.06,14.5Z'
                />
                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  onPress={() => handleSelectLocation(ILocation.FRONTALLEFT)}
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.FRONTALLEFT
                  )}
                  strokeDasharray='0 0 11.57 11.57'
                  d='M156.08,139.18v81.33c24.91-.02,67.54-6.47,93.38-14.08-7.13-30.25-2.67-57.35,12.48-80.89-34.6,9.48-70.25,13.91-105.85,13.64Z'
                />

                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  strokeDasharray='0 0 11.57 11.57'
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.FRONTALRIGHT
                  )}
                  onPress={() => handleSelectLocation(ILocation.FRONTALRIGHT)}
                  d='M46.51,123.55c16.22,23.92,21.92,51.7,15.27,82.61,24.47,7.12,67.91,14.36,94.2,14.36.03,0,.06,0,.09,0v-81.33c-36.99-.28-73.93-5.63-109.56-15.63Z'
                />
                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.PARIETALLEFT
                  )}
                  onPress={() => handleSelectLocation(ILocation.PARIETALLEFT)}
                  strokeDasharray='0 0 11.57 11.57'
                  d='M261.93,125.54c4.91-7.63,10.95-14.89,18.08-21.75-9.62-47.64-43.31-91.06-123.94-91.15v126.53c35.6.27,71.26-4.15,105.85-13.64Z'
                />
                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.TEMPLELEFT
                  )}
                  onPress={() => handleSelectLocation(ILocation.TEMPLELEFT)}
                  strokeDasharray='0 0 11.57 11.57'
                  d='M283.1,136.84c0-.31.01-.63.01-.94,0-10.62-.95-21.47-3.1-32.1-7.13,6.86-13.17,14.12-18.08,21.75.69-.19,1.37-.36,2.06-.56-.69.19-1.37.37-2.06.56-15.15,23.53-19.6,50.64-12.48,80.89.48-.14.96-.28,1.43-.42-.47.14-.95.28-1.43.42,3.26,13.86,8.96,28.37,17.17,43.51,3.27-8.52,5.83-18.26,7.82-28.51,15.58,1.45,48.62-68.36,8.66-84.59Z'
                />
                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  fill='#eedfc6'
                  d='M156.08,220.51v.85-.85s-.06,0-.09,0c-26.28,0-69.72-7.24-94.2-14.36-3,13.97-8.53,28.59-16.75,43.78,3.56,9.27,7.95,17.11,13.39,22.56,18.6,18.6,35.63,36.33,52.88,48.7,28.82,20.67,60.52,22.5,89.04,0,17.25-12.37,34.28-30.1,52.88-48.7,5.44-5.44,9.84-13.28,13.39-22.55-8.2-15.13-13.9-29.65-17.17-43.51-25.83,7.61-68.46,14.07-93.38,14.08Z'
                />
                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  strokeDasharray='0 0 11.57 11.57'
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.PARIETALRIGHT
                  )}
                  onPress={() => handleSelectLocation(ILocation.PARIETALRIGHT)}
                  d='M156.08,139.18V12.65c-.08,0-.16,0-.25,0-75.05,0-114.3,38.42-124.53,92.58,5.8,5.82,10.88,11.93,15.22,18.32,35.63,10,72.57,15.35,109.56,15.63Z'
                />
                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.TEMPLERIGHT
                  )}
                  onPress={() => handleSelectLocation(ILocation.TEMPLERIGHT)}
                  strokeDasharray='0 0 11.57 11.57'
                  d='M61.27,206.01c.17.05.35.1.52.15,6.64-30.91.94-58.69-15.27-82.61-.27-.08-.55-.15-.83-.23.27.08.55.15.83.23-4.33-6.39-9.42-12.5-15.22-18.32-1.84,9.76-2.75,20.02-2.75,30.67,0,.31,0,.63.01.94-39.96,16.23-6.92,86.04,8.66,84.59,1.99,10.25,4.55,19.99,7.82,28.51,8.22-15.19,13.75-29.8,16.75-43.78-.17-.05-.35-.1-.52-.15Z'
                />
              </Svg>
            </View>
          }
        ></Card>

        <Card
          children={
            <View className='relative'>
              <Text className='dark:text-d-text-gray absolute top-10 left-0'>
                Esquerda
              </Text>
              <Text className='dark:text-d-text-gray absolute top-10 right-0'>
                Direita
              </Text>
              <Svg
                className='z-30'
                viewBox={`-25 0 ${Dimensions.get('window').width} ${
                  Dimensions.get('window').width
                }`}
                width={Dimensions.get('window').width - 80}
                height={Dimensions.get('window').width}
                id='Cabeça'
              >
                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  fill='#eedfc6'
                  d='M283.22,134.11c0-.31.01-.63.01-.94,0-58.24-28.45-123.25-127.28-123.25-88.57,0-127.28,53.51-127.28,123.25,0,.31,0,.63.01.94-39.96,16.23-6.92,86.04,8.66,84.59,4.16,21.41,10.77,40.62,21.22,51.07,18.6,18.6,35.63,36.33,52.88,48.7,28.82,20.67,60.51,22.5,89.04,0,17.25-12.37,34.28-30.1,52.88-48.7,10.45-10.45,17.06-29.66,21.22-51.07,15.58,1.45,48.62-68.36,8.66-84.59Z'
                />

                <Path
                  strokeWidth={4}
                  strokeDasharray='0 0 11.57 11.57'
                  stroke='#1d1d1d'
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.BACKSIDE
                  )}
                  onPress={() => handleSelectLocation(ILocation.BACKSIDE)}
                  d='M155.95,9.74c-88.57,0-127.28,53.51-127.28,123.25,42.69,12.54,85.11,18.91,127.28,19.14V9.74Z'
                />
                <Path
                  strokeWidth={4}
                  strokeDasharray='0 0 11.57 11.57'
                  stroke='#1d1d1d'
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.BACKSIDE
                  )}
                  onPress={() => handleSelectLocation(ILocation.BACKSIDE)}
                  d='M283.22,133.93c0-.31.01-.63.01-.94,0-58.24-28.45-123.25-127.28-123.25v142.39c42.69.23,85.11-5.83,127.27-18.2Z'
                />

                <Path
                  strokeWidth={4}
                  stroke='#1d1d1d'
                  fill='#eedfc6'
                  d='M105.85,292.36c.45,23.01-7.77,43.78-20.88,63.02-4.08,5.98-2.94,13.9,2.7,18.56,44.46,36.65,90.32,38.36,137.84-.87,5.18-4.27,6.61-11.45,3.4-17.24-11.06-19.94-17.46-41-17.23-63.63'
                />
              </Svg>
            </View>
          }
        ></Card>
      </Wrapper>
    </View>
  );
};

export default Location;
