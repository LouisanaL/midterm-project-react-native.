// src/screens/JobFinderScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import { Job } from '../types';

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

// normalize strings by stripping non-alphanumeric so comparisons work even if API
// returns "Full Time" (no hyphen) or similar variants.
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const JobFinderScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const { jobs, loading, error, refetch } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    jobs.forEach((j) => {
      const cat = j.category?.trim();
      // skip empty and the default "General" category that was added by mapping
      if (cat && cat.toLowerCase() !== 'general') {
        cats.add(cat);
      }
    });
    // no "All Categories" entry here; we show only real categories
    return Array.from(cats).slice(0, 10);
  }, [jobs]);

  // start with no category selected (i.e. show everything)
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (selectedType !== 'All') {
      result = result.filter((j) =>
        normalize(j.type).includes(normalize(selectedType))
      );
    }

    if (selectedCategory) {
      result = result.filter((j) => j.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j: Job) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.type.toLowerCase().includes(q)
      );
    }

    return result;
  }, [jobs, searchQuery, selectedType, selectedCategory]);

  const renderItem = ({ item }: { item: Job }) => (
    <JobCard job={item} showRemoveButton={false} fromSavedJobs={false} />
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
            <Text style={[styles.headerEyebrow, { color: colors.primary }]}>JobFinder</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Discover Roles</Text>
          </View>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Ionicons
              name={theme === 'light' ? 'moon' : 'sunny'}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Text style={[styles.searchIcon, { color: colors.textMuted }]}>⌕</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search jobs, companies, locations..."
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
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Fetching jobs for you...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Something went wrong</Text>
          <Text style={[styles.errorMsg, { color: colors.textMuted }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={refetch} activeOpacity={0.85}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* Job Type Filter */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {JOB_TYPES.map((type) => {
                  const active = selectedType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setSelectedType(type)}
                      activeOpacity={0.8}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: active ? colors.primary : colors.surface,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.filterChipText, { color: active ? '#FFF' : colors.textSecondary }]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Category Filter */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.filterRow, { paddingTop: 0, marginTop: -4, paddingBottom: 8 }]}
              >
                {allCategories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      activeOpacity={0.8}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: active ? colors.primaryLight : 'transparent',
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.categoryChipText, { color: active ? colors.primary : colors.textMuted }]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Results count */}
              <Text style={[styles.resultsCount, { color: colors.textMuted }]}>
                {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} found
                {searchQuery ? ` for "${searchQuery}"` : ''}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No jobs found</Text>
              <Text style={[styles.emptyMsg, { color: colors.textMuted }]}>
                Try adjusting your filters or search term.
              </Text>
            </View>
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
  themeToggle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorMsg: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyMsg: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default JobFinderScreen;