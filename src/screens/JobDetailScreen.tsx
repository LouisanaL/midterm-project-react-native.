// src/screens/JobDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSavedJobs } from '../context/SavedJobsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetail'>;

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

const BookmarkIcon: React.FC<{ saved: boolean; savedColor: string; unsavedColor: string }> = ({ saved, savedColor, unsavedColor }) => (
  <Ionicons
    name={saved ? 'bookmark' : 'bookmark-outline'}
    size={22}
    color={saved ? savedColor : unsavedColor}
  />
);

const JobDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job, fromSavedJobs } = route.params;
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const saved = isJobSaved(job.id);

  // remove emojis from description text
  const stripEmojis = (str: string): string => {
    // simplified emoji filter (uses unicode flag to support >U+FFFF codepoints)
    return str.replace(/([\u{1F300}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '');
  };

  // split description into bulletable lines
  const formatDescription = (text: string): string[] => {
    const cleaned = stripEmojis(text);
    let parts = cleaned.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
    parts = cleaned.split(/(?:\. |\? |! )/).map(l => l.trim()).filter(Boolean);
    return parts;
  };

  const handleSaveToggle = () => {
    if (saved) {
      Alert.alert('Remove Job', `Remove "${job.title}" from saved jobs?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeJob(job.id) },
      ]);
    } else {
      saveJob(job);
    }
  };

  const handleApply = () => {
    navigation.navigate('ApplicationForm', { job, fromSavedJobs });
  };

  const handleOpenUrl = async () => {
    if (job.applyUrl) {
      try {
        await Linking.openURL(job.applyUrl);
      } catch {
        // silently fail
      }
    }
  };

  const timeAgo = (dateString?: string): string => {
    if (!dateString) return 'Recently posted';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Posted today';
      if (diffDays === 1) return 'Posted yesterday';
      if (diffDays < 7) return `Posted ${diffDays} days ago`;
      if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
      return `Posted ${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Recently posted';
    }
  };

  const InfoChip: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
    <View style={[styles.chip, { backgroundColor: accent ? colors.primaryLight : colors.surface, borderColor: accent ? colors.primary + '30' : colors.border }]}>
      <Text style={[styles.chipLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.chipValue, { color: accent ? colors.primary : colors.text }]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Banner Image */}
        <View style={[styles.banner, { backgroundColor: colors.primaryLight }]}>
          {!bannerError && job.companyImage ? (
            <Image
              source={{ uri: job.companyImage }}
              style={styles.bannerImage}
              resizeMode="cover"
              onError={() => setBannerError(true)}
            />
          ) : (
            <View style={[styles.bannerFallback, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.bannerFallbackText, { color: colors.primary + '60' }]}>
                {job.company.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Gradient overlay */}
          <View style={styles.bannerOverlay} />

          {/* Back button */}
          <SafeAreaView edges={['top']} style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.headerBtn, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
              activeOpacity={0.8}
            >
              <Text style={styles.headerBtnText}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSaveToggle}
              style={[styles.headerBtn, { backgroundColor: saved ? colors.saved + 'DD' : 'rgba(0,0,0,0.35)' }]}
              activeOpacity={0.8}
            >
              <BookmarkIcon saved={saved} savedColor="#FFF" unsavedColor="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Company Logo overlapping banner */}
        <View style={[styles.logoContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.logoWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            {!logoError && job.companyLogo ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.logo}
                resizeMode="cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <View style={[styles.logoFallback, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.logoFallbackText, { color: colors.primary }]}>
                  {job.company.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
          <Text style={[styles.companyName, { color: colors.primary }]}>{job.company}</Text>
          <Text style={[styles.postedDate, { color: colors.textMuted }]}>{timeAgo(job.postedAt)}</Text>

          {/* Info Grid */}
          <View style={styles.chipsGrid}>
            <InfoChip label="Location" value={job.location} />
            <InfoChip label="Salary" value={job.salary} accent />
            <InfoChip label="Type" value={job.type} />
            <InfoChip label="Category" value={job.category} />
          </View>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills & Tags</Text>
              <View style={styles.tagsWrap}>
                {job.tags.map((tag, i) => (
                  <View key={i} style={[styles.tagPill, { backgroundColor: colors.tagBackground, borderColor: colors.border }]}>
                    <Text style={[styles.tagPillText, { color: colors.tagText }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Description</Text>
            {/* bulletize and strip emojis from description */}
            {formatDescription(job.description).map((line, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bullet, { color: colors.textSecondary }]}>•</Text>
                <Text style={[styles.descriptionText, { color: colors.textSecondary, flex: 1 }]}>{line}</Text>
              </View>
            ))}
          </View>

          {/* Apply URL */}
          {job.applyUrl ? (
            <TouchableOpacity onPress={handleOpenUrl} activeOpacity={0.8}>
              <Text style={[styles.externalLink, { color: colors.primary }]}>
                View original posting →
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={[styles.bottomCTA, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.ctaInfo}>
          <Text style={[styles.ctaTitle, { color: colors.text }]} numberOfLines={1}>{job.title}</Text>
          <Text style={[styles.ctaCompany, { color: colors.textMuted }]}>{job.company}</Text>
        </View>
        <TouchableOpacity
          style={[styles.applyBtn, { backgroundColor: colors.primary }]}
          onPress={handleApply}
          activeOpacity={0.85}
        >
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    marginRight: 6,
    fontSize: 18,
    lineHeight: 22,
  },
  container: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: BANNER_HEIGHT,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerFallbackText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 8,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  logoContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: -28,
    marginBottom: 4,
  },
  logoWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  logo: {
    width: 56,
    height: 56,
  },
  logoFallback: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    fontSize: 22,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
    lineHeight: 28,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  postedDate: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 20,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    minWidth: (width - 60) / 2,
    flex: 1,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  chipValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 23,
  },
  externalLink: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    gap: 14,
  },
  ctaInfo: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  ctaCompany: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  applyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export default JobDetailScreen;