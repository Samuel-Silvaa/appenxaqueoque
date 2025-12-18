import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import './locale';

import CalendarComponent from '../shared/components/calendar/CalendarComponent';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { View } from 'react-native';
import { pinColor } from 'src/infra/utils/appUtils';
import AcutenessLegend from '../shared/components/calendar/AcutenessLegend';
import { Episode } from 'src/infra/@types/app.types';
import { useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";
import { useNavigation } from "@react-navigation/native";
import CalendarEpisodeListModal from "src/modules/shared/components/calendarEpísodeListModal/CalendarEpisodeListModal";
import { set } from 'lodash';

const InnerHomeContainer = () => {
  const appState = useSelector(appStateSelector);
  const navigation = useNavigation<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDateEpisodes, setSelectedDateEpisodes] = useState<Episode[] | null>(null);

  const parsedEpisodes = useMemo(() => {
    if (Array.isArray(appState.episodes)) {
      const markedDates: any = {};
      appState.episodes.map((ep) => {
        markedDates[format(ep.dateTime!, 'yyyy-MM-dd')] = {
          selected: true,
          marked: true,
          selectedColor: pinColor(ep.acuteness!),
          dotColor: pinColor(ep.acuteness!),
        };
      });
      return markedDates;
    } else {
      return {};
    }
  }, [appState.episodes, selectedDateEpisodes, navigation]);

  useEffect(() => {
    return () => {
      setSelectedDateEpisodes(null);
      setIsOpen(false);
    }
  }, [])

  return (
    <View className='flex-grow'>
      <CalendarComponent
        displayMessage
        onDayPress={(date) => {
          if (Object.keys(parsedEpisodes).includes(date.dateString)) {
            const selectedEpisode = appState.episodes?.filter(
              (ep) => format(ep.dateTime!, 'yyyy-MM-dd') == date.dateString
            )! || null;

            if (selectedEpisode.length > 1) {
              setSelectedDateEpisodes(selectedEpisode);
              setIsOpen(true);
              return;
            }

            navigation.navigate('EpisodeDetails', {
              episode: {
                ...(selectedEpisode[0] as Episode),
                period: Number(selectedEpisode[0]?.period) == 1 ? 'true' : 'false',
                dates: {
                  [format(selectedEpisode[0].dateTime!, 'yyyy-MM-dd').toString()]:
                    parsedEpisodes[format(selectedEpisode[0].dateTime!, 'yyyy-MM-dd')],
                },
              }
            });

          }
        }}
        markedDates={parsedEpisodes}

      />
      {isOpen && (

        <CalendarEpisodeListModal
          episodes={selectedDateEpisodes!}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </View>
  );
};

const CalendarPage = () => {
  return (
    <AppPageScaffold>
      <InnerHomeContainer />
      <AcutenessLegend />
    </AppPageScaffold>
  );
};

export default CalendarPage;
