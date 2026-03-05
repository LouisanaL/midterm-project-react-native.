// src/styles/AppliedJobDetailScreen.styles.ts
import { Dimensions, StyleSheet } from 'react-native';

export const BANNER_HEIGHT = 200;

export const infoRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    width: 80,
    paddingTop: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});

export const styles = StyleSheet.create({
  container: { flex: 1 },

  // Banner
  banner: { width: '100%', height: BANNER_HEIGHT },
  bannerImage: { width: '100%', height: '100%' },
  bannerFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerFallbackText: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // Floating header buttons
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  content: { paddingHorizontal: 20, paddingTop: 20 },
  jobTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  // Meta row (date + status badge)
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: { fontSize: 12, fontWeight: '500' },

  // Status badge (display only)
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },

  // Cards
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  divider: { height: 1, marginBottom: 4 },

  // Status timeline
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  timelineItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: 10,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: 0,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    marginBottom: 6,
  },
  timelineLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  timelineLabelActive: {
    fontWeight: '800',
  },

  // Status note banner
  statusNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusNoteText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },

  // Why hire block
  whyBlock: { paddingTop: 12 },
  whyLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  whyValue: { fontSize: 14, lineHeight: 22, fontWeight: '400' },

  // Link button
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  linkBtnText: { fontSize: 14, fontWeight: '700' },
});