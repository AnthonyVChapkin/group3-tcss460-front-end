'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'utils/axios';

// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

export default function ChangePasswordPage() {
  const { data: session } = useSession();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        currentPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string()
          .min(8, 'New password must be at least 8 characters')
          .required('New password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('newPassword')], 'Passwords must match')
          .required('Confirm password is required')
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSuccessMessage('');
        setErrorMessage('');

        try {
       const response = await axios.patch(
  `${process.env.WEB_API_URL}/changePassword`,
  {
    oldPassword: values.currentPassword,
    newPassword: values.newPassword
  },
  {
    headers: {
      Authorization: `Bearer ${session?.token?.accessToken}`
    }
  }
);


          console.log('Success:', response.data.message);
          setSuccessMessage(response.data.message);
          resetForm();
        } catch (error: any) {
          console.error(error.response?.data?.message || error.message);
          setErrorMessage(error.response?.data?.message || 'Error changing password');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Change Password
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={values.currentPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.currentPassword && errors.currentPassword)}
                />
              </Stack>
              {touched.currentPassword && errors.currentPassword && (
                <FormHelperText error>{errors.currentPassword}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="newPassword">New Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.newPassword && errors.newPassword)}
                />
              </Stack>
              {touched.newPassword && errors.newPassword && (
                <FormHelperText error>{errors.newPassword}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                />
              </Stack>
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error>{errors.confirmPassword}</FormHelperText>
              )}
            </Grid>

            {errorMessage && (
              <Grid item xs={12}>
                <FormHelperText error>{errorMessage}</FormHelperText>
              </Grid>
            )}

            {successMessage && (
              <Grid item xs={12}>
                <Typography color="success.main">{successMessage}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
