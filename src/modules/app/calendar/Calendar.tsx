import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import './locale';

import CalendarComponent from '../shared/components/calendar/CalendarComponent';
import { useApp } from 'src/infra/app/app';
import { useEffect, useMemo, useState } from 'react';
import { AppActions } from 'src/infra/app/actions';
import { format } from 'date-fns';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Acuteness } from 'src/infra/@types/app.types';

const CustomModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View className='bg-blue-primary w-full h-full flex justify-center items-center'>
        <Text>Episode MOdal</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const pinColor = (acuteness: string): string => {
  switch (acuteness) {
    case Acuteness.LIGHT:
      return '#C8F7E1';
    case Acuteness.MILD:
      return '#FFCBA6';
    case Acuteness.SEVERE:
      return '#FFCACD';
    default:
      return '#9194E9';
  }
};

const InnerHomeContainer = () => {
  const { episodes, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      debugger;
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
          }
        }}
        markedDates={parsedEpisodes}
      />
      {isModalOpen && (
        <CustomModal
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
    </AppPageScaffold>
  );
};

export default CalendarPage;
