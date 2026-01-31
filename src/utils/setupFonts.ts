// src/utils/setupFonts.ts
// This file sets up Poppins as the default font for all Text components
import { Text, TextInput } from 'react-native';

const Fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const setupDefaultFonts = () => {
  // Set default font for Text component
  const oldTextRender = (Text as any).render;
  (Text as any).render = function (...args: any[]) {
    const origin = oldTextRender.call(this, ...args);
    return {
      ...origin,
      props: {
        ...origin.props,
        style: [{ fontFamily: Fonts.regular }, origin.props.style],
      },
    };
  };

  // Set default font for TextInput component
  const oldTextInputRender = (TextInput as any).render;
  (TextInput as any).render = function (...args: any[]) {
    const origin = oldTextInputRender.call(this, ...args);
    return {
      ...origin,
      props: {
        ...origin.props,
        style: [{ fontFamily: Fonts.regular }, origin.props.style],
      },
    };
  };
};

export { Fonts };
