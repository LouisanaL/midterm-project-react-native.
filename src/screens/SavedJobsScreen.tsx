// src/screens/SavedJobsScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useSavedJobs } from '../context/SavedJobsContext';
import JobCard from '../components/JobCard';
import { Job } from '../types';

const SavedJobsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const { savedJobs } = useSavedJobs();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return savedJobs;
    const query = searchQuery.toLowerCase().trim();
    return savedJobs.filter(
      (job: Job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query)
    );
  }, [savedJobs, searchQuery]);

  const renderItem = ({ item }: { item: Job }) => (
    <JobCard job={item} showRemoveButton={true} fromSavedJobs={true} />
  );

  const keyExtractor = (item: Job) => item.id;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerEyebrow, { color: colors.saved }]}>Bookmarked</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Jobs</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.savedLight, borderColor: colors.saved + '40' }]}>
            <Text style={[styles.countText, { color: colors.saved }]}>{savedJobs.length}</Text>
          </View>
        </View>

        {savedJobs.length > 0 && (
          <View style={[styles.searchBar, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Text style={[styles.searchIcon, { color: colors.textMuted }]}>⌕</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search saved jobs..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={{ color: colors.textMuted, fontSize: 14, fontWeight: '600' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {filteredJobs.length === 0 ? (
        <View style={styles.emptyState}>
          {savedJobs.length === 0 ? (
            <>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.savedLight, borderColor: colors.saved + '30' }]}>
                <Ionicons name="bookmark-outline" size={36} color={colors.saved} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved jobs yet</Text>
              <Text style={[styles.emptyMsg, { color: colors.textMuted }]}>
                Bookmark roles from the Discover tab and they will appear here for easy access.
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No matches found</Text>
              <Text style={[styles.emptyMsg, { color: colors.textMuted }]}>
                No saved jobs match "{searchQuery}".
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.resultsCount, { color: colors.textMuted }]}>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} saved
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  countBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  countText: {
    fontSize: 17,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    gap: 10,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 4,
    paddingTop: 14,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyMsg: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
});

export default SavedJobsScreen;