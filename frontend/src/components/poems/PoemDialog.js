import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormHelperText,
  ButtonGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const PoemDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  selectedPoem = null,
  isSubmitting = false 
}) => {
  const { t } = useTranslation(['dashboard', 'common']);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required(t('dashboard:validation.titleRequired'))
      .min(3, t('dashboard:validation.titleMin'))
      .max(100, t('dashboard:validation.titleMax')),
    content: Yup.string()
      .trim()
      .required(t('dashboard:validation.contentRequired'))
      .min(10, t('dashboard:validation.contentMin'))
      .max(5000, t('dashboard:validation.contentMax')),
    tags: Yup.string()
      .nullable()
      .transform((value) => (value?.trim() || null))
      .test('tags-format', t('dashboard:validation.tagsFormat'), function(value) {
        if (!value) return true;
        const tags = value.split(',');
        return tags.every(tag => {
          const trimmedTag = tag.trim();
          return trimmedTag === '' || /^[a-zA-Z0-9\u4e00-\u9fa5 ]+$/.test(trimmedTag);
        });
      }),
  });

  // Form handling with Formik
  const formik = useFormik({
    initialValues: {
      title: selectedPoem?.title || '',
      content: selectedPoem?.content || '',
      tags: selectedPoem?.tags?.join(', ') || '',
      status: selectedPoem?.status || 'draft', // Default to draft for new poems
    },
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const poemData = {
        ...values,
        title: values.title.trim(),
        content: values.content.trim(),
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        status: values.status // Ensure status is included in submission
      };
      console.log('Submitting poem with data:', poemData); // Debug log
      await onSubmit(poemData);
      setSubmitting(false);
    },
  });

  // Handle dialog open/close
  useEffect(() => {
    if (open) {
      formik.validateForm();
    }
  }, [open, formik.validateForm]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    console.log('Saving as draft...'); // Debug log
    await formik.setFieldValue('status', 'draft');
    formik.handleSubmit();
  };

  // Handle submit for review
  const handleSubmitForReview = async () => {
    console.log('Submitting for review...'); // Debug log
    await formik.setFieldValue('status', 'under_review');
    formik.handleSubmit();
  };

  // More strict submit button disable logic
  const isSubmitDisabled = 
    isSubmitting || 
    !formik.isValid || 
    !formik.values.title.trim() || 
    !formik.values.content.trim() ||
    formik.values.title.trim().length < 3 ||
    formik.values.content.trim().length < 10;

  // Debug log current form values
  useEffect(() => {
    console.log('Current form values:', formik.values);
  }, [formik.values]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {selectedPoem ? t('dashboard:dialog.edit.title') : t('dashboard:dialog.create.title')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label={t('dashboard:dialog.form.title.label')}
              value={formik.values.title}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 100) {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={
                (formik.touched.title && formik.errors.title) ||
                t('dashboard:dialog.form.title.counter', {
                  current: formik.values.title.length,
                  max: 100
                })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              id="content"
              name="content"
              label={t('dashboard:dialog.form.content.label')}
              multiline
              rows={6}
              value={formik.values.content}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 5000) {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={
                (formik.touched.content && formik.errors.content) ||
                t('dashboard:dialog.form.content.counter', {
                  current: formik.values.content.length,
                  max: 5000
                })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              id="tags"
              name="tags"
              label={t('dashboard:dialog.form.tags.label')}
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tags && Boolean(formik.errors.tags)}
              helperText={
                (formik.touched.tags && formik.errors.tags) ||
                t('dashboard:dialog.form.tags.helper')
              }
              margin="normal"
            />
            {formik.submitCount > 0 && !formik.isValid && (
              <FormHelperText error sx={{ mt: 2 }}>
                {t('dashboard:validation.formErrors')}
              </FormHelperText>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common:cancel')}</Button>
          <ButtonGroup variant="contained" disabled={isSubmitDisabled}>
            <Button
              type="button"
              onClick={handleSaveAsDraft}
              color="secondary"
            >
              {t('dashboard:dialog.actions.saveAsDraft')}
            </Button>
            <Button
              type="button"
              onClick={handleSubmitForReview}
              color="primary"
            >
              {t('dashboard:dialog.actions.submitForReview')}
            </Button>
          </ButtonGroup>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PoemDialog;
