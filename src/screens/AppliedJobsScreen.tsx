// src/screens/AppliedJobsScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppliedJobs } from '../context/AppliedJobsContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Job, AppliedJob, ApplicationStatus, RootStackParamList } from '../types';
import { styles, cardStyles } from '../styles/AppliedJobScreen.styles';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#2563EB', bg: '#EFF6FF' },
  viewed:    { label: 'Viewed',    color: '#D97706', bg: '#FFFBEB' },
  rejected:  { label: 'Rejected',  color: '#DC2626', bg: '#FEF2F2' },
  accepted:  { label: 'Accepted',  color: '#059669', bg: '#ECFDF5' },
};

/* ── Info chip ── */
const InfoChip: React.FC<{ icon: any; label: string; colors: any }> = ({ icon, label, colors }) => (
  <View style={cardStyles.chipRow}>
    <Ionicons name={icon} size={12} color={colors.textMuted} />
    <Text style={[cardStyles.chipText, { color: colors.textSecondary }]} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

/* ── Applied job card ── */
const AppliedJobCard: React.FC<{ item: AppliedJob; colors: any }> = ({ item, colors }) => {
  const navigation = useNavigation<NavProp>();

  const timeAgo = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const diffDays = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      return `${Math.floor(diffDays / 30)}mo ago`;
    } catch { return ''; }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch { return ''; }
  };

  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.submitted;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => navigation.navigate('AppliedJobDetail', { job: item })}
      style={[cardStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {/* Title + status badge */}
      <View style={cardStyles.topRow}>
        <View style={cardStyles.titleBlock}>
          <Text style={[cardStyles.title, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[cardStyles.company, { color: colors.primary }]} numberOfLines={1}>
            {item.company}
          </Text>
        </View>
        <View style={[cardStyles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.color + '40' }]}>
          <View style={[cardStyles.statusDot, { backgroundColor: cfg.color }]} />
          <Text style={[cardStyles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[cardStyles.divider, { backgroundColor: colors.border }]} />

      {/* Applicant info */}
      <View style={cardStyles.infoGrid}>
        <InfoChip icon="person-outline" label={item.form.name}          colors={colors} />
        <InfoChip icon="mail-outline"   label={item.form.email}         colors={colors} />
        <InfoChip icon="call-outline"   label={item.form.contactNumber} colors={colors} />
      </View>

      {/* Footer: date + view details */}
      <View style={cardStyles.footer}>
        <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
        <Text style={[cardStyles.footerText, { color: colors.textMuted }]}>
          Applied {formatDate(item.appliedAt)}
          {timeAgo(item.appliedAt) ? `  ·  ${timeAgo(item.appliedAt)}` : ''}
        </Text>
        <View style={cardStyles.spacer} />
        <Text style={[cardStyles.viewDetail, { color: colors.primary }]}>View details →</Text>
      </View>
    </TouchableOpacity>
  );
};

/* ── Main screen ── */
const AppliedJobsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const { appliedJobs } = useAppliedJobs();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return appliedJobs;
    const query = searchQuery.toLowerCase().trim();
    return appliedJobs.filter(
      (job: AppliedJob) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query) ||
        job.form.name.toLowerCase().includes(query) ||
        job.form.email.toLowerCase().includes(query)
    );
  }, [appliedJobs, searchQuery]);

  const renderItem = ({ item }: { item: AppliedJob }) => (
    <AppliedJobCard item={item} colors={colors} />
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
            <Text style={[styles.headerEyebrow, { color: colors.primary }]}>Applications</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Applied Jobs</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '40' }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>{appliedJobs.length}</Text>
          </View>
        </View>

        {appliedJobs.length > 0 && (
          <View style={[styles.searchBar, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Text style={[styles.searchIcon, { color: colors.textMuted }]}>⌕</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by job, company, or name..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ color: colors.textMuted, fontSize: 14, fontWeight: '600' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {filteredJobs.length === 0 ? (
        <View style={styles.emptyState}>
          {appliedJobs.length === 0 ? (
            <>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' }]}>
                <Ionicons name="checkmark-done-outline" size={36} color={colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No applications yet</Text>
              <Text style={[styles.emptyMsg, { color: colors.textMuted }]}>
                Submit an application from a job posting and it'll show up here.
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No matches found</Text>
              <Text style={[styles.emptyMsg, { color: colors.textMuted }]}>
                No applied jobs match "{searchQuery}".
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
              {filteredJobs.length} {filteredJobs.length === 1 ? 'application' : 'applications'}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default AppliedJobsScreen;