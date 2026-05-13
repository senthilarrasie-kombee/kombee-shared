import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
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

const StatsScreen = () => {
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const trendData = [40, 65, 75, 85, 80, 97];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const renderHeaderRight = () => (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerIcon}>
        <Icon name="share-outline" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerIcon}>
        <Icon name="close" size={28} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderMonthGrid = () => {
    const days = Array.from({length: 30}, (_, i) => i + 1);
    return (
      <View style={styles.monthGrid}>
        {days.map(day => {
          const isCompleted = Math.random() > 0.3;
          return (
            <View 
              key={day} 
              style={[
                styles.dayBox, 
                {backgroundColor: isCompleted ? colors.primary : colors.primary + '10'}
              ]}
            >
              <Text style={[styles.dayText, {color: isCompleted ? '#FFF' : colors.textPrimary}]}>{day}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderYearHeatmap = () => {
    return (
      <View style={styles.heatmapContainer}>
        {months.map(month => (
          <View key={month} style={styles.miniMonth}>
            <Text style={styles.miniMonthTitle}>{month}</Text>
            <View style={styles.miniGrid}>
              {Array.from({length: 28}, (_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.miniDay, 
                    {backgroundColor: Math.random() > 0.4 ? colors.primary : colors.primary + '10'}
                  ]} 
                />
              ))}
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
              progress={viewMode === 'month' ? 97 : 68} 
              color={colors.primary} 
            />
            <Text style={styles.progressText}>{viewMode === 'month' ? '97%' : '68%'}</Text>
          </View>
          <View style={styles.completionInfo}>
            <Text style={styles.completionTitle}>
              {viewMode === 'month' ? 'April completion rate' : '2026 completion rate'}
            </Text>
            <Text style={styles.completionSub}>
              {viewMode === 'month' ? '61 of 63 habit days completed' : '299 of 440 habit days completed'}
            </Text>
            <Text style={styles.completionTrend}>
              <Icon name="trending-up" size={14} color="#4CAF50" /> +6% vs March
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{viewMode === 'month' ? '61' : '299'}</Text>
            <Text style={styles.statLabel}>completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{viewMode === 'month' ? '19' : '27'}</Text>
            <Text style={styles.statLabel}>Perfect Days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{viewMode === 'month' ? '20' : '107'}</Text>
            <Text style={styles.statLabel}>Active Days</Text>
          </View>
        </View>

        {/* Completion Trend */}
        <Text style={styles.sectionTitle}>Completion trend</Text>
        <View style={styles.chartCard}>
          <LineChart data={trendData} color={colors.primary} height={120} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
            <Text style={{fontSize: 10, color: colors.textSecondary}}>Jan</Text>
            <Text style={{fontSize: 10, color: colors.textSecondary}}>Mar</Text>
            <Text style={{fontSize: 10, color: colors.textSecondary}}>Apr</Text>
          </View>
        </View>

        {/* Calendar/Heatmap */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity>
            <Icon name="chevron-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>
            {viewMode === 'month' ? 'April 2026' : '2026'}
          </Text>
          <TouchableOpacity>
            <Icon name="chevron-forward" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {viewMode === 'month' ? renderMonthGrid() : renderYearHeatmap()}
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;
