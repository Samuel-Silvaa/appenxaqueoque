import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import './locale';

import CalendarComponent from '../shared/components/calendar/CalendarComponent';
import { useApp } from 'src/infra/app/app';
import { useEffect, useMemo, useState } from 'react';
import { AppActions } from 'src/infra/app/actions';
import { format } from 'date-fns';
import { Text, View } from 'react-native';
import { Acuteness } from 'src/infra/@types/app.types';
import EpisodeModal from 'src/modules/shared/components/episodemodal/EpisodeModal';
import { pinColor } from 'src/infra/utils/appUtils';

const InnerHomeContainer = () => {
  const { episodes, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState();

  useEffect(() => {
    dispatch(AppActions.REQUEST_FETCH_EPISODES);
  }, []);

  const parsedEpisodes = useMemo(() => {
    if (Array.isArray(episodes)) {
      const markedDates = {};
      episodes.map((ep) => {
        markedDates[format(ep.dateTime, 'yyyy-MM-dd')] = {
          selected: true,
          marked: true,
          selectedColor: pinColor(ep.acuteness),
          dotColor: pinColor(ep.acuteness),
        };
      });
      return markedDates;
    } else {
      return {};
    }
  }, [episodes]);

  return (
    <View>
      <CalendarComponent
        onDayPress={(date) => {
          if (Object.keys(parsedEpisodes).includes(date.dateString)) {
            setIsModalOpen(true);
            setSelectedEpisode(
              episodes?.find(
                (ep) => format(ep.dateTime, 'yyyy-MM-dd') == date.dateString
              ) || null
            );
          }
        }}
        markedDates={parsedEpisodes}
      />
      {isModalOpen && selectedEpisode && (
        <EpisodeModal
          episode={{
            ...selectedEpisode,
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

const CalendarSubtitle = () => {
  return (
    <View className='flex-row justify-around item-center w-full my-8 '>
      <Text>
        <View
          style={{ backgroundColor: pinColor(Acuteness.SEVERE) }}
          className='w-3 h-3 rounded-full mx-2'
        ></View>
        Forte
      </Text>
      <Text>
        <View
          style={{ backgroundColor: pinColor(Acuteness.MILD) }}
          className='w-3 h-3 rounded-full  mx-2'
        ></View>
        Moderada
      </Text>
      <Text>
        <View
          style={{ backgroundColor: pinColor(Acuteness.LIGHT) }}
          className='w-3 h-3 rounded-full  mx-2'
        ></View>
        Leve
      </Text>
    </View>
  );
};

const CalendarPage = () => {
  return (
    <AppPageScaffold>
      <InnerHomeContainer />
      <CalendarSubtitle />
    </AppPageScaffold>
  );
};

export default CalendarPage;
