// src/screens/ApplicationFormScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, ApplicationForm, ValidationErrors } from '../types';
import { useTheme } from '../context/ThemeContext';
import { validateApplicationForm, hasValidationErrors } from '../utils/validation';
import { useAppliedJobs } from '../context/AppliedJobsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplicationForm'>;

const INITIAL_FORM: ApplicationForm = {
  name: '',
  email: '',
  contactNumber: '',
  whyHireYou: '',
};

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
  hint?: string;
}

const FieldWrapper: React.FC<FieldProps & { colors: any }> = ({
  label,
  required,
  error,
  touched,
  hint,
  children,
  colors,
}) => (
  <View style={fieldStyles.wrapper}>
    <View style={fieldStyles.labelRow}>
      <Text style={[fieldStyles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={{ color: colors.error }}> *</Text>}
      </Text>
      {hint && <Text style={[fieldStyles.hint, { color: colors.textMuted }]}>{hint}</Text>}
    </View>
    {children}
    {touched && error && (
      <View style={[fieldStyles.errorRow, { backgroundColor: colors.errorLight }]}>
        <Text style={[fieldStyles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    )}
  </View>
);

const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  label: { fontSize: 14, fontWeight: '600', letterSpacing: -0.1 },
  hint: { fontSize: 11, fontWeight: '500' },
  errorRow: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  errorText: { fontSize: 12, fontWeight: '600' },
});

const ApplicationFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job, fromSavedJobs } = route.params;
  const { colors, theme } = useTheme();
  const { addAppliedJob, isJobApplied } = useAppliedJobs();

  const alreadyApplied = isJobApplied(job.id);

  const [form, setForm] = useState<ApplicationForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const updateField = (field: keyof ApplicationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newForm = { ...form, [field]: value };
      const newErrors = validateApplicationForm(newForm);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof ApplicationForm) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFocusedField(null);
    const newErrors = validateApplicationForm(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = () => {
    if (alreadyApplied) return;

    const allTouched: Record<string, boolean> = {
      name: true, email: true, contactNumber: true, whyHireYou: true,
    };
    setTouched(allTouched);
    const validationErrors = validateApplicationForm(form);
    setErrors(validationErrors);
    if (hasValidationErrors(validationErrors)) return;

    addAppliedJob(job, form);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccessModal(true);
    }, 900);
  };

  const handleSuccessOkay = () => {
    setShowSuccessModal(false);
    setForm(INITIAL_FORM);
    setErrors({});
    setTouched({});
    if (fromSavedJobs) {
      navigation.navigate('MainTabs');
    } else {
      navigation.goBack();
    }
  };

  const getInputStyle = (field: keyof ApplicationForm) => {
    const isError = touched[field] && errors[field];
    const isFocused = focusedField === field;
    return [
      styles.input,
      {
        backgroundColor: alreadyApplied ? colors.inputBackground : colors.inputBackground,
        color: alreadyApplied ? colors.textMuted : colors.text,
        borderColor: isError
          ? colors.error
          : isFocused
          ? colors.primary
          : colors.inputBorder,
        opacity: alreadyApplied ? 0.6 : 1,
      },
    ];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <SafeAreaView edges={['top']} style={[styles.headerSafe, { backgroundColor: colors.background, borderBottomColor: colors.borderLight }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.backBtnText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Application</Text>
            <Text style={[styles.headerSub, { color: colors.textMuted }]}>{job.company}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Job Summary Card */}
          <View style={[styles.jobCard, { backgroundColor: colors.surface, borderColor: alreadyApplied ? colors.success + '60' : colors.border }]}>
            <View style={[styles.jobCardAccent, { backgroundColor: alreadyApplied ? colors.success : colors.primary }]} />
            <View style={styles.jobCardInner}>
              <View style={[styles.jobLogoWrapper, { borderColor: colors.border, backgroundColor: colors.inputBackground }]}>
                {!logoError && job.companyLogo ? (
                  <Image
                    source={{ uri: job.companyLogo }}
                    style={styles.jobLogo}
                    resizeMode="cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <View style={[styles.jobLogoFallback, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.jobLogoText, { color: colors.primary }]}>
                      {job.company.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.jobInfo}>
                <Text style={[styles.jobCardLabel, { color: colors.textMuted }]}>
                  {alreadyApplied ? 'Already applied for' : 'Applying for'}
                </Text>
                <Text style={[styles.jobCardTitle, { color: colors.text }]} numberOfLines={2}>
                  {job.title}
                </Text>
                <Text style={[styles.jobCardMeta, { color: alreadyApplied ? colors.success : colors.primary }]}>
                  {job.company}  ·  {job.location}
                </Text>
              </View>
            </View>
          </View>

          {/* Already applied notice */}
          {alreadyApplied && (
            <View style={[styles.alreadyAppliedBanner, { backgroundColor: colors.successLight, borderColor: colors.success + '40' }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.alreadyAppliedTitle, { color: colors.success }]}>
                  Application Already Submitted
                </Text>
                <Text style={[styles.alreadyAppliedSub, { color: colors.success + 'BB' }]}>
                  You've already applied to this position. Check your application status in the Applied tab.
                </Text>
              </View>
            </View>
          )}

          {/* Progress indicator */}
          {!alreadyApplied && (
            <View style={styles.progressRow}>
              <Text style={[styles.progressText, { color: colors.textMuted }]}>Your Information</Text>
              <View style={styles.progressDots}>
                {['name', 'email', 'contactNumber', 'whyHireYou'].map((f) => (
                  <View
                    key={f}
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor:
                          touched[f] && !errors[f as keyof ValidationErrors]
                            ? colors.success
                            : touched[f] && errors[f as keyof ValidationErrors]
                            ? colors.error
                            : colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Form Fields */}
          <View style={[styles.formSection, alreadyApplied && { opacity: 0.5, pointerEvents: 'none' }]}>
            <FieldWrapper
              label="Full Name"
              required
              error={errors.name}
              touched={touched.name}
              colors={colors}
            >
              <TextInput
                style={getInputStyle('name')}
                placeholder="e.g. Juan Dela Cruz"
                placeholderTextColor={colors.textMuted}
                value={form.name}
                onChangeText={(v) => updateField('name', v)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => handleBlur('name')}
                autoCapitalize="words"
                returnKeyType="next"
                maxLength={100}
                editable={!alreadyApplied}
              />
            </FieldWrapper>

            <FieldWrapper
              label="Email Address"
              required
              error={errors.email}
              touched={touched.email}
              colors={colors}
            >
              <TextInput
                style={getInputStyle('email')}
                placeholder="e.g. juan@example.com"
                placeholderTextColor={colors.textMuted}
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                maxLength={254}
                editable={!alreadyApplied}
              />
            </FieldWrapper>

            <FieldWrapper
              label="Contact Number"
              required
              error={errors.contactNumber}
              touched={touched.contactNumber}
              colors={colors}
            >
              <TextInput
                style={getInputStyle('contactNumber')}
                placeholder="e.g. +63 912 345 6789"
                placeholderTextColor={colors.textMuted}
                value={form.contactNumber}
                onChangeText={(v) => updateField('contactNumber', v)}
                onFocus={() => setFocusedField('contactNumber')}
                onBlur={() => handleBlur('contactNumber')}
                keyboardType="phone-pad"
                returnKeyType="next"
                maxLength={20}
                editable={!alreadyApplied}
              />
            </FieldWrapper>

            <FieldWrapper
              label="Why should we hire you?"
              required
              error={errors.whyHireYou}
              touched={touched.whyHireYou}
              hint={`${form.whyHireYou.length}/1000`}
              colors={colors}
            >
              <TextInput
                style={[...getInputStyle('whyHireYou'), styles.textarea]}
                placeholder="Describe your skills, relevant experience, and what makes you stand out for this role..."
                placeholderTextColor={colors.textMuted}
                value={form.whyHireYou}
                onChangeText={(v) => updateField('whyHireYou', v)}
                onFocus={() => setFocusedField('whyHireYou')}
                onBlur={() => handleBlur('whyHireYou')}
                multiline
                numberOfLines={6}
                maxLength={1000}
                textAlignVertical="top"
                editable={!alreadyApplied}
              />
            </FieldWrapper>
          </View>

          {/* Submit / Already Applied button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {alreadyApplied ? (
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.successLight, borderWidth: 1, borderColor: colors.success + '50' }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <View style={styles.submitRow}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={[styles.submitText, { color: colors.success }]}>Already Applied — Go Back</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  { backgroundColor: submitting ? colors.primaryLight : colors.primary },
                ]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={submitting}
              >
                {submitting ? (
                  <View style={styles.submitRow}>
                    <Text style={[styles.submitText, { color: colors.primary }]}>Submitting...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitText}>Submit Application</Text>
                )}
              </TouchableOpacity>
            )}
          </Animated.View>

          {!alreadyApplied && (
            <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
              By submitting, you confirm that all information provided is accurate.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleSuccessOkay}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Success Icon */}
            <View style={[styles.modalIconCircle, { backgroundColor: colors.successLight }]}>
              <Text style={styles.modalIconText}>✓</Text>
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>Application Submitted!</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Your application for{' '}
              <Text style={{ fontWeight: '700', color: colors.text }}>{job.title}</Text>
              {' '}at{' '}
              <Text style={{ fontWeight: '700', color: colors.primary }}>{job.company}</Text>
              {' '}has been sent successfully.
            </Text>

            <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />

            <Text style={[styles.modalTip, { color: colors.textMuted }]}>
              Keep your contact details accessible — the hiring team may reach out soon.
            </Text>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              onPress={handleSuccessOkay}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSafe: {
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  jobCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  jobCardAccent: {
    width: 4,
  },
  jobCardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  jobLogoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  jobLogo: {
    width: 48,
    height: 48,
  },
  jobLogoFallback: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobLogoText: {
    fontSize: 20,
    fontWeight: '800',
  },
  jobInfo: {
    flex: 1,
  },
  jobCardLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  jobCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  jobCardMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  alreadyAppliedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  alreadyAppliedTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  alreadyAppliedSub: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  formSection: {
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '500',
    borderWidth: 1.5,
  },
  textarea: {
    height: 130,
    paddingTop: 13,
    textAlignVertical: 'top',
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalIconText: {
    fontSize: 32,
    color: '#059669',
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalDivider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  modalTip: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  modalBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export default ApplicationFormScreen;