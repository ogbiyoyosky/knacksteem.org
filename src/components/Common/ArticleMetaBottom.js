import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import IconText from '../Common/IconText';
import {Popconfirm, Spin, Row, Col, Divider} from 'antd';
import { deleteElement} from '../../actions/articles';
import {prettyDate} from '../../services/functions';
import './ArticleMetaBottom.css';
import Cookies from 'js-cookie';
import VotingSlider from '../../components/VotingSlider';



const styles = {
  barIcon: {
    fontSize: '16px',
    color: '#999'
    
  }
};

/**
 * article meta info for the bottom of every article in every view
 * @param data article data
 * @param onUpdate callback function that gets called after a successful operation (upvote, delete, ...)
 * @param dispatch redux dispatcher
 * @param isComment boolean specifying if the parent component is a comment
 * @param isArticleDetail boolean specifying if the parent component is an article detail page
 * @param isEditMode boolean to determine if the component is in edit mode right now
 * @param onEditClick callback function when the user clicks on the edit link
 * @param onReplyClick callback function when the user clicks on the reply link
 */
class ArticleMetaBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleting: false,
      isUpvoted: false,
      showVotingSlider: true
    };
  
  }

  //delete article or comment - will get called after confirmation
  onDeleteClick = async () => {
    const {data, dispatch, onUpdate} = this.props;

    try {
      this.setState({isDeleting: true});
      await dispatch(deleteElement(data.permlink));
      this.setState({isDeleting: false});
      //on successful update, reload article or article list
      onUpdate();
    } catch (err) {
      //error handled in deleteElement action
    }
  };

  componentWillMount() {

  }

  render() {
    const {isDeleting, isUpvoted} = this.state;
    const {data, isComment, isArticleDetail, onEditClick, onReplyClick, isEditMode, onHandleUpvote} = this.props;
    
    const isAuthor = (Cookies.get('username') === data.author);
    const commentCount = isComment ? data.replies.length : data.commentsCount;
    

    const actionsArray = [<a key="action-reply" onClick={onReplyClick}>Reply</a>];
    if (isComment || isArticleDetail) {
      if (isAuthor) {
        actionsArray.push(
          <a key="action-edit" onClick={onEditClick}>Edit</a>
        );
      }
      if (isAuthor && !commentCount && !data.votesCount) {
        actionsArray.push(
          <Popconfirm title="Are you sure?" onConfirm={this.onDeleteClick} key="action-delete">
            <a>Delete</a>
          </Popconfirm>
        );
      }
    }

    const upvoteIconColor = (data.isVoted || isUpvoted) ? '#999' : '#333';

    return (
      <Row  type="flex" justify="space-between" className="article-meta" style={{ background: isComment ? 'transparent' : '#fff', width: '100%',padding: '7px'}}>
         <Col style={{display: 'flex'}}>

          <Col>
            <Divider type="vertical" />
          </Col>
          <Col>
            <span
              className={`upvote ${(data.isVoted || isUpvoted) ? 'active' : 'inactive'}`}
              onClick={e=> onHandleUpvote()} >
              <i style={{...styles.barIcon, position: 'relative'}} className={`fas fa-thumbs-up ${(data.isVoted || isUpvoted) ? 'active' : 'inactive'}`}/>
              <strong>{isUpvoted ? (data.votesCount + 1) : data.votesCount}</strong>
            </span>
          </Col>
          <Col>
            <span>${data.totalPayout}</span>
          </Col>
          <Col>
            <Divider type="vertical" />
          </Col>
          <Col>
            <span>
              <i style={{...styles.barIcon, marginLeft: '10px', color: '#eee'}} className="fas fa-thumbs-down"/>
            </span>
          </Col>
          <Col>
            <Divider type="vertical" />
          </Col>
        </Col>
        {!isComment && 
        <Col>
          <Col>
            {data.category}
          </Col>
        </Col>
      }
      <Col style={{display: 'flex'}}>
        <Col>
              <Divider type="vertical" />
        </Col>
        <Col>
          <span>
            <strong> <i style={styles.barIcon} className="fas fa-comment-dots"/>{commentCount}</strong>
          </span>
        </Col>
        <Col>
            <Divider type="vertical" />
        </Col>
        <Col>
          <span className="action-links">
            {(!isEditMode && !isDeleting) && actionsArray}
            {isDeleting && <Spin size="small" />}
          </span>
        </Col>
      </Col>  
      </Row>
    );
  }
}

ArticleMetaBottom.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isComment: PropTypes.bool,
  isArticleDetail: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onEditClick: PropTypes.func,
  onReplyClick: PropTypes.func
};

ArticleMetaBottom.defaultProps = {
  isComment: false,
  isArticleDetail: false,
  isEditMode: false
};

const mapStateToProps = (state) => {
  return {
    metaBottom: state.metaBottom 
  }
}

export default connect(mapStateToProps)(ArticleMetaBottom);
