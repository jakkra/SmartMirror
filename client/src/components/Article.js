import React from 'react';
import Modal from 'react-modal';
import BaseComponent from './BaseComponent';
import { getArticles } from '../lib/fetch';

const styles = {
  container: {
  },
  taskTitle: {
    color: 'white',
    fontSize: '1.7em',
    textAlign: 'left'
  },
  articleText: {
    color: 'white',
    fontSize: '1.2em',
    textAlign: 'left'
  }
}

const customModalStyle = {
  overlay: {
    border: '0.5px solid #ccc',
    backgroundColor: 'transparent'

  },
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black'
  }
};


export default class Article extends BaseComponent {

  static propTypes = {
    visible: React.PropTypes.bool,
  };

  static defaultProps = {
    visible: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      currentArticle: {},
      visible: true
    };
    this.refreshArticles = this.refreshArticles.bind(this);
    this.handleNewArticle = this.handleNewArticle.bind(this);
    this.rotateList = this.rotateList.bind(this);
  }

  onEvent(event){
    if(event.action === 'next'){
      this.rotateList();
    }
  }

  componentDidMount() {
    this.refreshTimer = setInterval(
      () => this.refreshArticles(),
      1000 * 60 * 5 
    );
    this.refreshArticles();

    this.rotatetasksTimer = setInterval(
      () => this.rotateList(),
      1000 * 60 * 10
    );
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
    clearInterval(this.rotatetasksTimer);
  }

  refreshArticles() {
    getArticles()
    .then(this.handleNewArticle)
    .catch((err) => console.log(err));
  }

  handleNewArticle(articles){
    this.setState({
      articles: articles,
      currentArticle: articles[3]
    });
  }

  rotateList(){
    if(this.state.articles.length < 1){
      return;
    }
    const articles = this.state.articles.slice();
    articles.unshift(articles.pop())

    this.setState({
      articles: articles,
      currentArticle: articles[0]
    });
  }

  createMarkup(html) {
    return {__html: html};
  }
  // The article is in HTML, so we use that to display the article.
  renderArticle(article) {
    return (
      <div>
        <div style={styles.taskTitle}> {article.title} </div>
        <div style={styles.articleText} dangerouslySetInnerHTML={this.createMarkup(article.post)} />
      </div>
    );
  }

  render() {
    return (
      <Modal
        isOpen={this.props.visible}
        style={customModalStyle}
        contentLabel="Modal"
      >
        {this.renderArticle(this.state.currentArticle)}
      </Modal>
    );
  }
}