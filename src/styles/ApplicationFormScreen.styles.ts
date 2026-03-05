import { StyleSheet } from 'react-native';

export const createApplicationFormStyles = (colors: any) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			padding: 16,
		},
		header: {
			marginBottom: 12,
		},
		title: {
			fontSize: 20,
			fontWeight: '700',
			color: colors.text,
		},
		input: {
			backgroundColor: colors.inputBackground,
			padding: 12,
			borderRadius: 8,
			marginBottom: 12,
			color: colors.text,
		},
		submitButton: {
			backgroundColor: colors.primary,
			padding: 12,
			borderRadius: 8,
			alignItems: 'center',
		},
		submitButtonText: {
			color: '#fff',
			fontWeight: '700',
		},
	});
