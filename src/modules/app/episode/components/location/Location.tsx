import { Dimensions, Text, View } from 'react-native';
import Wrapper from '../form/wrapper/Wrapper';
import Card from '../form/card/Card';
import Svg, { G, Line, Path } from 'react-native-svg';
import { Location as ILocation } from 'src/infra/@types/app.types';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector } from 'src/infra/app/selectors';
import { handleFormChanging } from 'src/infra/app/reducers/app.reducer';
import { fi } from 'date-fns/locale';

const Location = () => {
  const dispatch = useDispatch();
  const appState = useSelector(appStateSelector);
  const selectedColor = '#FFB0B5';

  const getCurrentLocation = (): string[] => {
    if (Array.isArray(appState.episode.location)) {
      return appState.episode.location;
    }
    if (
      typeof appState.episode.location === 'string' &&
      appState.episode.location.trim() !== ''
    ) {
      return appState.episode.location.split(',').filter(Boolean);
    }
    return [];
  };

  const handleSelectLocation = (location: string) => {
    try {
      const currentLocation = getCurrentLocation();
      const isLocationSet = currentLocation?.includes(location);

      const locations = isLocationSet
        ? currentLocation.filter((l) => l !== location)
        : [...currentLocation, location];

      if (
        locations?.includes(ILocation.FRONTALBILATERAL) &&
        (location === ILocation.FRONTALRIGHT ||
          location === ILocation.FRONTALLEFT)
      ) {
        const filteredLocations = locations.filter(
          (l) => l !== ILocation.FRONTALBILATERAL && l !== location
        );
        filteredLocations.push(
          location == ILocation.FRONTALRIGHT
            ? ILocation.FRONTALLEFT
            : ILocation.FRONTALRIGHT
        );
        dispatch(
          handleFormChanging({
            location: filteredLocations,
          })
        );
        return;
      }

      if (
        locations?.includes(ILocation.PARIETALBILATERAL) &&
        (location === ILocation.PARIETALRIGHT ||
          location === ILocation.PARIETALLEFT)
      ) {
        const filteredLocations = locations.filter(
          (l) => l !== ILocation.PARIETALBILATERAL && l !== location
        );
        filteredLocations.push(
          location == ILocation.PARIETALRIGHT
            ? ILocation.PARIETALLEFT
            : ILocation.PARIETALRIGHT
        );
        dispatch(
          handleFormChanging({
            location: filteredLocations,
          })
        );
        return;
      }

      if (
        locations?.includes(ILocation.TEMPLEBILATERAL) &&
        (location === ILocation.TEMPLERIGHT ||
          location === ILocation.TEMPLELEFT)
      ) {
        const filteredLocations = locations.filter(
          (l) => l !== ILocation.TEMPLEBILATERAL && l !== location
        );
        filteredLocations.push(
          location == ILocation.TEMPLERIGHT
            ? ILocation.TEMPLELEFT
            : ILocation.TEMPLERIGHT
        );
        dispatch(
          handleFormChanging({
            location: filteredLocations,
          })
        );
        return;
      }

      if (
        locations?.includes(ILocation.OCCIPITALBILATERAL) &&
        (location === ILocation.OCCIPITALRIGHT ||
          location === ILocation.OCCIPITALLEFT)
      ) {
        const filteredLocations = locations.filter(
          (l) => l !== ILocation.OCCIPITALBILATERAL && l !== location
        );
        filteredLocations.push(
          location == ILocation.OCCIPITALRIGHT
            ? ILocation.OCCIPITALLEFT
            : ILocation.OCCIPITALRIGHT
        );
        dispatch(
          handleFormChanging({
            location: filteredLocations,
          })
        );
        return;
      }

      if (
        locations?.includes(ILocation.FRONTALLEFT) &&
        locations?.includes(ILocation.FRONTALRIGHT)
      ) {
        const filteredLocations = locations.filter(
          (l) => l !== ILocation.FRONTALLEFT && l !== ILocation.FRONTALRIGHT
        );
        filteredLocations.push(ILocation.FRONTALBILATERAL);
        dispatch(handleFormChanging({ location: filteredLocations }));
        return;
      }

      if (
        locations?.includes(ILocation.PARIETALLEFT) &&
        locations?.includes(ILocation.PARIETALRIGHT)
      ) {
        const filteredLocations = locations.filter(
          (l) => l !== ILocation.PARIETALLEFT && l !== ILocation.PARIETALRIGHT
        );
        filteredLocations.push(ILocation.PARIETALBILATERAL);
        dispatch(handleFormChanging({ location: filteredLocations }));
        return;
      }

      if (
        locations?.includes(ILocation.TEMPLERIGHT) &&
        locations?.includes(ILocation.TEMPLELEFT)
      ) {
        const filteredLocations = locations.filter(
          (l) => l !== ILocation.TEMPLELEFT && l !== ILocation.TEMPLERIGHT
        );
        filteredLocations.push(ILocation.TEMPLEBILATERAL);
        dispatch(handleFormChanging({ location: filteredLocations }));
        return;
      }

      if (
        locations?.includes(ILocation.OCCIPITALLEFT) &&
        locations?.includes(ILocation.OCCIPITALRIGHT)
      ) {
        const filteredLocations = locations.filter(
          (l) => l !== ILocation.OCCIPITALLEFT && l !== ILocation.OCCIPITALRIGHT
        );
        filteredLocations.push(ILocation.OCCIPITALBILATERAL);
        dispatch(handleFormChanging({ location: filteredLocations }));
        return;
      }

      return dispatch(handleFormChanging({ location: locations }));
    } catch (err) {
      console.log(err);
    }
  };

  const validateLocationSelectedAndReturnColorScheme = (
    location: string
  ): string => {
    return getCurrentLocation()?.includes(location) ? selectedColor : '#f2dbc6';
  };

  return (
    <View>
      <Wrapper title='Onde estava localizada a dor?'>
        <Card
          children={
            <View className='relative dark:text-d-text-gray'>
              <Text className='dark:text-d-text-gray absolute top-0 w-full ellipsis'>
                {getCurrentLocation().join('  ')}
              </Text>
              <Text className='dark:text-d-text-gray p-2 rounded-full bg-blue-four absolute top-10'>
                Direita
              </Text>
              <Text className='dark:text-d-text-gray p-2 rounded-full bg-blue-four absolute top-10 right-5'>
                Esquerda
              </Text>

              <Svg
                viewBox={`-35 0 ${Dimensions.get('window').width} ${Dimensions.get('window').width
                  }`}
                width={Dimensions.get('window').width - 80}
                height={Dimensions.get('window').width}
                id='Cabeça'
              >
                <G>
                  <Path
                    d='M103.4,289.84c.43,23.01-7.48,43.78-20.09,63.02-3.92,5.98-2.83,13.9,2.6,18.56,42.77,36.65,86.9,38.36,132.62-.87,4.98-4.27,6.36-11.45,3.27-17.24-10.64-19.94-16.8-41-16.58-63.63.08-7.87-6.19-14.33-14.06-14.33h-73.71c-7.94,0-14.21,6.56-14.06,14.5Z'
                    fill='#f2dbc6'
                    stroke='#a8a8a7'
                    strokeWidth={3}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M283.35,136.85c0-.31.01-.63.01-.94,0-58.24-28.45-123.25-127.28-123.25-88.57,0-127.28,53.51-127.28,123.25,0,.31,0,.63.01.94-39.96,16.23-6.92,86.04,8.66,84.59,4.16,21.41,10.77,40.62,21.22,51.07,18.6,18.6,35.63,36.33,52.88,48.7,28.82,20.67,60.51,22.5,89.04,0,17.25-12.37,34.28-30.1,52.88-48.7,10.45-10.45,17.06-29.66,21.22-51.07,15.58,1.45,48.62-68.36,8.66-84.59Z'
                    fill='none'
                    stroke='#a8a8a7'
                    strokeWidth={6}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M156.08,139.18v81.33c24.91-.02,67.54-6.47,93.38-14.08-7.13-30.25-2.67-57.35,12.48-80.89-34.6,9.48-70.25,13.91-105.85,13.64Z'
                    onPressIn={() =>
                      handleSelectLocation(ILocation.FRONTALLEFT)
                    }
                    fill={
                      appState.episode.location?.includes(
                        ILocation.FRONTALBILATERAL
                      )
                        ? selectedColor
                        : validateLocationSelectedAndReturnColorScheme(
                          ILocation.FRONTALLEFT
                        )
                    }
                  />
                  <Path
                    d='M46.51,123.55c16.22,23.92,21.92,51.7,15.27,82.61,24.47,7.12,67.91,14.36,94.2,14.36.03,0,.06,0,.09,0v-81.33c-36.99-.28-73.93-5.63-109.56-15.63Z'
                    onPressIn={() =>
                      handleSelectLocation(ILocation.FRONTALRIGHT)
                    }
                    fill={
                      appState.episode.location?.includes(
                        ILocation.FRONTALBILATERAL
                      )
                        ? selectedColor
                        : validateLocationSelectedAndReturnColorScheme(
                          ILocation.FRONTALRIGHT
                        )
                    }
                  />
                  <Path
                    d='M261.93,125.54c4.91-7.63,10.95-14.89,18.08-21.75-9.62-47.64-43.31-91.06-123.94-91.15v126.53c35.6.27,71.26-4.15,105.85-13.64Z'
                    fill={
                      appState.episode.location?.includes(
                        ILocation.PARIETALBILATERAL
                      )
                        ? selectedColor
                        : validateLocationSelectedAndReturnColorScheme(
                          ILocation.PARIETALLEFT
                        )
                    }
                    onPressIn={() =>
                      handleSelectLocation(ILocation.PARIETALLEFT)
                    }
                  />
                  <Path
                    d='M283.1,136.84c0-.31.01-.63.01-.94,0-10.62-.95-21.47-3.1-32.1-7.13,6.86-13.17,14.12-18.08,21.75.69-.19,1.37-.36,2.06-.56-.69.19-1.37.37-2.06.56-15.15,23.53-19.6,50.64-12.48,80.89.48-.14.96-.28,1.43-.42-.47.14-.95.28-1.43.42,3.26,13.86,8.96,28.37,17.17,43.51,3.27-8.52,5.83-18.26,7.82-28.51,15.58,1.45,48.62-68.36,8.66-84.59Z'
                    fill={
                      appState.episode.location?.includes(
                        ILocation.TEMPLEBILATERAL
                      )
                        ? selectedColor
                        : validateLocationSelectedAndReturnColorScheme(
                          ILocation.TEMPLELEFT
                        )
                    }
                    onPressIn={() => handleSelectLocation(ILocation.TEMPLELEFT)}
                  />
                  <Path
                    d='M156.08,220.51v.85-.85s-.06,0-.09,0c-26.28,0-69.72-7.24-94.2-14.36-3,13.97-8.53,28.59-16.75,43.78,3.56,9.27,7.95,17.11,13.39,22.56,18.6,18.6,35.63,36.33,52.88,48.7,28.82,20.67,60.52,22.5,89.04,0,17.25-12.37,34.28-30.1,52.88-48.7,5.44-5.44,9.84-13.28,13.39-22.55-8.2-15.13-13.9-29.65-17.17-43.51-25.83,7.61-68.46,14.07-93.38,14.08Z'
                    fill='#f2dbc6'
                  />
                  <Path
                    d='M156.08,139.18V12.65c-.08,0-.16,0-.25,0-75.05,0-114.3,38.42-124.53,92.58,5.8,5.82,10.88,11.93,15.22,18.32,35.63,10,72.57,15.35,109.56,15.63Z'
                    fill={
                      appState.episode.location?.includes(
                        ILocation.PARIETALBILATERAL
                      )
                        ? selectedColor
                        : validateLocationSelectedAndReturnColorScheme(
                          ILocation.PARIETALRIGHT
                        )
                    }
                    onPressIn={() =>
                      handleSelectLocation(ILocation.PARIETALRIGHT)
                    }
                  />
                  <Path
                    d='M61.27,206.01c.17.05.35.1.52.15,6.64-30.91.94-58.69-15.27-82.61-.27-.08-.55-.15-.83-.23.27.08.55.15.83.23-4.33-6.39-9.42-12.5-15.22-18.32-1.84,9.76-2.75,20.02-2.75,30.67,0,.31,0,.63.01.94-39.96,16.23-6.92,86.04,8.66,84.59,1.99,10.25,4.55,19.99,7.82,28.51,8.22-15.19,13.75-29.8,16.75-43.78-.17-.05-.35-.1-.52-.15Z'
                    fill={
                      appState.episode.location?.includes(
                        ILocation.TEMPLEBILATERAL
                      )
                        ? selectedColor
                        : validateLocationSelectedAndReturnColorScheme(
                          ILocation.TEMPLERIGHT
                        )
                    }
                    onPressIn={() =>
                      handleSelectLocation(ILocation.TEMPLERIGHT)
                    }
                  />

                  {/* === Dashed/Dotted Lines === */}
                  <Path
                    d='M32.3,104.75c1.46,1.4,2.88,2.81,4.25,4.24'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M44.1,117.57c26.98,33.76,29.29,74.83,5.2,123.75'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                    strokeDasharray='11.44 11.44'
                  />
                  <Path
                    d='M46.71,246.42c-.92,1.75-1.87,3.51-2.85,5.28'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M279.36,104.75c-1.46,1.4-2.88,2.81-4.25,4.24'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M267.56,117.57c-26.98,33.76-29.29,74.83-5.2,123.75'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                    strokeDasharray='11.44 11.44'
                  />
                  <Path
                    d='M264.94,246.42c.92,1.75,1.87,3.51,2.85,5.28'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M47.65,123.23c1.93.54,3.85,1.08,5.78,1.59'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M65.25,127.81c61.57,14.62,125.18,15.14,187.05-.13'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                    strokeDasharray='12.18 12.18'
                  />
                  <Path
                    d='M258.2,126.17c1.93-.51,3.86-1.03,5.79-1.57'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M250.88,205.61c-1.83.56-3.76,1.11-5.77,1.65'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M233.45,210.15c-25.17,5.7-57.21,9.97-77.46,9.97-22.67,0-58.1-5.38-83.12-11.43'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                    strokeDasharray='12.02 12.02'
                  />
                  <Path
                    d='M67.04,207.22c-2.02-.53-3.96-1.07-5.78-1.61'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M156.07,12.25v6'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                  <Path
                    d='M156.07,29.82v179.37'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                    strokeDasharray='11.57 11.57'
                  />
                  <Path
                    d='M156.07,214.98v6'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                  />
                </G>

                <G>
                  <G>
                    <Path
                      fill='#9c9b9b'
                      opacity={0.3}
                      d='M75.96,162.43c8.09-2.7,16.51-4.13,25.05-3.81,8.26.31,16.34,2.31,23.97,5.46,1.25.52,2.75-.56,3.08-1.75.39-1.44-.49-2.56-1.75-3.08-8.04-3.32-16.59-5.31-25.29-5.63-8.95-.33-17.91,1.16-26.38,3.99-3.04,1.01-1.74,5.84,1.33,4.82h0Z'
                    />
                  </G>

                  <G>
                    <Path
                      fill='#9c9b9b'
                      opacity={0.3}
                      d='M236.97,157.61c-8.48-2.83-17.44-4.32-26.38-3.99-8.7.32-17.26,2.31-25.29,5.63-1.25.51-2.14,1.66-1.75,3.08.32,1.18,1.82,2.26,3.08,1.75,7.63-3.15,15.7-5.15,23.97-5.46,8.54-.32,16.96,1.11,25.05,3.81,3.06,1.02,4.37-3.81,1.33-4.82h0Z'
                    />
                  </G>

                  <G>
                    <Path
                      fill='#9c9b9b'
                      opacity={0.3}
                      d='M75.51,186.88c8.01,4.83,16.86,8.17,26.22,8.94,9.12.75,18.11-1.24,26.44-4.88,1.24-.54,1.52-2.35.9-3.42-.75-1.28-2.18-1.44-3.42-.9-7.53,3.29-15.71,4.87-23.92,4.2s-16.48-3.9-23.7-8.26c-2.76-1.67-5.28,2.65-2.52,4.32h0Z'
                    />
                  </G>

                  <G>
                    <Path
                      fill='#9c9b9b'
                      opacity={0.3}
                      d='M233.58,182.56c-7.22,4.36-15.24,7.56-23.7,8.26-8.21.67-16.39-.91-23.92-4.2-1.24-.54-2.68-.36-3.42.9-.62,1.06-.35,2.88.9,3.42,8.33,3.64,17.32,5.63,26.44,4.88,9.36-.77,18.22-4.11,26.22-8.94,2.75-1.66.24-5.99-2.52-4.32h0Z'
                    />
                  </G>

                  <G>
                    <Path
                      fill='#9c9b9b'
                      opacity={0.3}
                      d='M168.43,235.71c-4.06-2.01-8.42-3.26-12.97-3.26-4.64,0-9.07,1.29-13.24,3.26-1.22.58-1.54,2.33-.9,3.42.73,1.25,2.2,1.48,3.42.9,6.86-3.25,14.32-3.39,21.15,0,1.21.6,2.71.32,3.42-.9.65-1.1.32-2.82-.9-3.42h0Z'
                    />
                  </G>

                  <G>
                    <Path
                      fill='#9c9b9b'
                      opacity={0.3}
                      d='M121.61,277.76c8.05,4.44,16.75,7.44,25.89,8.5,8.78,1.02,17.75.04,26.22-2.41,5.28-1.53,10.39-3.64,15.3-6.09,2.88-1.44.35-5.75-2.52-4.32-7.73,3.86-16.08,6.79-24.7,7.79-8.13.95-16.31.28-24.16-2.05-4.72-1.4-9.21-3.37-13.51-5.74-2.82-1.55-5.35,2.76-2.52,4.32h0Z'
                    />
                  </G>
                </G>
              </Svg>
            </View>
          }
        ></Card>

        <Card
          children={
            <View className='relative'>
              <Text className='dark:text-d-text-gray p-2 rounded-full bg-blue-four absolute top-10'>
                Esquerda
              </Text>
              <Text className='dark:text-d-text-gray p-2 rounded-full bg-blue-four absolute top-10 right-5'>
                Direita
              </Text>
              <Svg
                className='z-30'
                viewBox={`-36 0 ${Dimensions.get('window').width} ${Dimensions.get('window').width
                  }`}
                width={Dimensions.get('window').width - 80}
                height={Dimensions.get('window').width}
                id='Cabeça'
              >
                {/* Outline head shape */}
                <Path
                  d='M283.22,134.11c0-.31.01-.63.01-.94,0-58.24-28.45-123.25-127.28-123.25-88.57,0-127.28,53.51-127.28,123.25,0,.31,0,.63.01.94-39.96,16.23-6.92,86.04,8.66,84.59,4.16,21.41,10.77,40.62,21.22,51.07,18.6,18.6,35.63,36.33,52.88,48.7,28.82,20.67,60.51,22.5,89.04,0,17.25-12.37,34.28-30.1,52.88-48.7,10.45-10.45,17.06-29.66,21.22-51.07,15.58,1.45,48.62-68.36,8.66-84.59Z'
                  fill='none'
                  stroke='#9c9b9b'
                  strokeWidth={6}
                  strokeMiterlimit={10}
                />

                {/* Neck and shoulders */}
                <Path
                  d='M107.72,290.36c.43,23.01-7.48,43.78-20.09,63.02-3.92,5.98-2.83,13.9,2.6,18.56,42.77,36.65,86.9,38.36,132.62-.87,4.98-4.27,6.36-11.45,3.27-17.24-10.64-19.94-16.8-41-16.58-63.63'
                  fill='none'
                  stroke='#9c9b9b'
                  strokeMiterlimit={10}
                  strokeWidth={6}
                />

                {/* Skin fills */}
                <Path
                  d='M155.95,9.74c-88.57,0-127.28,53.51-127.28,123.25,42.69,12.54,85.11,18.91,127.28,19.14V9.74Z'
                  fill={
                    appState.episode.location?.includes(
                      ILocation.PARIETALBILATERAL
                    )
                      ? selectedColor
                      : validateLocationSelectedAndReturnColorScheme(
                        ILocation.PARIETALLEFT
                      )
                  }
                  onPressIn={() => handleSelectLocation(ILocation.PARIETALLEFT)}
                />
                <Path
                  d='M283.22,133.93c0-.31.01-.63.01-.94,0-58.24-28.45-123.25-127.28-123.25v142.39c42.69.23,85.11-5.83,127.27-18.2Z'
                  fill={
                    appState.episode.location?.includes(
                      ILocation.PARIETALBILATERAL
                    )
                      ? selectedColor
                      : validateLocationSelectedAndReturnColorScheme(
                        ILocation.PARIETALRIGHT
                      )
                  }
                  onPressIn={() =>
                    handleSelectLocation(ILocation.PARIETALRIGHT)
                  }
                />
                <Path
                  d='M155.95,152.14h0c-42.17-.24-84.6-6.62-127.28-19.16,0,.31,0,.63.01.94-39.96,16.23-6.92,86.04,8.66,84.59,4.16,21.41,10.77,40.62,21.22,51.07.39.39.77.77,1.16,1.16,28.78,6.14,62.55,9.47,96.24,9.84v-128.44Z'
                  fill={
                    appState.episode.location?.includes(
                      ILocation.OCCIPITALBILATERAL
                    )
                      ? selectedColor
                      : validateLocationSelectedAndReturnColorScheme(
                        ILocation.OCCIPITALLEFT
                      )
                  }
                  onPressIn={() =>
                    handleSelectLocation(ILocation.OCCIPITALLEFT)
                  }
                />
                <Path
                  d='M155.95,280.59v2.28-2.28c-33.68-.38-67.46-3.7-96.24-9.84,15.92,15.95,30.72,31.18,45.52,42.86-3.23,13.97-9.41,27.11-17.6,39.59-3.92,5.98-2.83,13.9,2.6,18.56,42.77,36.65,86.9,38.36,132.62-.87,4.98-4.27,6.36-11.45,3.27-17.24-7.44-13.94-12.67-28.42-15.08-43.6,12.62-10.53,25.33-23.44,38.81-36.96-28.01,5.41-60.91,7.88-93.91,7.51Z'
                  fill={validateLocationSelectedAndReturnColorScheme(
                    ILocation.BACKSIDE
                  )}
                  onPressIn={() => handleSelectLocation(ILocation.BACKSIDE)}
                />
                <Path
                  d='M283.22,133.93c-42.16,12.37-84.58,18.44-127.27,18.2h0v128.46c33,.37,65.9-2.1,93.91-7.51,1.16-1.16,2.32-2.33,3.49-3.49,10.45-10.45,17.06-29.66,21.22-51.07,15.58,1.45,48.62-68.36,8.66-84.59Z'
                  fill={
                    appState.episode.location?.includes(
                      ILocation.OCCIPITALBILATERAL
                    )
                      ? selectedColor
                      : validateLocationSelectedAndReturnColorScheme(
                        ILocation.OCCIPITALRIGHT
                      )
                  }
                  onPressIn={() =>
                    handleSelectLocation(ILocation.OCCIPITALRIGHT)
                  }
                />

                {/* Small outline strokes */}
                <Path
                  d='M212.36,312.23c-.52-4.39-1.93-11.45-2.04-17.36'
                  fill='none'
                  stroke='#9c9b9b'
                  strokeMiterlimit={10}
                />
                <Path
                  d='M105.85,292.36c.15,7.46-.62,14.68-2.17,21.7'
                  fill='none'
                  stroke='#9c9b9b'
                  strokeMiterlimit={10}
                />

                {/* Dashed guides */}
                <G>
                  <G>
                    <Path
                      d='M28.67,132.99c85.9,25.22,170.75,25.54,254.56.94'
                      fill='none'
                      stroke='#9c9b9b'
                      strokeWidth={2}
                      strokeMiterlimit={10}
                      strokeDasharray='12'
                    />
                    <Line
                      x1='155.95'
                      y1='9.74'
                      x2='155.95'
                      y2='280.59'
                      fill='none'
                      stroke='#9c9b9b'
                      strokeWidth={2}
                      strokeMiterlimit={10}
                      strokeDasharray='12'
                    />
                  </G>
                  <Path
                    d='M58.56,269.58c59.58,13.75,133.25,14.86,192.1,2.17'
                    fill='none'
                    stroke='#9c9b9b'
                    strokeWidth={2}
                    strokeMiterlimit={10}
                    strokeDasharray='12'
                  />
                </G>
              </Svg>
            </View>
          }
        ></Card>
      </Wrapper>
    </View>
  );
};

export default Location;
