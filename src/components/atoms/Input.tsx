import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

interface InputProps {
  defaultValue?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  lines?: number;
  onChangeText?: (text: string) => void;
  placeholder: string;
}

export function Input({
  defaultValue,
  editable,
  keyboardType,
  label,
  onChangeText,
  placeholder,
  lines = 1,
}: InputProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        autoCapitalize="none"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        multiline={lines > 1}
        numberOfLines={lines}
        style={[styles.input, { height: 35 * lines }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  input: {
    color: '#000',
    fontSize: 14,
  },
  label: {
    color: 'gray',
    fontSize: 12,
    fontWeight: '600',
  },
});
