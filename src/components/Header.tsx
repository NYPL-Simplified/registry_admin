import React from 'react';
import { Heading, Hero } from '@nypl/design-system-react-components';

const Header = () => {
  return (
    <Hero
      backgroundColor='brand.primary'
      heading={
        <Heading
          id='search-and-filter-heading'
          level='one'
          text='Library Registry Interface'
        />
      }
      heroType='tertiary'
    />
  );
};

export default Header;
