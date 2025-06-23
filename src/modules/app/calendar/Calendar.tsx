import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import './locale';

import CalendarComponent from '../shared/components/calendar/CalendarComponent';
import { useApp } from 'src/infra/app/app';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { View } from 'react-native';
import EpisodeModal from 'src/modules/shared/components/episodemodal/EpisodeModal';
import { pinColor } from 'src/infra/utils/appUtils';
import AcutenessLegend from '../shared/components/calendar/AcutenessLegend';
import { Episode } from 'src/infra/@types/app.types';
import { useSelector } from "react-redux";
import { appStateSelector } from "src/infra/app/selectors";

const InnerHomeContainer = () => {
  const appState = useSelector(appStateSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>();

  const parsedEpisodes = useMemo(() => {
    if (Array.isArray(appState.episodes)) {
      const markedDates: any = {};
      appState.episodes.map((ep) => {
        markedDates[format(ep.dateTime! , 'yyyy-MM-dd')] = {
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
  }, [appState.episodes]);

  return (
    <View className='flex-grow'>
      <CalendarComponent
        onDayPress={(date) => {
          if (Object.keys(parsedEpisodes).includes(date.dateString)) {
            setIsModalOpen(true);
            setSelectedEpisode(
              appState.episodes?.find(
                (ep) => format(ep.dateTime!, 'yyyy-MM-dd') == date.dateString
              )! || null
            );
          }
        }}
        markedDates={parsedEpisodes}
      />
      {isModalOpen && selectedEpisode && selectedEpisode.dateTime && (
        <EpisodeModal
          episode={{
            ...(selectedEpisode as Episode),
            period: Number(selectedEpisode?.period) == 1 ? 'true' : 'false',
            dates: {
              [format(selectedEpisode.dateTime, 'yyyy-MM-dd').toString()]:
                parsedEpisodes[format(selectedEpisode.dateTime, 'yyyy-MM-dd')],
            },
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
