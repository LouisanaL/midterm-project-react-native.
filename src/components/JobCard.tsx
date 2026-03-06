// src/components/JobCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Job, RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAppliedJobs } from '../context/AppliedJobsContext';
import { styles } from '../styles/JobCard.styles';

interface JobCardProps {
  job: Job;
  showRemoveButton?: boolean;
  fromSavedJobs?: boolean;
  fromAppliedJobs?: boolean;
}

const BookmarkIcon: React.FC<{ saved: boolean; color: string; savedColor: string }> = ({
  saved,
  color,
  savedColor,
}) => (
  <Ionicons
    name={saved ? 'bookmark' : 'bookmark-outline'}
    size={20}
    color={saved ? savedColor : color}
  />
);

const JobCard: React.FC<JobCardProps> = ({
  job,
  showRemoveButton = false,
  fromSavedJobs = false,
  fromAppliedJobs = false,
}) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const { removeAppliedJob, isJobApplied } = useAppliedJobs();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);

  const handleSave = () => {
    if (saved) return;
    saveJob(job);
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Job',
      `Remove "${job.title}" from ${fromSavedJobs ? 'saved' : 'applied'} jobs?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => fromSavedJobs ? removeJob(job.id) : removeAppliedJob(job.id),
        },
      ]
    );
  };

  const handleApply = () => {
    if (applied) return;
    navigation.navigate('ApplicationForm', { job });
  };

  const handleCardPress = () => {
    if (fromAppliedJobs) {
      navigation.navigate('AppliedJobDetail', { job: job as any });
    } else {
      navigation.navigate('JobDetail', { job, fromSavedJobs });
    }
  };

  const stripEmojis = (str: string): string =>
    str.replace(/([\u{1F300}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '');

  const truncateDescription = (text: string, maxLength: number = 100) => {
    const clean = stripEmojis(text);
    if (clean.length <= maxLength) return clean;
    return clean.substring(0, maxLength).trim() + '...';
  };

  const timeAgo = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const diffDays = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      return `${Math.floor(diffDays / 30)}mo ago`;
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.93}
      onPress={handleCardPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          borderColor: applied ? colors.success + '60' : colors.border,
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.header}>
        {/* Company Logo */}
        <View style={[styles.logoWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {job.companyLogo ? (
            <Image
              source={{ uri: job.companyLogo }}
              style={styles.logo}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.logoFallback, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.logoFallbackText, { color: colors.primary }]}>
                {job.company.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Title & Company */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={[styles.company, { color: colors.textMuted }]} numberOfLines={1}>
            {job.company}
          </Text>
        </View>

        {/* Bookmark or Remove button */}
        {!showRemoveButton ? (
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.7}
            style={[
              styles.actionBtn,
              {
                backgroundColor: saved ? colors.savedLight : colors.surface,
                borderColor: saved ? colors.saved : colors.border,
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <BookmarkIcon saved={saved} color={colors.textMuted} savedColor={colors.saved} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleRemove}
            activeOpacity={0.7}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.removeButton, borderColor: colors.error + '30' },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ fontSize: 15, color: colors.removeButtonText }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        <View style={[styles.tag, { backgroundColor: colors.tagBackground }]}>
          <Text style={[styles.tagText, { color: colors.tagText }]}>{job.type}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.tagText, { color: colors.primary }]}>{job.category}</Text>
        </View>
        {/* Applied badge */}
        {applied && (
          <View style={[styles.tag, { backgroundColor: colors.successLight, flexDirection: 'row', alignItems: 'center', gap: 3 }]}>
            <Ionicons name="checkmark-circle" size={11} color={colors.success} />
            <Text style={[styles.tagText, { color: colors.success }]}>Applied</Text>
          </View>
        )}
        {job.postedAt ? (
          <Text style={[styles.dateText, { color: colors.textMuted }]}>{timeAgo(job.postedAt)}</Text>
        ) : null}
      </View>

      {/* Location & Salary */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Location</Text>
          <Text style={[styles.metaValue, { color: colors.textSecondary }]} numberOfLines={1}>
            {job.location}
          </Text>
        </View>
        <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
        <View style={styles.metaItem}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Salary</Text>
          <Text style={[styles.salaryValue, { color: colors.success }]} numberOfLines={1}>
            {job.salary}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: colors.textMuted }]}>
        {truncateDescription(job.description)}
      </Text>

      {/* Footer — hide Apply button on applied-jobs cards */}
      <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
        <Text style={[styles.viewDetail, { color: colors.primary }]}>View Details</Text>
        {!fromAppliedJobs && (
          <TouchableOpacity
            style={[
              styles.applyBtn,
              {
                backgroundColor: applied ? colors.successLight : colors.primary,
                borderWidth: applied ? 1 : 0,
                borderColor: applied ? colors.success + '60' : 'transparent',
              },
            ]}
            onPress={handleApply}
            activeOpacity={applied ? 1 : 0.85}
            disabled={applied}
          >
            {applied ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={[styles.applyBtnText, { color: colors.success }]}>Applied</Text>
              </View>
            ) : (
              <Text style={styles.applyBtnText}>Apply Now</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;