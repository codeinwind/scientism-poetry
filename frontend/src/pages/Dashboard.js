// Previous imports remain the same...

const Dashboard = () => {
  // Previous state declarations remain the same...

  // Form validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .required(t('dashboard:validation.titleRequired'))
      .min(3, t('dashboard:validation.titleMin'))
      .max(100, t('dashboard:validation.titleMax')),
    content: Yup.string()
      .required(t('dashboard:validation.contentRequired'))
      .min(10, t('dashboard:validation.contentMin'))
      .max(5000, t('dashboard:validation.contentMax')),
    tags: Yup.string()
      .nullable()
      .matches(/^[a-zA-Z0-9, ]*$/, t('dashboard:validation.tagsFormat')),
  });

  // Form handling with Formik
  const formik = useFormik({
    initialValues: {
      title: selectedPoem?.title || '',
      content: selectedPoem?.content || '',
      tags: selectedPoem?.tags?.join(', ') || '',
      status: selectedPoem?.status || 'under_review',
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const poemData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };

      if (selectedPoem) {
        editPoemMutation.mutate({ id: selectedPoem._id, ...poemData });
      } else {
        createPoemMutation.mutate(poemData);
      }
    },
  });

  // Rest of the component remains the same until the dialog...

  {/* Create/Edit Dialog */}
  <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
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
            onChange={formik.handleChange}
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>{t('common:cancel')}</Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={formik.isSubmitting || (formik.touched.title && !formik.isValid)}
        >
          {selectedPoem ? t('dashboard:dialog.edit.button') : t('dashboard:dialog.create.button')}
        </Button>
      </DialogActions>
    </form>
  </Dialog>

  // Rest of the component remains the same...
};

export default Dashboard;
