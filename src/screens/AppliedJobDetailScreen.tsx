// src/screens/AppliedJobDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, AppliedJob, ApplicationStatus } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAppliedJobs } from '../context/AppliedJobsContext';
import { Ionicons } from '@expo/vector-icons';
import { styles, infoRowStyles, BANNER_HEIGHT } from '../styles/AppliedJobDetailScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AppliedJobDetail'>;

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; icon: string }> = {
  submitted: { label: 'Submitted', color: '#2563EB', bg: '#EFF6FF', icon: 'paper-plane-outline' },
  viewed:    { label: 'Viewed',    color: '#D97706', bg: '#FFFBEB', icon: 'eye-outline' },
  rejected:  { label: 'Rejected',  color: '#DC2626', bg: '#FEF2F2', icon: 'close-circle-outline' },
  accepted:  { label: 'Accepted',  color: '#059669', bg: '#ECFDF5', icon: 'checkmark-circle-outline' },
};

/* ── Reusable info row ── */
const InfoRow: React.FC<{ label: string; value: string; colors: any }> = ({ label, value, colors }) => (
  <View style={infoRowStyles.row}>
    <Text style={[infoRowStyles.label, { color: colors.textMuted }]}>{label}</Text>
    <Text style={[infoRowStyles.value, { color: colors.text }]} selectable>{value}</Text>
  </View>
);

const AppliedJobDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job } = route.params as { job: AppliedJob };
  const { colors } = useTheme();
  const { removeAppliedJob } = useAppliedJobs();
  const [bannerError, setBannerError] = useState(false);

  const handleRemove = () => {
    Alert.alert('Remove Application', `Remove your application for "${job.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeAppliedJob(job.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleOpenUrl = async () => {
    if (job.applyUrl) {
      try { await Linking.openURL(job.applyUrl); } catch {}
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch { return ''; }
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
    } catch { return ''; }
  };

  const currentStatus = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.submitted;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Banner */}
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
          <View style={styles.bannerOverlay} />
        </View>

        {/* Floating header buttons anchored to safe-area top */}
        <SafeAreaView edges={['top']} style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          <View style={styles.headerButtons} pointerEvents="box-none">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.headerBtn, { backgroundColor: 'rgba(0,0,0,0.40)' }]}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRemove}
              style={[styles.headerBtn, { backgroundColor: colors.error + 'DD' }]}
              activeOpacity={0.8}
            >
              <Ionicons name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Main content */}
        <View style={styles.content}>

          <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
          <Text style={[styles.companyName, { color: colors.primary }]}>{job.company}</Text>

          {/* Applied date + status badge row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                Applied {formatDate(job.appliedAt)}
                {timeAgo(job.appliedAt) ? `  ·  ${timeAgo(job.appliedAt)}` : ''}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: currentStatus.bg, borderColor: currentStatus.color + '40' }]}>
              <View style={[styles.statusDot, { backgroundColor: currentStatus.color }]} />
              <Text style={[styles.statusBadgeText, { color: currentStatus.color }]}>
                {currentStatus.label}
              </Text>
            </View>
          </View>

          {/* ── Application Status (read-only) ── */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Application Status</Text>
            </View>

            {/* Status timeline */}
            <View style={styles.timeline}>
              {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((s, index, arr) => {
                const cfg = STATUS_CONFIG[s];
                const isActive = job.status === s;
                const isPast = arr.indexOf(job.status) > index;
                const isLast = index === arr.length - 1;
                const isDone = isActive || isPast;

                return (
                  <View key={s} style={styles.timelineItem}>
                    {/* Line connector */}
                    {!isLast && (
                      <View style={[
                        styles.timelineLine,
                        { backgroundColor: isPast ? currentStatus.color : colors.border },
                      ]} />
                    )}
                    {/* Dot */}
                    <View style={[
                      styles.timelineDot,
                      {
                        backgroundColor: isDone ? cfg.color : colors.inputBackground,
                        borderColor: isDone ? cfg.color : colors.border,
                      },
                    ]}>
                      {isDone && (
                        <Ionicons name={cfg.icon as any} size={10} color="#fff" />
                      )}
                    </View>
                    {/* Label */}
                    <Text style={[
                      styles.timelineLabel,
                      { color: isActive ? cfg.color : isPast ? colors.textSecondary : colors.textMuted },
                      isActive && styles.timelineLabelActive,
                    ]}>
                      {cfg.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Status description */}
            <View style={[styles.statusNote, { backgroundColor: currentStatus.bg, borderColor: currentStatus.color + '30' }]}>
              <Ionicons name={currentStatus.icon as any} size={16} color={currentStatus.color} />
              <Text style={[styles.statusNoteText, { color: currentStatus.color }]}>
                {job.status === 'submitted' && 'Your application has been submitted and is awaiting review.'}
                {job.status === 'viewed' && 'The hiring team has viewed your application.'}
                {job.status === 'rejected' && 'Unfortunately, your application was not selected at this time.'}
                {job.status === 'accepted' && 'Congratulations! Your application has been accepted.'}
              </Text>
            </View>
          </View>

          {/* ── Your Application (read-only) ── */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={16} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Your Application</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow label="Full Name" value={job.form.name}          colors={colors} />
            <InfoRow label="Email"     value={job.form.email}         colors={colors} />
            <InfoRow label="Contact"   value={job.form.contactNumber} colors={colors} />
            <View style={styles.whyBlock}>
              <Text style={[styles.whyLabel, { color: colors.textMuted }]}>Why should we hire you?</Text>
              <Text style={[styles.whyValue, { color: colors.text }]}>{job.form.whyHireYou}</Text>
            </View>
          </View>

          {/* Original posting link */}
          {job.applyUrl && (
            <TouchableOpacity
              onPress={handleOpenUrl}
              activeOpacity={0.8}
              style={[styles.linkBtn, { borderColor: colors.primary + '40', backgroundColor: colors.primaryLight }]}
            >
              <Ionicons name="open-outline" size={15} color={colors.primary} />
              <Text style={[styles.linkBtnText, { color: colors.primary }]}>View original posting</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AppliedJobDetailScreen;