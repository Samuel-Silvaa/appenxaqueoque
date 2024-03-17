import AppPageScaffold from '../shared/components/appPageScaffold/AppPageScaffold';
import { View } from 'react-native';
import './locale';

import CalendarComponent from '../shared/components/calendar/CalendarComponent';

const InnerHomeContainer = () => {
  return <CalendarComponent />;
};

const CalendarPage = () => {
  return (
    <AppPageScaffold>
      <InnerHomeContainer />
    </AppPageScaffold>
  );
};

export default CalendarPage;
