import React from 'react';
import { Grid, Container, Card, CardContent, Typography, Chip } from '@mui/material';
import mockTagsData from '../data/mocktags.json';
import './home.css';

function DocumentCards({ documents, searchTerm }) {
  const filteredDocuments = documents || mockTagsData;
  return (
    <Container sx={{ mt: 20, ml: 'auto', mr: 'auto' }}>
      <Grid container spacing={2}>
        {filteredDocuments.filter((item) => {
          const searchTextLower = searchTerm.toLowerCase();
          return item.title.toLowerCase().includes(searchTextLower) ||
            item.tags.some((tag) => tag.toLowerCase().includes(searchTextLower));
        }).map((item, index) => (
          <Grid item xs={4} key={index}>
            <Card className="cardContainer">
              {/* Title and tags section */}
              <CardContent className="cardContent">
                <div className='titleContainer'>
                  <Typography variant="h5" component="div">
                    <span className="titleLink" onClick={() => window.open(item.URL, '_blank')}>
                      {item.title}
                    </span>
                  </Typography>
                </div>
                <div className='chipContainer'>
                  {item.tags.map((tag, index) => (
                    <Chip key={index} label={tag} className='chip chipLabel'/>
                  ))}
                </div>
              </CardContent>
              <div className="faviconContainer">
                <img src={item.favicon} alt="Favicon" />
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default DocumentCards;