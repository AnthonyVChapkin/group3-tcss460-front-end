'use client';

import { useEffect, useState, SyntheticEvent } from 'react';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';

import IconButton  from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { APP_DEFAULT_PATH } from 'config';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

import EyeOutlined         from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

import { StringColorProps } from 'types/password';

export default function AuthRegister({ providers, csrfToken }: any) {
  // never undefined → avoids TS “undefined not assignable” error
  const [level, setLevel] = useState<StringColorProps>({ label: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword  = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword  = (e: SyntheticEvent) => e.preventDefault();
  const changePassword = (value: string) => {
    const score = strengthIndicator(value);
    setLevel(strengthColor(score) ?? { label: '', color: '' });
  };

  // initialize bar
  useEffect(() => changePassword(''), []);

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname:  '',
        email:     '',
        username:  '',
        password:  '',
        role:      '',
        phone:     '',
        submit:    null
      }}
      validationSchema={Yup.object({
        firstname: Yup.string().max(255).required('First Name is required'),
        lastname:  Yup.string().max(255).required('Last Name is required'),
        email:     Yup.string().email('Invalid email').required('Email is required'),
        username:  Yup.string()
                      .min(3, 'Username ≥ 3 chars')
                      .max(30, 'Username ≤ 30 chars')
                      .required('Username is required'),
        password:  Yup.string()
                      .min(8, 'Password must be > 7 characters')
                      .test(
                        'trim',
                        'Password cannot start or end with spaces',
                        (v) => v === v?.trim()
                      )
                      .required('Password is required'),
        role:      Yup.number()
                      .typeError('Role must be 1–5')
                      .integer()
                      .min(1)
                      .max(5)
                      .required('Role is required')
      })}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        try {
          await signIn('register', {
            redirect: false,
            firstname: values.firstname.trim(),
            lastname:  values.lastname.trim(),
            email:     values.email.trim(),
            username:  values.username.trim(),
            password:  values.password,
            role:      Number(values.role),
            phone:     values.phone.trim(),
            callbackUrl: APP_DEFAULT_PATH
          });
        } catch (err: any) {
          setErrors({ submit: err.message ?? 'Registration failed' });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <Grid container spacing={3}>
            {/* First / Last Name */}
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                <OutlinedInput
                  id="firstname-signup"
                  name="firstname"
                  value={values.firstname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  error={Boolean(touched.firstname && errors.firstname)}
                  fullWidth
                />
              </Stack>
              {touched.firstname && errors.firstname && (
                <FormHelperText error>{errors.firstname}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                <OutlinedInput
                  id="lastname-signup"
                  name="lastname"
                  value={values.lastname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  error={Boolean(touched.lastname && errors.lastname)}
                  fullWidth
                />
              </Stack>
              {touched.lastname && errors.lastname && (
                <FormHelperText error>{errors.lastname}</FormHelperText>
              )}
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                <OutlinedInput
                  id="email-signup"
                  name="email"
                  type="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="user@mail.com"
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Grid>

            {/* Username */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="username-signup">Username*</InputLabel>
                <OutlinedInput
                  id="username-signup"
                  name="username"
                  value={values.username}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Pick a username"
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                />
              </Stack>
              {touched.username && errors.username && (
                <FormHelperText error>{errors.username}</FormHelperText>
              )}
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-signup">Password*</InputLabel>
                <OutlinedInput
                  id="password-signup"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={(e) => { handleChange(e); changePassword(e.target.value); }}
                  placeholder="Enter password"
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}

              {/* strength bar */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" fontSize={12}>
                      {level.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            {/* Role + Phone */}
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="role-signup">Role (1–5)*</InputLabel>
                <OutlinedInput
                  id="role-signup"
                  name="role"
                  type="number"
                  value={values.role}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="1"
                  error={Boolean(touched.role && errors.role)}
                  fullWidth
                />
              </Stack>
              {touched.role && errors.role && (
                <FormHelperText error>{errors.role}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="phone-signup">Phone</InputLabel>
                <OutlinedInput
                  id="phone-signup"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="555-123-4567"
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* Footer / submit */}
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Typography variant="body2">
                By signing up you agree to our&nbsp;
                <NextLink href="/" passHref legacyBehavior>
                  <Link>Terms of Service</Link>
                </NextLink>
                &nbsp;and&nbsp;
                <NextLink href="/" passHref legacyBehavior>
                  <Link>Privacy Policy</Link>
                </NextLink>.
              </Typography>
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}

            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Create Account
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
