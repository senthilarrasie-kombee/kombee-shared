import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '@app/routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@shared/theme';
import {AppHeader, AppText} from '@shared/components';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, {Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import {createStyles} from './LatestStatusStyles';

const {width} = Dimensions.get('window');

const CircularProgress = ({size, strokeWidth, progress, color}: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        stroke={color + '20'}
        fill="transparent"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <Circle
        stroke={color}
        fill="transparent"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

const LineChart = ({data, color, height}: any) => {
  if (!data || data.length < 2) return null;

  const chartWidth = width - 64;
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((val: number, i: number) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = height - ((val - minVal) / range) * (height - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  const path = `M ${points}`;
  const areaPath = `${path} L ${chartWidth},${height} L 0,${height} Z`;

  return (
    <Svg width={chartWidth} height={height}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.3" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={areaPath} fill="url(#grad)" />
      <Path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((val: number, i: number) => {
        const x = (i / (data.length - 1)) * chartWidth;
        const y = height - ((val - minVal) / range) * (height - 20) - 10;
        return (
          <Circle key={i} cx={x} cy={y} r="4" fill={color} />
        );
      })}
    </Svg>
  );
};

import {useLatestStatus} from '../hooks/useLatestStatus';

import {STRINGS} from '@shared/constants/strings';

const StatsScreen = () => {
  const {
    colors,
    styles,
    viewMode,
    setViewMode,
    currentDate,
    changeDate,
    canGoForward,
    stats
  } = useLatestStatus();

  const navigation = useNavigation<any>();
  const months = STRINGS.MONTHS.SHORT;

  const handleDatePress = (dateStr: string) => {
    navigation.navigate(ROUTES.DRAWER, {
      screen: ROUTES.HOME,
      params: {
        screen: ROUTES.HABITS_LISTING,
        params: {date: dateStr},
      },
    });
  };

  const renderHeaderRight = () => (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerIcon}>
        <Icon name="share-outline" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    
    return (
      <View style={styles.monthGrid}>
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isCompleted = stats.completionsByDate[dateStr] > 0;
          return (
            <TouchableOpacity 
              key={day} 
              style={[
                styles.dayBox, 
                {backgroundColor: isCompleted ? colors.primary : colors.primary + '10'}
              ]}
              onPress={() => handleDatePress(dateStr)}
            >
              <Text style={[styles.dayText, {color: isCompleted ? '#FFF' : colors.textPrimary}]}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderYearHeatmap = () => {
    return (
      <View style={styles.heatmapContainer}>
        {months.map((monthName, monthIndex) => (
          <View key={monthName} style={styles.miniMonth}>
            <Text style={styles.miniMonthTitle}>{monthName}</Text>
            <View style={styles.miniGrid}>
              {Array.from({length: 31}, (_, i) => {
                const day = i + 1;
                const year = currentDate.getFullYear();
                const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasCompletion = stats.completionsByDate[dateStr] > 0;
                
                return (
                  <TouchableOpacity 
                    key={i} 
                    style={[
                      styles.miniDay, 
                      {backgroundColor: hasCompletion ? colors.primary : colors.primary + '10'}
                    ]} 
                    onPress={() => handleDatePress(dateStr)}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader 
        title="Stats" 
        alignLeft 
        showBack 
        rightElement={renderHeaderRight()} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'month' && styles.activeToggleButton]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.toggleText, viewMode === 'month' && styles.activeToggleText]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'year' && styles.activeToggleButton]}
            onPress={() => setViewMode('year')}
          >
            <Text style={[styles.toggleText, viewMode === 'year' && styles.activeToggleText]}>Year</Text>
          </TouchableOpacity>
        </View>

        {/* Completion Rate Card */}
        <View style={styles.completionCard}>
          <View style={styles.progressContainer}>
            <CircularProgress 
              size={70} 
              strokeWidth={8} 
              progress={stats.completionRate} 
              color={colors.primary} 
            />
            <Text style={styles.progressText}>{stats.completionRate}%</Text>
          </View>
          <View style={styles.completionInfo}>
            <Text style={styles.completionTitle}>
              {viewMode === 'month' 
                ? `${months[currentDate.getMonth()]} completion rate` 
                : `${currentDate.getFullYear()} completion rate`}
            </Text>
            <Text style={styles.completionSub}>
              {stats.completedCount} of {stats.targetCount} habit days completed
            </Text>
            <Text style={[styles.completionTrend, {color: stats.trend === '+' ? '#4CAF50' : '#F44336'}]}>
              <Icon name={stats.trend === '+' ? "trending-up" : "trending-down"} size={14} color={stats.trend === '+' ? "#4CAF50" : "#F44336"} /> 
              {stats.trend}{stats.trendValue}% vs {viewMode === 'month' ? 'Prev Month' : 'Prev Year'}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completedCount}</Text>
            <Text style={styles.statLabel}>completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.perfectDays}</Text>
            <Text style={styles.statLabel}>Perfect Days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeDays}</Text>
            <Text style={styles.statLabel}>Active Days</Text>
          </View>
        </View>

        {/* Completion Trend */}
        <Text style={styles.sectionTitle}>Completion trend</Text>
        <View style={styles.chartCard}>
          <LineChart data={stats.trendData} color={colors.primary} height={120} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
            <Text style={{fontSize: 10, color: colors.textSecondary}}>Low</Text>
            <Text style={{fontSize: 10, color: colors.textSecondary}}>Med</Text>
            <Text style={{fontSize: 10, color: colors.textSecondary}}>Today</Text>
          </View>
        </View>

        {/* Calendar/Heatmap */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeDate('back')}>
            <Icon name="chevron-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>
            {viewMode === 'month' 
              ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}` 
              : `${currentDate.getFullYear()}`}
          </Text>
          {canGoForward ? (
            <TouchableOpacity onPress={() => changeDate('forward')}>
              <Icon name="chevron-forward" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 20 }} />
          )}
        </View>

        {viewMode === 'month' ? renderMonthGrid() : renderYearHeatmap()}
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;
