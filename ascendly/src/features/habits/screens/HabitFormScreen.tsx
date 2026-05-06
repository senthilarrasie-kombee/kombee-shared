import React, { useMemo, useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Switch, 
  StatusBar,
  FlatList,
  Platform,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme, FontFamily } from '@shared/theme';
import AppHeader from '@shared/components/AppHeader';
import AppText from '@shared/components/AppText';
import ConfirmModal from '@shared/components/ConfirmModal';
import { MainStack } from '@app/navigation/navigationTypes';
import { ROUTES } from '@app/routes';
import { Habit, HabitPriority, HabitFrequency, HabitDurationType, HabitTimeOfDay, HabitStatus } from '../types/habit';
import { getFrequencyDescription, getOrdinal } from '../utils/habitUtils';
import categoriesData from '../data/categories.json';
import { useDispatch } from 'react-redux';
import { addHabitAsync, updateHabitAsync, deleteHabitAsync } from '@store/reducers/rootSlice';
import { createHabitFormStyles } from './HabitFormStyles';

type HabitFormRouteProp = RouteProp<MainStack, typeof ROUTES.HABIT_FORM>;
type NavigationProp = StackNavigationProp<MainStack>;

const HabitSchema = Yup.object().shape({
  title: Yup.string().min(2, 'Too Short!').required('Title is required'),
  description: Yup.string().required('Description is required'),
  goal: Yup.string().optional(),
  priority: Yup.string().required('Priority is required'),
  timeOfDay: Yup.string().required('Time of day is required'),
  frequency: Yup.string().required('Frequency is required'),
  durationType: Yup.string().required('Goal type is required'),
  targetPerWeek: Yup.number().max(7, 'Cannot exceed 7 days per week'),
  targetPerMonth: Yup.number().max(31, 'Cannot exceed 31 days per month'),
  daysTarget: Yup.array().when('frequency', {
    is: (val: string) => val === 'weekly' || val === 'daily',
    then: (schema) => schema.min(1, 'Select at least one day'),
    otherwise: (schema) => schema.optional()
  }),
  specificDatesTarget: Yup.array().when('frequency', {
    is: 'custom',
    then: (schema) => schema.min(1, 'Select at least one specific date'),
    otherwise: (schema) => schema.optional()
  }),
  duration: Yup.string().when('durationType', {
    is: (val: string) => val && val !== 'none',
    then: (schema) => schema
      .required('Target value is required')
      .test('not-zero', 'Target must be greater than 0', val => val !== '0' && val !== '')
      .test('max-hours', 'Hours cannot exceed 24', function(val) {
        return this.parent.durationType !== 'hours' || (parseInt(val || '0') <= 24);
      }),
    otherwise: (schema) => schema.optional()
  }),
});

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const HabitFormScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HabitFormRouteProp>();
  const { habit } = route.params || {};
  const isEdit = !!habit;

  const styles = useMemo(() => createHabitFormStyles(colors, isDark), [colors, isDark]);

  // Form Initial Values
  const initialValues = {
    title: habit?.title || '',
    description: habit?.description || '',
    goal: habit?.goal || '',
    categoryId: habit?.categoryId || categoriesData[0].id,
    priority: habit?.priority || 'medium' as HabitPriority,
    isOneTime: habit?.isOneTime || false,
    daysTarget: habit?.daysTarget || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datesTarget: habit?.datesTarget || [],
    frequency: habit?.frequency || 'daily' as HabitFrequency,
    targetPerWeek: habit?.targetPerWeek || 7,
    targetPerMonth: habit?.targetPerMonth || 1,
    startDate: habit?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    endDate: habit?.endDate?.split('T')[0] || '',
    specificDatesTarget: habit?.specificDatesTarget || [],
    duration: habit?.duration || '',
    durationType: habit?.durationType || 'minutes' as HabitDurationType,
    timeOfDay: habit?.timeOfDay || 'anytime' as HabitTimeOfDay,
    isFavorite: habit?.isFavorite || false,
    status: habit?.status || 'active' as HabitStatus,
    completions: habit?.completions || [],
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Modal States
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingValues, setPendingValues] = useState<any>(null);

  const dispatch = useDispatch<any>();

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!habit?.id) return;
    setIsDeleteModalVisible(false);
    try {
      await dispatch(deleteHabitAsync(habit.id)).unwrap();
      navigation.navigate(ROUTES.HABITS_LISTING);
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const handleSubmit = (values: any) => {
    setPendingValues(values);
    setIsSaveModalVisible(true);
  };

  const confirmSave = async () => {
    if (!pendingValues) return;
    
    setIsSaveModalVisible(false);
    setIsSaving(true);

    // Generate human-readable frequency description
    const scheduleDescription = getFrequencyDescription(pendingValues);

    // Format dates for Firestore compatibility
    const formattedValues = {
      ...pendingValues,
      scheduleDescription,
      startDate: pendingValues.startDate ? `${pendingValues.startDate}T00:00:00Z` : undefined,
      endDate: pendingValues.endDate ? `${pendingValues.endDate}T00:00:00Z` : undefined,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEdit) {
        await dispatch(updateHabitAsync({ ...habit, ...formattedValues })).unwrap();
      } else {
        await dispatch(addHabitAsync(formattedValues)).unwrap();
      }
      setIsSaving(false);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save habit:', error);
      setIsSaving(false);
      // Handle error (e.g., show toast)
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader title={isEdit ? "Edit Habit" : "Create Habit"} showBack />
      
      <Formik
        initialValues={initialValues}
        validationSchema={HabitSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, validateForm }) => {
          // Debugging log to identify why the form is invalid
          if (__DEV__ && !isValid) {
            console.log('--- Form Validation Error ---');
            console.log('Errors:', errors);
            console.log('Values:', values);
          }

          return (
            <>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Category Selection */}
              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Category</AppText>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categoriesData}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.categoryList}
                  renderItem={({ item }) => {
                    const isSelected = values.categoryId === item.id;
                    return (
                      <TouchableOpacity 
                        style={[
                          styles.categoryItem,
                          isSelected && { borderColor: item.color, backgroundColor: item.color + '10' }
                        ]}
                        onPress={() => setFieldValue('categoryId', item.id)}
                      >
                        <View style={[styles.categoryIconContainer, { backgroundColor: item.color + (isSelected ? '20' : '10') }]}>
                          <Icon name={item.icon} size={24} color={item.color} />
                        </View>
                        <AppText style={[
                          styles.categoryName, 
                          { color: isSelected ? item.color : colors.textSecondary }
                        ]}>
                          {item.name}
                        </AppText>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              <View style={styles.divider} />

              {/* Title & Description */}
              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Habit Details</AppText>
                <View style={[styles.inputContainer, focusedField === 'title' && styles.inputContainerFocused]}>
                  <TextInput
                    style={[styles.input, touched.title && errors.title ? styles.inputError : null]}
                    placeholder="Habit Title (e.g. Read 20 mins)"
                    placeholderTextColor={colors.textSecondary + '80'}
                    onChangeText={handleChange('title')}
                    onBlur={(e) => {
                      handleBlur('title')(e);
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField('title')}
                    value={values.title}
                  />
                </View>
                {touched.title && errors.title && <AppText style={styles.errorText}>{errors.title}</AppText>}

                <View style={[styles.inputContainer, focusedField === 'description' && styles.inputContainerFocused, { marginTop: 12 }]}>
                  <TextInput
                    style={[styles.input, styles.textArea, touched.description && errors.description ? styles.inputError : null]}
                    placeholder="What will you do? Why is this important?"
                    placeholderTextColor={colors.textSecondary + '80'}
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange('description')}
                    onBlur={(e) => {
                      handleBlur('description')(e);
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField('description')}
                    value={values.description}
                  />
                </View>
                {touched.description && errors.description && <AppText style={styles.errorText}>{errors.description}</AppText>}
              </View>

              <View style={styles.divider} />

              {/* Priority Selection */}
              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Priority</AppText>
                <View style={styles.priorityRow}>
                  {(['low', 'medium', 'high'] as HabitPriority[]).map((p) => {
                    const isSelected = values.priority === p;
                    const pColor = p === 'high' ? '#EF4444' : p === 'medium' ? '#F59E0B' : '#10B981';
                    return (
                      <TouchableOpacity 
                        key={p}
                        style={[
                          styles.priorityItem,
                          isSelected && { borderColor: pColor, backgroundColor: pColor + '10' }
                        ]}
                        onPress={() => setFieldValue('priority', p)}
                      >
                        <AppText style={[
                          styles.priorityText,
                          { color: isSelected ? pColor : colors.textSecondary }
                        ]}>
                          {p.toUpperCase()}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.divider} />

              {/* Time of Day Selection */}
              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Time of Day</AppText>
                <View style={styles.frequencyRow}>
                  {(['morning', 'afternoon', 'evening', 'night', 'anytime'] as HabitTimeOfDay[]).map((t) => {
                    const isSelected = values.timeOfDay === t;
                    const getIcon = () => {
                      switch(t) {
                        case 'morning': return 'sunny-outline';
                        case 'afternoon': return 'partly-sunny-outline';
                        case 'evening': return 'moon-outline';
                        case 'night': return 'bed-outline';
                        case 'anytime': return 'infinite-outline';
                        default: return 'help-circle-outline';
                      }
                    };

                    return (
                      <TouchableOpacity 
                        key={t}
                        style={[
                          styles.frequencyItem,
                          { width: (width - 48) / 4 }, // 4 items per row
                          isSelected && { 
                            borderColor: colors.primary, 
                            backgroundColor: isDark ? colors.primary + '20' : colors.primary + '15',
                          }
                        ]}
                        onPress={() => setFieldValue('timeOfDay', t)}
                      >
                        <Icon 
                          name={getIcon()} 
                          size={18} 
                          color={isSelected ? colors.primary : colors.textSecondary} 
                          style={styles.frequencyIcon}
                        />
                        <AppText style={[
                          styles.frequencyText,
                          { 
                            color: isSelected ? colors.primary : colors.textSecondary,
                            fontFamily: isSelected ? FontFamily.semiBold : FontFamily.regular
                          }
                        ]}>
                          {t.toUpperCase()}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={styles.divider} />
              {values.completions.some(c => c.note) && (
                <View style={styles.section}>
                  <AppText style={styles.sectionTitle}>Recent Notes</AppText>
                  <View style={styles.gap12}>
                    {values.completions
                      .filter(c => c.note)
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((c, index) => (
                        <View 
                          key={`${c.date}-${index}`} 
                          style={styles.noteCard}
                        >
                          <AppText style={styles.noteDateText}>
                            {c.date}
                          </AppText>
                          <TextInput
                            style={styles.noteInput}
                            value={c.note}
                            onChangeText={(newNote) => {
                              const newCompletions = [...values.completions];
                              const compIndex = newCompletions.findIndex(comp => comp.date === c.date);
                              if (compIndex > -1) {
                                newCompletions[compIndex] = { ...newCompletions[compIndex], note: newNote };
                                setFieldValue('completions', newCompletions);
                              }
                            }}
                            multiline
                            placeholder="Add a note..."
                            placeholderTextColor={colors.textSecondary}
                          />
                        </View>
                      ))}
                  </View>
                </View>
              )}

              {/* One-Time vs Recurring Toggle */}
              <View style={styles.section}>
                <View style={styles.switchRow}>
                  <View>
                    <AppText style={styles.switchLabel}>One-time Task</AppText>
                    <AppText style={styles.switchSublabel}>Is this a single goal to complete?</AppText>
                  </View>
                  <Switch
                    trackColor={{ false: '#767577', true: colors.primary + '80' }}
                    thumbColor={values.isOneTime ? colors.primary : '#f4f3f4'}
                    onValueChange={(val) => { setFieldValue('isOneTime', val); }}
                    value={values.isOneTime}
                  />
                </View>
              </View>

              {/* Mark as Favorite */}
              <View style={[styles.section, { marginTop: 12 }]}>
                <View style={styles.switchRow}>
                  <View>
                    <AppText style={styles.switchLabel}>Mark as Favorite</AppText>
                    <AppText style={styles.switchSublabel}>Pin this habit to the top of your list</AppText>
                  </View>
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => setFieldValue('isFavorite', !values.isFavorite)}
                  >
                    <Icon 
                      name={values.isFavorite ? "heart" : "heart-outline"} 
                      size={28} 
                      color={values.isFavorite ? "#EF4444" : colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Frequency Selection */}
              {!values.isOneTime && (
                <View style={styles.section}>
                  <AppText style={styles.sectionTitle}>Frequency</AppText>
                  <View style={styles.frequencyRow}>
                    {(['daily', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly', 'custom'] as HabitFrequency[]).map((f) => {
                      const isSelected = values.frequency === f;
                      const getIcon = () => {
                        switch(f) {
                          case 'daily': return 'calendar-outline';
                          case 'weekly': return 'layers-outline';
                          case 'monthly': return 'calendar-number-outline';
                          case 'quarterly': return 'pie-chart-outline';
                          case 'half-yearly': return 'hourglass-outline';
                          case 'yearly': return 'star-outline';
                          default: return 'repeat-outline';
                        }
                      };

                      return (
                        <TouchableOpacity 
                          key={f}
                          style={[
                            styles.frequencyItem,
                            isSelected && { 
                              borderColor: colors.primary, 
                              backgroundColor: isDark ? colors.primary + '20' : colors.primary + '15',
                            }
                          ]}
                          onPress={() => {
                            setFieldValue('frequency', f);
                            
                            const now = new Date();
                            const currentDayName = now.toLocaleDateString('en-US', { weekday: 'long' });
                            const currentDayOfMonth = now.getDate();

                            if (f === 'daily') {
                              setFieldValue('daysTarget', DAYS);
                              setFieldValue('targetPerWeek', 7);
                              setFieldValue('datesTarget', []);
                              setFieldValue('targetPerMonth', 0);
                            } else if (f === 'weekly') {
                              setFieldValue('daysTarget', [currentDayName]);
                              setFieldValue('targetPerWeek', 1);
                              setFieldValue('datesTarget', []);
                              setFieldValue('targetPerMonth', 0);
                            } else if (f === 'monthly') {
                              setFieldValue('datesTarget', [currentDayOfMonth]);
                              setFieldValue('targetPerMonth', 1);
                              setFieldValue('daysTarget', []);
                              setFieldValue('targetPerWeek', 0);
                            } else if (f === 'custom') {
                              const todayStr = now.toISOString().split('T')[0];
                              setFieldValue('specificDatesTarget', [todayStr]);
                              setFieldValue('daysTarget', []);
                              setFieldValue('targetPerWeek', 0);
                              setFieldValue('datesTarget', []);
                              setFieldValue('targetPerMonth', 0);
                            } else {
                              setFieldValue('daysTarget', []);
                              setFieldValue('targetPerWeek', 0);
                              setFieldValue('datesTarget', []);
                              setFieldValue('targetPerMonth', 0);
                              setFieldValue('specificDatesTarget', []);
                            }
                          }}
                        >
                          <Icon 
                            name={getIcon()} 
                            size={18} 
                            color={isSelected ? colors.primary : colors.textSecondary} 
                            style={styles.frequencyIcon}
                          />
                          <AppText style={[
                            styles.frequencyText,
                            { 
                              color: isSelected ? colors.primary : colors.textSecondary,
                              fontFamily: isSelected ? FontFamily.semiBold : FontFamily.regular
                            }
                          ]}>
                            {f.toUpperCase().replace('-', ' ')}
                          </AppText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Weekly Frequency Details */}
              {!values.isOneTime && (values.frequency === 'weekly' || values.frequency === 'daily') && (
                <>
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <AppText style={[styles.sectionTitle, { marginBottom: 0 }]}>
                        Repeat on {values.daysTarget.length > 0 && `(${values.daysTarget.length})`}
                      </AppText>
                      {values.daysTarget.length > 0 && (
                        <TouchableOpacity onPress={() => {
                          setFieldValue('daysTarget', []);
                          setFieldValue('targetPerWeek', 0);
                        }}>
                          <AppText style={styles.deselectText}>Remove all</AppText>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.daysRow}>
                      {DAYS.map((day) => {
                        const isSelected = values.daysTarget.includes(day);
                        return (
                          <TouchableOpacity
                            key={day}
                            style={[
                              styles.dayButton,
                              { 
                                backgroundColor: isSelected ? colors.primary : 'transparent',
                                borderColor: isSelected ? colors.primary : colors.textSecondary + '30'
                              }
                            ]}
                            onPress={() => {
                              const newDays = isSelected 
                                ? values.daysTarget.filter(d => d !== day)
                                : [...values.daysTarget, day];
                              setFieldValue('daysTarget', newDays);
                              setFieldValue('targetPerWeek', newDays.length);
                              
                              if (newDays.length < 7 && values.frequency === 'daily') {
                                setFieldValue('frequency', 'weekly');
                              } else if (newDays.length === 7 && values.frequency === 'weekly') {
                                setFieldValue('frequency', 'daily');
                              }
                            }}
                          >
                            <AppText style={[
                              styles.dayButtonText,
                              { color: isSelected ? '#FFFFFF' : colors.textSecondary }
                            ]}>
                              {day}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>Flexible Target (Optional)</AppText>
                    <AppText style={[styles.switchSublabel, { marginBottom: 8 }]}>How many times per week?</AppText>
                    <View style={[styles.inputContainer, focusedField === 'targetPerWeek' && styles.inputContainerFocused, values.daysTarget.length > 0 && { opacity: 0.6 }]}>
                      <TextInput
                        style={[styles.input, { fontFamily: FontFamily.semiBold, fontSize: 18 }]}
                        placeholder="e.g. 3"
                        placeholderTextColor={colors.textSecondary + '80'}
                        keyboardType="numeric"
                        onChangeText={(val) => {
                          const num = parseInt(val) || 0;
                          setFieldValue('targetPerWeek', Math.min(num, 7));
                        }}
                        onBlur={() => setFocusedField(null)}
                        onFocus={() => setFocusedField('targetPerWeek')}
                        value={values.targetPerWeek.toString()}
                        editable={values.daysTarget.length === 0}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Monthly Frequency Details */}
              {!values.isOneTime && values.frequency === 'monthly' && (
                <>
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <AppText style={[styles.sectionTitle, { marginBottom: 0 }]}>
                        Target Dates {values.datesTarget.length > 0 && `(${values.datesTarget.length})`}
                      </AppText>
                      {values.datesTarget.length > 0 && (
                        <TouchableOpacity onPress={() => {
                          setFieldValue('datesTarget', []);
                          setFieldValue('targetPerMonth', 0);
                        }}>
                          <AppText style={styles.deselectText}>Remove all</AppText>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.datesGrid}>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
                        const isSelected = values.datesTarget.includes(date);
                        return (
                          <TouchableOpacity
                            key={date}
                            style={[
                              styles.dateGridButton,
                              { 
                                backgroundColor: isSelected ? colors.primary : 'transparent',
                                borderColor: isSelected ? colors.primary : colors.textSecondary + '30'
                              }
                            ]}
                            onPress={() => {
                              const newDates = isSelected 
                                ? values.datesTarget.filter(d => d !== date)
                                : [...values.datesTarget, date];
                              setFieldValue('datesTarget', newDates);
                              setFieldValue('targetPerMonth', newDates.length);
                            }}
                          >
                            <AppText style={[
                              styles.dateGridButtonText,
                              { color: isSelected ? '#FFFFFF' : colors.textSecondary }
                            ]}>
                              {date}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>Flexible Target (Optional)</AppText>
                    <AppText style={[styles.switchSublabel, { marginBottom: 8 }]}>How many times per month?</AppText>
                    <View style={[styles.inputContainer, focusedField === 'targetPerMonth' && styles.inputContainerFocused, values.datesTarget.length > 0 && { opacity: 0.6 }]}>
                      <TextInput
                        style={[styles.input, { fontFamily: FontFamily.semiBold, fontSize: 18 }]}
                        placeholder="e.g. 10"
                        placeholderTextColor={colors.textSecondary + '80'}
                        keyboardType="numeric"
                        onChangeText={(val) => {
                          const num = parseInt(val) || 0;
                          setFieldValue('targetPerMonth', Math.min(num, 31));
                        }}
                        onBlur={() => setFocusedField(null)}
                        onFocus={() => setFocusedField('targetPerMonth')}
                        value={values.targetPerMonth.toString()}
                        editable={values.datesTarget.length === 0}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Long-term Frequency Details (Specific Date Display) */}
              {!values.isOneTime && ['quarterly', 'half-yearly', 'yearly'].includes(values.frequency) && (
                <View style={styles.section}>
                  <AppText style={styles.sectionTitle}>Target Date</AppText>
                  <View style={styles.startDateBadge}>
                    <View style={styles.startDateTagContainer}>
                      <AppText style={styles.startDateText}>
                        {values.startDate}
                      </AppText>
                    </View>
                  </View>
                  <AppText style={[styles.switchSublabel, { marginLeft: 0, marginTop: 12 }]}>
                    This habit will repeat on the {getOrdinal(values.startDate ? new Date(values.startDate).getDate() : 0)} 
                    {values.frequency === 'yearly' ? ` of ${values.startDate ? new Date(values.startDate).toLocaleString('default', { month: 'long' }) : ''} every year` : 
                     ` of every ${values.frequency === 'half-yearly' ? '6 months' : '3 months'}`}.
                  </AppText>
                </View>
              )}
              
              {/* Custom Specific Dates Frequency Details */}
              {!values.isOneTime && values.frequency === 'custom' && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <AppText style={[styles.sectionTitle, { marginBottom: 0 }]}>
                      Specific Dates {values.specificDatesTarget.length > 0 && `(${values.specificDatesTarget.length})`}
                    </AppText>
                    {values.specificDatesTarget.length > 0 && (
                      <TouchableOpacity onPress={() => setFieldValue('specificDatesTarget', [])}>
                        <AppText style={styles.deselectText}>Remove all</AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {values.specificDatesTarget.length > 0 ? (
                    <View style={styles.specificDatesContainer}>
                      {[...values.specificDatesTarget].sort().map((date) => (
                        <TouchableOpacity 
                          key={date}
                          style={[styles.specificDateTag, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '40' }]}
                          onPress={() => {
                            const newDates = values.specificDatesTarget.filter(d => d !== date);
                            setFieldValue('specificDatesTarget', newDates);
                          }}
                        >
                          <AppText style={[styles.specificDateTagText, { color: colors.primary }]}>{date}</AppText>
                          <Icon name="close-circle" size={16} color={colors.primary} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <AppText style={[styles.switchSublabel, { marginLeft: 0 }]}>No dates selected. Add dates where you want to perform this habit.</AppText>
                  )}

                  <TouchableOpacity 
                    style={[styles.addDateButton, { borderColor: colors.primary + '50' }]}
                    onPress={() => setShowTargetDatePicker(true)}
                  >
                    <Icon name="add-circle-outline" size={20} color={colors.primary} />
                    <AppText style={[styles.addDateButtonText, { color: colors.primary }]}>Add Specific Date</AppText>
                  </TouchableOpacity>
                </View>
              )}

              {!values.isOneTime && <View style={styles.divider} />}

              {/* Goal & Duration */}
              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Goal & Duration Type</AppText>
                <AppText style={[styles.switchSublabel, { marginLeft: 0, marginTop: 10, marginBottom: 6 }]}>Goal Description</AppText>
                <View style={[styles.inputContainer, focusedField === 'goal' && styles.inputContainerFocused]}>
                  <TextInput
                    style={[
                      styles.input, 
                      touched.goal && errors.goal ? styles.inputError : null,
                      focusedField === 'goal' && { fontFamily: FontFamily.semiBold }
                    ]}
                    placeholder="Long term goal (e.g. Healthier heart)"
                    placeholderTextColor={colors.textSecondary + '80'}
                    onChangeText={handleChange('goal')}
                    onBlur={(e) => {
                      handleBlur('goal')(e);
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField('goal')}
                    value={values.goal}
                  />
                </View>
                {touched.goal && errors.goal && <AppText style={styles.errorText}>{errors.goal}</AppText>}

                <AppText style={[styles.switchSublabel, { marginLeft: 0, marginTop: 16, marginBottom: 6 }]}>Duration Type</AppText>

                <View style={[styles.frequencyRow, { marginTop: 0 }]}>
                  {(['hours', 'minutes', 'count', 'none'] as HabitDurationType[]).map((t) => {
                    const isSelected = values.durationType === t;
                    const getIcon = () => {
                      switch(t) {
                        case 'hours': return 'time-outline';
                        case 'minutes': return 'timer-outline';
                        case 'count': return 'calculator-outline';
                        case 'none': return 'close-circle-outline';
                        default: return 'help-circle-outline';
                      }
                    };

                    return (
                      <TouchableOpacity 
                        key={t}
                        style={[
                          styles.horizontalFrequencyItem,
                          isSelected && { 
                            borderColor: colors.primary, 
                            backgroundColor: isDark ? colors.primary + '20' : colors.primary + '15',
                          }
                        ]}
                        onPress={async () => {
                          const prevType = values.durationType;
                          await setFieldValue('durationType', t);
                          
                          if (t === 'none') {
                            await setFieldValue('duration', '0');
                          } else if (prevType === 'none') {
                            // Clear the auto-zero when moving back to a tracked type
                            await setFieldValue('duration', '');
                          }
                          
                          // Manually trigger validation to update UI immediately
                          validateForm();
                        }}
                      >
                        <Icon 
                          name={getIcon()} 
                          size={18} 
                          color={isSelected ? colors.primary : colors.textSecondary} 
                        />
                        <AppText style={[
                          styles.frequencyText,
                          { 
                            color: isSelected ? colors.primary : colors.textSecondary,
                            fontFamily: isSelected ? FontFamily.semiBold : FontFamily.regular,
                            marginTop: 0,
                            marginLeft: 8
                          }
                        ]}>
                          {t.toUpperCase()}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {values.durationType !== 'none' && (
                  <>
                    <AppText style={[styles.switchSublabel, { marginLeft: 0, marginTop: 16, marginBottom: 6 }]}>
                      {values.durationType === 'hours' ? 'Target Hours' : 
                       values.durationType === 'minutes' ? 'Target Minutes' : 'Target Count'}
                    </AppText>
                    <View style={[
                      styles.inputContainer, 
                      focusedField === 'duration' && styles.inputContainerFocused, 
                      touched.duration && errors.duration ? styles.inputError : null,
                      { marginTop: 4 }
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder={
                          values.durationType === 'hours' ? "Number of hours" :
                          values.durationType === 'minutes' ? "Number of minutes" : "Target count"
                        }
                        placeholderTextColor={colors.textSecondary + '80'}
                        keyboardType="numeric"
                        onChangeText={(val) => {
                          const cleanVal = val.replace(/[^0-9]/g, '');
                          const numVal = parseInt(cleanVal) || 0;
                          
                          if (values.durationType === 'minutes' && numVal > 60) {
                            // Auto-convert to hours if minutes exceed 60
                            setFieldValue('durationType', 'hours');
                            setFieldValue('duration', Math.min(Math.floor(numVal / 60), 24).toString());
                          } else if (values.durationType === 'hours' && numVal > 24) {
                            // Cap hours at 24
                            setFieldValue('duration', '24');
                          } else {
                            setFieldValue('duration', cleanVal);
                          }
                        }}
                        onBlur={(e) => {
                          handleBlur('duration')(e);
                          setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('duration')}
                        value={values.duration}
                      />
                    </View>
                    {touched.duration && errors.duration && <AppText style={styles.errorText}>{errors.duration}</AppText>}
                    {values.durationType === 'hours' && !errors.duration && (
                      <AppText style={styles.hintText}>
                        Tip: For more flexible scheduling, consider using the 'Custom' frequency in the section above.
                      </AppText>
                    )}
                  </>
                )}
              </View>

              {values.frequency !== 'custom' && (
                <>
                  <View style={styles.divider} />
                  {/* Timeline (Dates) */}
                  <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>Timeline</AppText>
                    <View style={styles.dateRow}>
                      <View style={[styles.dateInput, values.isOneTime && { flex: 1 }]}>
                        <AppText style={[styles.switchSublabel, { marginLeft: 0 }]}>
                          {values.isOneTime ? 'Task Date' : 'Start Date'}
                        </AppText>
                        <TouchableOpacity 
                          style={styles.dateButton}
                          onPress={() => setShowStartDate(true)}
                        >
                          <Icon name="calendar-outline" size={18} color={colors.primary} />
                          <AppText style={styles.dateButtonText}>{values.startDate}</AppText>
                        </TouchableOpacity>
                      </View>

                      {!values.isOneTime && (
                        <View style={styles.dateInput}>
                          <AppText style={[styles.switchSublabel, { marginLeft: 0 }]}>End Date</AppText>
                          <TouchableOpacity 
                            style={styles.dateButton}
                            onPress={() => setShowEndDate(true)}
                          >
                            <Icon name="flag-outline" size={18} color={colors.primary} />
                            <AppText style={styles.dateButtonText}>{values.endDate || 'Not set'}</AppText>
                          </TouchableOpacity>
                          {values.endDate !== '' && (
                            <TouchableOpacity 
                              style={styles.clearEndDateButton}
                              onPress={() => setFieldValue('endDate', '')}
                            >
                              <AppText style={styles.clearEndDateText}>Clear End Date</AppText>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </>
              )}

              {/* Date Picker Modals */}
              {showStartDate && (
                <DateTimePicker
                  value={new Date(values.startDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowStartDate(false);
                    if (date) setFieldValue('startDate', date.toISOString().split('T')[0]);
                  }}
                />
              )}

              {showEndDate && (
                <DateTimePicker
                  value={values.endDate ? new Date(values.endDate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowEndDate(false);
                    if (date) setFieldValue('endDate', date.toISOString().split('T')[0]);
                  }}
                />
              )}

              {showTargetDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowTargetDatePicker(false);
                    if (date) {
                      const dateString = date.toISOString().split('T')[0];
                      if (!values.specificDatesTarget.includes(dateString)) {
                        setFieldValue('specificDatesTarget', [...values.specificDatesTarget, dateString]);
                      }
                    }
                  }}
                />
              )}
              {/* Habit Status (Edit only) */}
              {isEdit && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>Habit Status</AppText>
                    <View style={styles.priorityRow}>
                      {(['active', 'paused', 'completed'] as HabitStatus[]).map((s) => {
                        const isSelected = values.status === s;
                        const sColor = s === 'active' ? '#10B981' : s === 'paused' ? '#F59E0B' : '#3B82F6';
                        return (
                          <TouchableOpacity 
                            key={s}
                            style={[
                              styles.priorityItem,
                              { flex: 0.3 },
                              isSelected && { borderColor: sColor, backgroundColor: sColor + '10' }
                            ]}
                            onPress={() => setFieldValue('status', s)}
                          >
                            <AppText style={[
                              styles.priorityText, 
                              { color: isSelected ? sColor : colors.textSecondary }
                            ]}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}

              {/* Submit Button */}
              <View style={[styles.footer, { borderTopWidth: 0, marginTop: 24, paddingHorizontal: 0 }]}>
                {__DEV__ && !isValid && (
                  <View style={styles.debugContainer}>
                    <AppText style={styles.debugErrorText}>
                      Required: {Object.keys(errors).join(', ')}
                    </AppText>
                  </View>
                )}

                <TouchableOpacity 
                  style={[
                    styles.submitButton, 
                    { backgroundColor: (isValid && !isSaving) ? colors.primary : colors.textSecondary + '30' }
                  ]}
                  onPress={() => {
                    if (!isValid) {
                      console.log('--- Cannot Submit ---');
                      console.log('Errors:', errors);
                      return;
                    }
                    handleSubmit();
                  }}
                  disabled={!isValid || isSaving}
                >
                  <AppText style={styles.submitButtonText}>
                    {isSaving ? "Checking..." : isEdit ? "Update Habit" : "Create Habit"}
                  </AppText>
                </TouchableOpacity>

                {isEdit && (
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={handleDelete}
                  >
                    <Icon name="trash-outline" size={20} color="#EF4444" style={styles.deleteIcon} />
                    <AppText style={styles.deleteButtonText}>Delete Habit</AppText>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </>
        );
      }}
      </Formik>
      <ConfirmModal
        isVisible={isDeleteModalVisible}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This action cannot be undone and you will lose all progress."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
      <ConfirmModal
        isVisible={isSaveModalVisible}
        title={isEdit ? "Update Habit" : "Create Habit"}
        message={isEdit ? "Do you want to save the changes to this habit?" : "Ready to start your new habit journey?"}
        confirmText={isEdit ? "Update" : "Create"}
        onConfirm={confirmSave}
        onCancel={() => setIsSaveModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HabitFormScreen;
