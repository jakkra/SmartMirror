import React from 'react';

import { getLatestNews } from '../lib/svt_news';
import FlipMove from 'react-flip-move';

const styles = {
  container: {
    margin: 50,
    marginLeft: 50,
    marginTop: 60
  },
  articleTitle: {
    color: 'white',
    fontSize: '2.5em',
    margin: 0,
    padding: 0,
    textAlign: 'center'
  },
  article: {
    color: 'white',
    fontSize: '1.4em',
    margin: 0,
    padding: 0,
    textAlign: 'center'
  },
}

export default class News extends React.Component {
  static propTypes = {
    visible: React.PropTypes.bool
  };

  static defaultProps = {
    visible: true
  };

  constructor(props) {
    super(props);
    this.state = {
    	articles: [],
    	subArticles: [],
    	numArticles: 1,
    };
    this.refreshNews = this.refreshNews.bind(this);
    this.handleNewNews = this.handleNewNews.bind(this);
    this.rotateList = this.rotateList.bind(this);

  }

  componentDidMount() {
    this.refreshTimer = setInterval(
      () => this.refreshNews(),
      1000 * 60 * 10 
    );
    this.refreshNews();

    this.rotateArticlesTimer = setInterval(
      () => this.rotateList(),
      1000 * 10
    );
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
    clearInterval(this.rotateArticlesTimer);
  }

  refreshNews() {
  	getLatestNews()
  	.then(this.handleNewNews)
  	.catch((err) => console.log(err));
  }

  handleNewNews(articles){
  	this.setState({
  		articles: articles,
  		subArticles: articles.slice(0, this.state.numArticles)
  	})
  }

  rotateList(){
  	const articles = this.state.articles.slice();
    articles.unshift(articles.pop())

    this.setState({
    	articles: articles,
      subArticles: articles.slice(0, this.state.numArticles)
    });
  }

  renderTopArticles() {
    return this.state.subArticles.map((article, i) => {
    	return (
    		<div key={article.link}>
    			<div style={styles.articleTitle}> {article.title} </div>
    			<div style={styles.article}> {article.description} </div>
    		</div>
    	);
    });
  }

  render() {
    return (
      <div hidden={!this.props.visible} style={styles.container}>
        <FlipMove 
        	staggerDurationBy="30"
          duration={500}
          enterAnimation='accordianVertical'
          leaveAnimation='accordianVertical'
          typeName="ul"
        >
          { this.renderTopArticles() }
        </FlipMove>
      </div>
    );
  }
}