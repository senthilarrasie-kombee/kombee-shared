import * as Yup from 'yup';
import {STRINGS} from '@shared/constants/strings';

/**
 * Standard Email Regex matching Firebase Authentication requirements.
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Common Validation Schemas
 */
export const validationUtils = {
  email: Yup.string()
    .matches(EMAIL_REGEX, STRINGS.AUTH.ERRORS.INVALID_EMAIL)
    .required(STRINGS.AUTH.ERRORS.REQUIRED)
    .transform(value => value?.trim()),
  
  password: Yup.string()
    .min(6, STRINGS.AUTH.ERRORS.PASSWORD_MIN)
    .required(STRINGS.AUTH.ERRORS.REQUIRED)
    .transform(value => value?.trim()),

  name: Yup.string()
    .required(STRINGS.AUTH.ERRORS.REQUIRED)
    .min(2, 'Name is too short'),
};
