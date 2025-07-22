export const getAlignment = (alignment: string) => {
  switch (alignment) {
    case 'start':
      return ' items-start justify-between';
    default:
      return 'items-center justify-between';
  }
};

export const getAppScaffoldAlignment = (alignment: string) => {
  switch (alignment) {
    case 'start':
      return ' items-start';
    default:
      return 'items-center justify-center';
  }
};

export const getBtnColorScheme = (
  scheme: string
): { pressable: string; title: string } => {
  const stylesheet = {
    pressable:
      'w-full flex flex-row items-center justify-center round rounded-full h-[63px] px-4 ',
    title: 'font-semibold mx-4 dark:text-white',
  };
  switch (scheme) {
    case 'primary':
      return {
        pressable: `${stylesheet.pressable} bg-blue-primary dark:bg-d-blue-primary`,
        title: ` ${stylesheet.title} text-primary`,
      };
    case 'secondary':
      return {
        pressable: `${stylesheet.pressable} bg-blue-primary dark:bg-d-blue-primary`,
        title: `text-white ${stylesheet.title}`,
      };
    default:
      return {
        pressable: `${stylesheet.pressable} bg-white dark:bg-d-blue-primary-dark`,
        title: `dark:text-d-text-gray ${stylesheet.title} `,
      };
  }
};
