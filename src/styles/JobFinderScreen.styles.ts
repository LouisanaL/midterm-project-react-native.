import { StyleSheet } from 'react-native';

export const createJobFinderStyles = (colors: any) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			paddingHorizontal: 16,
		},
		header: {
			paddingVertical: 12,
		},
		headerTop: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
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
		themeButton: {
			padding: 8,
			borderRadius: 8,
			backgroundColor: colors.surface,
		},
		themeButtonText: {
			fontSize: 18,
		},
		searchContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.inputBackground,
			borderRadius: 10,
			paddingHorizontal: 10,
			paddingVertical: 8,
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
		loadingContainer: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		loadingText: {
			marginTop: 12,
			color: colors.textMuted,
		},
		errorContainer: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: 20,
		},
		errorIcon: {
			fontSize: 36,
			marginBottom: 8,
		},
		errorTitle: {
			fontSize: 18,
			fontWeight: '700',
			color: colors.text,
			marginBottom: 6,
		},
		errorText: {
			color: colors.textMuted,
			textAlign: 'center',
			marginBottom: 12,
		},
		retryButton: {
			backgroundColor: colors.primary,
			paddingHorizontal: 16,
			paddingVertical: 10,
			borderRadius: 8,
		},
		retryButtonText: {
			color: '#fff',
			fontWeight: '700',
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
			alignItems: 'center',
			justifyContent: 'center',
			paddingTop: 40,
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

