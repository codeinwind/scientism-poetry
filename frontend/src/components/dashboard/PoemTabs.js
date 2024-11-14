import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Status mapping for tabs - ensure exact match with backend enum values
const TAB_STATUS = {
  0: null,          // All poems
  1: 'published',   // Published poems
  2: 'under_review', // Under review poems
  3: 'draft'        // Draft poems
};

const PoemTabs = ({ currentTab, onTabChange, tabCounts }) => {
  const { t } = useTranslation(['dashboard']);

  // Debug logs
  console.log('Current tab:', currentTab);
  console.log('Current status:', TAB_STATUS[currentTab]);
  console.log('Tab counts:', tabCounts);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
      <Tabs 
        value={currentTab} 
        onChange={onTabChange}
        aria-label="poem status tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab 
          label={`${t('dashboard:tabs.all')} (${tabCounts.all})`}
          data-testid="tab-all"
          value={0}
          id="poem-tab-0"
          aria-controls="poem-tabpanel-0"
        />
        <Tab 
          label={`${t('dashboard:tabs.published')} (${tabCounts.published})`}
          data-testid="tab-published"
          value={1}
          id="poem-tab-1"
          aria-controls="poem-tabpanel-1"
        />
        <Tab 
          label={`${t('dashboard:tabs.underReview')} (${tabCounts.underReview})`}
          data-testid="tab-under-review"
          value={2}
          id="poem-tab-2"
          aria-controls="poem-tabpanel-2"
        />
        <Tab 
          label={`${t('dashboard:tabs.drafts')} (${tabCounts.drafts})`}
          data-testid="tab-drafts"
          value={3}
          id="poem-tab-3"
          aria-controls="poem-tabpanel-3"
        />
      </Tabs>
    </Box>
  );
};

export default PoemTabs;
