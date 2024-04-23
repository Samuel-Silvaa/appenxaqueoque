import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { getAlignment } from 'src/modules/shared/style/SharedProcessedStyle';
import ExPressable from '../buttons/pressable/ExPressable';

const stylesheet = {
  view: 'flex-col flex-grow bg-primary p-4 gap-y-4 pb-14',
  header: 'my-6 self-start',
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
}: AuthScaffoldProps) => {
  return (
    <View className={`${stylesheet.view} ${getAlignment(alignment)}`}>
      <StatusBar />

      {children}

      <View className='w-full gap-y-2'>
        {ctaPrimary && ctaPrimaryText && (
          <ExPressable
            title={ctaPrimaryText}
            icon={ctaPrimaryLeftIcon}
            onPress={ctaPrimary}
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
    </View>
  );
};

export default AuthScaffold;
