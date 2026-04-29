import { StyleSheet } from 'react-native';
import { LightColors, FontFamily } from '@/core/theme';

export const createStyles = (colors: typeof LightColors) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    text: {
        fontSize: 20,
        color: colors.textPrimary,
    },
});
