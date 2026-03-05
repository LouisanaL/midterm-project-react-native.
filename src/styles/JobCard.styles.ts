// src/components/JobCard.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginRight: 12,
  },
  logo: {
    width: 44,
    height: 44,
  },
  logoFallback: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    fontSize: 18,
    fontWeight: '700',
  },
  titleSection: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  company: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 'auto',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 28,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  salaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  viewDetail: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  applyBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});