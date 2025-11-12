import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import {
  ImageSourcePropType,
  KeyboardAvoidingView,
  View,
  Appearance,
} from 'react-native';
import { getAlignment } from 'src/modules/shared/style/SharedProcessedStyle';
import ExPressable from '../buttons/pressable/ExPressable';

const stylesheet = {
  view: 'flex-col flex-grow bg-primary px-4 gap-y-2 pb-14 dark:bg-d-blue-primary-dark relative ',
};

interface AuthScaffoldProps {
  alignment?: string;
  justify?: string;
  hasArrowBack?: boolean;
  children: ReactNode;
  ctaPrimary?: () => void;
  ctaPrimaryText?: string;
  ctaPrimaryLeftIcon?: ImageSourcePropType;
  ctaSecondary?: () => void;
  ctaSecondaryText?: string;
  ctaSecondaryLeftIcon?: ImageSourcePropType;
  isPrimaryBtnEnabled?: boolean;
}

const AuthScaffold = ({
  children,
  alignment = 'items-start',
  ctaPrimary,
  ctaPrimaryText,
  ctaPrimaryLeftIcon,
  ctaSecondary,
  ctaSecondaryText,
  ctaSecondaryLeftIcon,
  isPrimaryBtnEnabled,
}: AuthScaffoldProps) => {
  return (
    <KeyboardAvoidingView
      className={`${stylesheet.view} ${getAlignment(alignment)}`}
      keyboardVerticalOffset={100}
      enabled
      behavior='padding'
    >
      <StatusBar
        style={Appearance.getColorScheme() == 'light' ? 'light' : 'dark'}
      />

      {children}

      <View className='w-full gap-y-2 mb-8'>
        {ctaPrimary && ctaPrimaryText && (
          <ExPressable
            title={ctaPrimaryText}
            icon={ctaPrimaryLeftIcon}
            onPress={ctaPrimary}
            disabled={isPrimaryBtnEnabled}
          ></ExPressable>
        )}
        {ctaSecondary && ctaSecondaryText && (
          <ExPressable
            title={ctaSecondaryText}
            colorScheme='light'
            onPress={ctaSecondary}
            icon={ctaSecondaryLeftIcon}
          ></ExPressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScaffold;
