import React, { Component } from "react";
import { connect } from "react-redux";
import VoteCardForAkis from "../components/voteCardForAkis";
import ProfileCard from "../components/profileCard";
import FooterCard from "../components/footerCard";
import LoadingSpinner from "../components/loadingSpinner";
import {
  getData,
  getCurrentUserWithDetails,
  uiFinishLoading,
  uiStartLoading
} from "../store/actions/index";

class Akis extends Component {
  async componentDidMount() {
    this.props.onUiStartLoading();
    await this.props.onGetCurrentUserWithDetails();
    await this.props.onGetData();
    this.props.onUiFinishLoading();
  }

  render() {
    return (
      <React.Fragment>
        <LoadingSpinner isLoaded={this.props.isLoaded} />
        {this.props.isLoaded && (
          <React.Fragment>
            <section className="desktop-hidden">
              <main className="row justify-content-center d-flex">
                <div className="col-11 col-sm-10 col-md-9 col-lg-6">
                  {this.props.data
                    .slice(0)
                    .reverse()
                    .map(element => (
                      <VoteCardForAkis
                        key={element._id}
                        data={element}
                        history={this.props.history}
                      />
                    ))}
                </div>
              </main>
            </section>
            <section className="mobile-hidden">
              <main className="ui container d-flex">
                <div className="ui stackable grid basic segment" id="akis">
                  <div className="ui rail" style={{ width: "31.3%" }}>
                    <div className="ui sticky fixed top  a-sticky">
                      <ProfileCard mode="akis" />
                      <FooterCard />
                    </div>
                  </div>
                  <div className="five wide column sidebar mobile-hidden" />
                  <div className="eleven wide column" id="onergeler">
                    {this.props.data
                      .slice(0)
                      .reverse()
                      .map(element => (
                        <VoteCardForAkis
                          key={element._id}
                          data={element}
                          history={this.props.history}
                        />
                      ))}
                  </div>
                </div>
              </main>
            </section>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.data,
    data: state.voteCard.data,
    isLoaded: state.ui.isLoaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCurrentUserWithDetails: () => dispatch(getCurrentUserWithDetails()),
    onGetData: () => dispatch(getData()),
    onUiFinishLoading: () => dispatch(uiFinishLoading()),
    onUiStartLoading: () => dispatch(uiStartLoading())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Akis);
