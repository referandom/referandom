import React from "react";
import { connect } from "react-redux";
import { Dropdown, Menu } from "semantic-ui-react";
import sizeMe from "react-sizeme";
import Joi from "joi-browser";
import ExitWarningModal from "./exitWarningModal";
import FormClass from "./common/form";
import {
  login,
  uiStartLoginButton,
  uiStopLoginButton,
  getCurrentUserWithDetails
} from "../store/actions/index";
import { url } from "../config.json";

class NavBar extends FormClass {
  state = {
    data: { username: "", password: "" },
    errors: {},
    trigger: null,
    loaded: false,
    exitWarningModalShow: false
  };
  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  async componentDidMount() {
    await this.props.onGetCurrentUserWithDetails();
  }

  exitWarningModalClose = () => {
    this.setState({ exitWarningModalShow: false });
  };

  doSubmit = async () => {
    try {
      this.props.onStartLoginButton();
      const { data } = this.state;
      await this.props.onLogin(data.username, data.password);
      window.location = "/akis";
      this.props.onStopLoginButton();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        this.props.onStopLoginButton();
      }
    }
  };

  enterPressed = event => {
    const code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.isRegister) this.handleSubmit(event, this.register);
      else this.handleSubmit(event, this.login);
    }
  };

  loadUser = () => {
    if (this.props.userWithDetails && !this.state.loaded) {
      this.state.trigger = (
        <span>
          <img
            src={this.props.userWithDetails.ppLink}
            className="ui avatar image"
            width="20"
            alt=""
          />
        </span>
      );
      this.state.loaded = true;
      this.forceUpdate();
    }
  };

  render() {
    this.loadUser();

    return (
      <React.Fragment>
        <div className="ui" id="page">
          <Menu className="a-body-bg" id="top">
            <div className="ui top fixed inverted borderless menu">
              <div className="ui container d-flex justify-content-center">
                <a className="item logo" href="/">
                  <img className="img" src={url + "img/logo.png"} alt="" />
                </a>
                {this.renderNavItems()}
              </div>
            </div>
          </Menu>
        </div>
        <ExitWarningModal
          show={this.state.exitWarningModalShow}
          onHide={this.exitWarningModalClose}
          device="desktop"
        />
      </React.Fragment>
    );
  }

  renderNavItems = () => {
    const { user } = this.props;
    if (user) {
      return (
        <div className="right menu">
          <Dropdown
            trigger={this.state.trigger}
            pointing
            className="link item mobile-hidden"
          >
            <Dropdown.Menu>
              <Dropdown.Header className="text-lowercase">
                @{user.username}
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item href="/profile">
                <i className="fa fa-user pr-3" />
                Profil
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={() => this.setState({ exitWarningModalShow: true })}
              >
                <i className="fa fa-times-circle pr-3" />
                Çıkış yap
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div
            onClick={this.props.onClick}
            className="desktop-hidden a-mobile-sidebar-link"
          >
            {this.state.trigger}
          </div>
        </div>
      );
    } else {
      return (
        <div className="right menu not-login pb-3 p-2">
          <div className="ui form">
            <div className="fields item login">
              <div className="seven wide field email d-flex flex-column">
                {this.renderInput(
                  "username",
                  "Kullanıcı Adı",
                  "text",
                  `a-more-radius  ${
                    this.state.errors["username"] ? "a-red-border" : ""
                  }`
                )}
              </div>
              <div className="six wide field password d-flex flex-column">
                {this.renderInput(
                  "password",
                  "Şifre",
                  "password",
                  `a-more-radius  ${
                    this.state.errors["password"] ? "a-red-border" : ""
                  }`
                )}
                <a className="unuttum" href="#">
                  Şifremi unuttum
                </a>
              </div>
              <div
                className={`ui three wide field animated inverted white button login-button  a-more-radius ${
                  this.props.loginButton ? "loading" : ""
                }`}
                onClick={this.handleSubmit}
              >
                <div className="visible content">Giriş Yap</div>
                <div className="hidden content">
                  <i className="right arrow icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
}

const mapStateToProps = state => {
  return {
    userWithDetails: state.user.data,
    user: state.auth.currentUser,
    loginButton: state.ui.loginButton
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCurrentUserWithDetails: () => dispatch(getCurrentUserWithDetails()),
    onLogin: (username, password) => dispatch(login(username, password)),

    onStartLoginButton: () => dispatch(uiStartLoginButton()),
    onStopLoginButton: () => dispatch(uiStopLoginButton())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(sizeMe({ monitorHeight: true })(NavBar));
