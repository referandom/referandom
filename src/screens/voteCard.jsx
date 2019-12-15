import React, { Component } from "react";
import { connect } from "react-redux";
import Onerge from "../components/onerge";
import Comment from "../components/comment";
import CommentTextarea from "../components/commentTextarea";
import SharePanel from "../components/sharePanel";
import VoteButtons from "../components/voteButtons";
import LoadingSpinner from "../components/loadingSpinner";
import OnergeExpired from "../components/onergeExpired";
import logger from "../services/logService";
import {
  uiStartLoading,
  uiFinishLoading,
  updateVoteCard,
  updateUser,
  updateComment,
  deleteCommentForOneVoteCard,
  addCommentForOneVoteCard,
  upvoteCommentForOneVoteCard,
  handleShowToast,
  getVoteCardById,
  getCurrentUserWithDetails
} from "../store/actions/index";

class VoteCard extends Component {
  state = {
    display: false,
    expand: true,
    vote: null,
    chartData: null,
    chartOptions: {
      responsive: false,
      legend: {
        labels: {
          fontColor: "white"
        }
      }
    }
  };
  async componentWillMount() {
    this.props.onUiStartLoading();
    const id = this.props.history.location.pathname.slice(8);
    await this.props.onGetCurrentUserWithDetails();
    await this.props.onGetVoteCardById(id);

    this.setState({
      chartData: {
        labels: ["Katılıyorum", "Katılmıyorum"],
        datasets: [
          {
            data: [this.props.data.agree, this.props.data.disagree],
            backgroundColor: ["#09c635", "#d31021"]
          }
        ]
      }
    });

    let index = -1;
    if (this.props.user)
      this.props.user.votedCards.forEach((value, i) => {
        if (value.mainCard && value.mainCard._id === this.props.data._id)
          index = i;
      });

    if (index !== -1) {
      const vote = this.props.user.votedCards[index].vote;
      this.setState({ vote });
    }
    if (this.props.user) this.setState({ expand: true });
    this.setState({ display: true });
    this.props.onUiFinishLoading();
  }

  handleVote = async vote => {
    this.setState({ vote });
    const voteCard = { ...this.props.data };
    voteCard[vote ? "agree" : "disagree"] =
      this.props.data[vote ? "agree" : "disagree"] + 1;
    const index = vote ? 0 : 1;

    const chartData = { ...this.state.chartData };
    chartData.datasets[0].data[index] = voteCard[vote ? "agree" : "disagree"];

    try {
      await this.props.onUpdateVoteCard(voteCard);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        logger.log(error);
        this.props.onShowToast("Oy kullanabilmek için giriş yapınız", "red");
        return;
      }
    }

    this.setState({ display: true, vote, chartData });

    let user = { ...this.props.user };
    user.votedCards.push({
      mainCard: voteCard._id,
      vote: vote
    });
    user.numberOfVote = user.votedCards.length;
    await this.props.onUpdateUser(user);
  };

  handleExpand = () => {
    if (this.state.expand) this.setState({ display: false, expand: false });
    else this.setState({ display: true, expand: true });
  };

  handleAddComment = async text => {
    let comment = {
      owner: this.props.user,
      date: "10 minutes ago",
      text: text,
      vote: this.state.vote,
      upvote: 0,
      mainCardId: this.props.data._id,
      upvotedUsers: []
    };
    await this.props.onAddCommentForOneVoteCard(comment);
  };

  handleUpvote = async comment => {
    if (!this.props.user) {
      this.props.onShowToast("Destekleyebilmek için giriş yapınız", "red");
      return;
    }

    this.props.onUpvoteCommentForOneVoteCard(comment);
    this.forceUpdate();
    await this.props.onUpdateComment(comment);
  };

  handleDelete = async comment => {
    try {
      await this.props.onDeleteComment(comment, this.props.data._id);
      this.props.onShowToast("Yorum başarıyla silindi", "green");
    } catch (error) {
      this.props.onShowToast("Yorum silinemedi", "red");
    }
  };

  handleComments = vote => {
    let comments = [];
    this.props.data.comments
      .slice(0)
      .reverse()
      .forEach(item => {
        if (item.vote === vote) {
          comments.push(item);
        }
      });
    return comments;
  };

  render() {
    return (
      <React.Fragment>
        <LoadingSpinner isLoaded={this.props.isLoaded} />
        {this.props.isLoaded && this.props.data && (
          <main
            className="row justify-content-center d-flex"
            style={{ marginTop: "70px" }}
          >
            <div className="col-11 col-sm-10 col-md-9 col-lg-6" id="onergeler">
              <div className="onerge">
                {!this.props.data.expired && (
                  <Onerge
                    data={this.props.data}
                    display={this.state.display}
                    chartData={this.state.chartData}
                    chartOptions={this.state.chartOptions}
                  />
                )}
                {this.props.data.expired && (
                  <OnergeExpired
                    data={this.props.data}
                    display={this.state.display}
                    chartData={this.state.chartData}
                    chartOptions={this.state.chartOptions}
                  />
                )}

                <VoteButtons
                  display={this.state.display}
                  expand={this.state.expand}
                  onClick={this.handleVote}
                />
                <div className={`d-${this.state.display ? "block" : "none"}`}>
                  {!this.props.data.expired && (
                    <CommentTextarea
                      data={this.props.data}
                      vote={this.state.vote}
                      onAddReason={this.handleAddComment}
                    />
                  )}
                  <SharePanel data={this.props.data} vote={this.state.vote} />

                  {this.props.data.comments[0] && (
                    <div className="row">
                      <div className="col-md-6 yorumlar">
                        {this.handleComments(true).map(
                          element =>
                            element.owner && (
                              <div className="mb-4" key={element._id}>
                                <Comment
                                  myComment={
                                    this.props.user &&
                                    element.owner._id === this.props.user._id
                                  }
                                  data={element}
                                  onDelete={() => this.handleDelete(element)}
                                  onUpvote={() => this.handleUpvote(element)}
                                />
                              </div>
                            )
                        )}
                      </div>
                      <div className="col-md-6 yorumlar">
                        {this.handleComments(false).map(
                          element =>
                            element.owner && (
                              <div className="mb-4" key={element._id}>
                                <Comment
                                  myComment={
                                    this.props.user &&
                                    element.owner._id === this.props.user._id
                                  }
                                  data={element}
                                  onDelete={() => this.handleDelete(element)}
                                  onUpvote={() => this.handleUpvote(element)}
                                />
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.data,
    data: state.voteCard.voteCard,
    isLoaded: state.ui.isLoaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUiStartLoading: () => dispatch(uiStartLoading()),
    onUiFinishLoading: () => dispatch(uiFinishLoading()),
    onUpdateVoteCard: voteCard => dispatch(updateVoteCard(voteCard)),
    onUpdateUser: user => dispatch(updateUser(user)),
    onAddCommentForOneVoteCard: comment =>
      dispatch(addCommentForOneVoteCard(comment)),
    onUpdateComment: comment => dispatch(updateComment(comment)),
    onDeleteComment: comment => dispatch(deleteCommentForOneVoteCard(comment)),
    onUpvoteCommentForOneVoteCard: comment =>
      dispatch(upvoteCommentForOneVoteCard(comment)),
    onShowToast: (text, variant) => dispatch(handleShowToast(text, variant)),
    onGetVoteCardById: id => dispatch(getVoteCardById(id)),
    onGetCurrentUserWithDetails: () => dispatch(getCurrentUserWithDetails())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VoteCard);
