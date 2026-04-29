import { StyleSheet } from 'react-native';
import { LightColors, FontFamily } from '@/core/theme';

export const createStyles = (colors: typeof LightColors) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontFamily: FontFamily.semiBold,
        marginBottom: 20,
        color: colors.textPrimary,
    },
    counterText: {
        fontSize: 48,
        fontFamily: FontFamily.semiBold,
        color: colors.primary,
        marginBottom: 30,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});
