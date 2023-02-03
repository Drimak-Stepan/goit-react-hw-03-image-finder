import PropTypes from 'prop-types';
import ImageGalleryItem from 'components/ImageGalleryItem';
import { List } from './ImageGallery.styled';

const ImageGallery = ({ items, ...allProps }) => {
  return (
    <List>
      {items.map(item => (
        <ImageGalleryItem
          {...allProps}
          key={item.id}
          tags={item.tags}
          webformatURL={item.webformatURL}
          largeImageURL={item.largeImageURL}
        />
      ))}
    </List>
  );
};

export default ImageGallery;

ImageGallery.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired})),
};
