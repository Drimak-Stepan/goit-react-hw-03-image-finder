import React from 'react';

import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Loader from './Loader';
import Button from './Button';
import Modal from './Modal';
import API from '../services/api';

import { AppCss, Block } from './App.styled';
import { scrollToTop, scrollHandler } from '../services/scroll';

class App extends React.Component {
  static defaultProps = {
    items: [],
  };
  state = {
    query: '',
    page: 1,
    items: [],
    largeImageUrl: '',
    status: 'idle',
    error: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.query;
    const nextQuery = this.state.query;
    const prevPage = prevState.page;
    const nextPage = this.state.page;
    if (prevPage !== nextPage || prevQuery !== nextQuery) {
      
      this.setState({ status: 'pending' });
      API.fetchImage(nextQuery, nextPage)
        .then(items => {
          const { hits } = items;
          this.setState(() => ({
            items: [...prevState.items, ...hits],status: 'resolved',
          }));
          scrollHandler();
        })
        .catch(error => this.setState({ error, status: 'rejected' }));
    }
  }
  handleFormSubmit = query => {
    this.setState({ query, page: 1, items: [] });scrollToTop();
  };

  loadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  onSelectImg = link => {
    this.setState({ largeImageUrl: link });
  };
  onCloseModal = () => {
    this.setState({ largeImageUrl: '' });
  };
  render() {
    const { error, status, items, largeImageUrl } = this.state;

    return (
      <AppCss>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {status === 'idle' && (
          <Block>
            <h2>Please, enter query</h2>
          </Block>
        )}
        {status === 'rejected' && (
          <Block>
            <h2>{error.message}</h2>
          </Block>
        )}
        {items.length > 0 && (
          <ImageGallery items={items} onSelect={this.onSelectImg} />
        )}
        {items.length > 11 && <Button onClick={this.loadMore}>Lore more</Button>}
        {status === 'pending' && (
          <Block>
            <Loader />
          </Block>
        )}
        {largeImageUrl.length > 0 && (
          <Modal url={largeImageUrl} onClose={this.onCloseModal} />
        )}
      </AppCss>
    );
  }
}

export default App;
