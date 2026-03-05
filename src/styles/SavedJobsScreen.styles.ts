import { StyleSheet } from 'react-native';

export const createSavedJobsStyles = (colors: any) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			paddingHorizontal: 16,
		},
		header: {
			paddingVertical: 12,
			marginBottom: 12,
		},
		headerTitle: {
			fontSize: 24,
			fontWeight: '700',
			color: colors.text,
		},
		headerSubtitle: {
			fontSize: 14,
			color: colors.textMuted,
			marginTop: 4,
		},
		searchContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.inputBackground,
			borderRadius: 10,
			paddingHorizontal: 10,
			paddingVertical: 8,
			marginBottom: 8,
		},
		searchIcon: {
			marginRight: 8,
			fontSize: 16,
		},
		searchInput: {
			flex: 1,
			color: colors.text,
			fontSize: 16,
			padding: 0,
		},
		clearButton: {
			marginLeft: 8,
			paddingHorizontal: 8,
			paddingVertical: 4,
		},
		clearButtonText: {
			color: colors.textMuted,
			fontSize: 14,
		},
		resultsCount: {
			marginTop: 8,
			marginBottom: 6,
			color: colors.textSecondary,
			fontSize: 13,
		},
		listContent: {
			paddingBottom: 24,
		},
		emptyContainer: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		emptyIcon: {
			fontSize: 36,
			marginBottom: 8,
		},
		emptyTitle: {
			fontSize: 16,
			fontWeight: '700',
			color: colors.text,
			marginBottom: 6,
		},
		emptyText: {
			color: colors.textMuted,
			textAlign: 'center',
			paddingHorizontal: 24,
		},
	});
