import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  Keyboard,
  KeyboardEvent,
  Platform,
  TextInput,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
} from 'react-native';

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  extraScrollHeight?: number;
  basePaddingBottom?: number;
}

/**
 * ScrollView inteligente que mede a posição exata na tela do TextInput focado
 * via measureInWindow e rola apenas os pixels necessários para deixá-lo acima do teclado.
 */
export const KeyboardAwareScrollView: React.FC<KeyboardAwareScrollViewProps> = ({
  children,
  extraScrollHeight = 56,
  basePaddingBottom = 32,
  contentContainerStyle,
  onScroll,
  ...rest
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const currentScrollY = useRef(0);
  const keyboardInfo = useRef<{ height: number; screenY?: number }>({ height: 0 });
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollFocusedInputIntoView = useCallback(
    (kbHeight: number, kbScreenY?: number) => {
      if (kbHeight <= 0) return;

      const focusedInput = TextInput.State.currentlyFocusedInput?.();
      if (!focusedInput || typeof focusedInput.measureInWindow !== 'function') return;

      focusedInput.measureInWindow((_x: number, y: number, _w: number, height: number) => {
        const windowHeight = Dimensions.get('window').height;
        const calculatedTop = windowHeight - kbHeight;
        const keyboardTop =
          kbScreenY && kbScreenY > 0 ? Math.min(kbScreenY, calculatedTop) : calculatedTop;
        const inputBottom = y + height + extraScrollHeight;

        if (inputBottom > keyboardTop) {
          const overlap = inputBottom - keyboardTop;
          scrollRef.current?.scrollTo({
            y: currentScrollY.current + overlap,
            animated: true,
          });
        }
      });
    },
    [extraScrollHeight]
  );

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      const height = e.endCoordinates?.height || 0;
      const screenY = e.endCoordinates?.screenY;
      keyboardInfo.current = { height, screenY };
      setKeyboardHeight(height);

      setTimeout(() => {
        scrollFocusedInputIntoView(height, screenY);
      }, 140);
    };

    const onHide = () => {
      keyboardInfo.current = { height: 0 };
      setKeyboardHeight(0);
    };

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [scrollFocusedInputIntoView]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    currentScrollY.current = e.nativeEvent.contentOffset.y;
    onScroll?.(e);
  };

  const handleFocusCapture = () => {
    const { height, screenY } = keyboardInfo.current;
    if (height > 0) {
      setTimeout(() => {
        scrollFocusedInputIntoView(height, screenY);
      }, 140);
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      contentContainerStyle={[
        contentContainerStyle,
        {
          paddingBottom:
            keyboardHeight > 0 ? keyboardHeight + extraScrollHeight : basePaddingBottom,
        },
      ]}
      {...rest}
    >
      <View onTouchStart={handleFocusCapture}>{children}</View>
    </ScrollView>
  );
};

export default KeyboardAwareScrollView;
