import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/Colors';

interface CustomInputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  rightIcon,
  onRightIconPress,
  error,
  multiline,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          multiline ? styles.multilineWrapper : styles.singlelineWrapper,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={error ? Colors.danger : isFocused ? Colors.defesaBlue : Colors.textMuted}
            style={[styles.icon, multiline && styles.iconMultiline]}
          />
        ) : null}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            style,
          ]}
          placeholderTextColor={Colors.textMuted}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.rightIconBtn}
          >
            <Ionicons name={rightIcon} size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  singlelineWrapper: {
    minHeight: 48,
    alignItems: 'center',
  },
  multilineWrapper: {
    minHeight: 104,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  inputFocused: {
    borderColor: Colors.borderFocus,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerLight,
  },
  icon: {
    marginRight: 10,
  },
  iconMultiline: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    paddingVertical: 8,
  },
  multilineInput: {
    minHeight: 80,
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  rightIconBtn: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.dangerDark,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default CustomInput;
