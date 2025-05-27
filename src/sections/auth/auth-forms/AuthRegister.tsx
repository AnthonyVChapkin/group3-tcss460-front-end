'use client';

import { useEffect, useState, SyntheticEvent } from 'react';

import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import * as Yup from 'yup';
import { Formik } from 'formik';

import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { APP_DEFAULT_PATH } from 'config';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

import { StringColorProps } from 'types/password';

export default function AuthRegister({ providers, csrfToken }: any) {
  const [level, setLevel] = useState<StringColorProps>({ label: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(prev => !prev);
  const handleMouseDownPassword = (e: SyntheticEvent) => e.preventDefault();
  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        role: '',
        phone: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        firstname: Yup.string().max(255).required('First Name is required'),
        lastname:  Yup.string().max(255).required('Last Name is required'),
        email:     Yup.string().email('Invalid email').required('Email is required'),
        username:  Yup.string()
          .min(3, 'Username must be at least 3 characters')
          .max(30, 'Username must be at most 30 characters')
          .required('Username is required'),
        password:  Yup.string()
          .min(8, 'Password must be at least 8 characters')
          .test(
            'no-leading-trailing-whitespace',
            'Password cannot start or end with spaces',
            (v) => v === v?.trim()
          )
          .required('Password is required'),
        role:      Yup.number()
          .typeError('Role must be a number between 1 and 5')
          .integer()
          .min(1, 'Role must be between 1 and 5')
          .max(5, 'Role must be between 1 and 5')
          .required('Role is required'),
        phone:     Yup.string()
          .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone must be XXX-XXX-XXXX')
          .required('Phone number is required')
      })}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        const payload = {
          firstname: values.firstname.trim(),
          lastname:  values.lastname.trim(),
          email:     values.email.trim(),
          username:  values.username.trim(),
          password:  values.password,
          role:      Number(values.role),
          phone:     values.phone
        };
        signIn('register', {
          redirect:    false,
          ...payload,
          callbackUrl: APP_DEFAULT_PATH
        }).then((res: any) => {
          if (res?.error) {
            setErrors({ submit: res.error });
          }
          setSubmitting(false);
        });
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Grid container spacing={3}>
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
                  fullWidth
                  error={Boolean(touched.firstname && errors.firstname)}
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
                  fullWidth
                  error={Boolean(touched.lastname && errors.lastname)}
                />
              </Stack>
              {touched.lastname && errors.lastname && (
                <FormHelperText error>{errors.lastname}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                <OutlinedInput
                  id="email-signup"
                  type="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Grid>

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
                  fullWidth
                  error={Boolean(touched.username && errors.username)}
                />
              </Stack>
              {touched.username && errors.username && (
                <FormHelperText error>{errors.username}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-signup">Password*</InputLabel>
                <OutlinedInput
                  id="password-signup"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  placeholder="Enter password"
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
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
              <Box sx={{ mt: 2 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Box sx={{ bgcolor: level.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level.label}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

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
                  placeholder="1–5"
                  fullWidth
                  error={Boolean(touched.role && errors.role)}
                />
              </Stack>
              {touched.role && errors.role && (
                <FormHelperText error>{errors.role}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="phone-signup">Phone* (XXX-XXX-XXXX)</InputLabel>
                <OutlinedInput
                  id="phone-signup"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="415-555-1212"
                  fullWidth
                  error={Boolean(touched.phone && errors.phone)}
                />
              </Stack>
              {touched.phone && errors.phone && (
                <FormHelperText error>{errors.phone}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: -1 }}>
              <Typography variant="body2">
                By signing up you agree to our&nbsp;
                <NextLink href="/" passHref>
                  <Link>Terms of Service</Link>
                </NextLink>
                &nbsp;and&nbsp;
                <NextLink href="/" passHref>
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