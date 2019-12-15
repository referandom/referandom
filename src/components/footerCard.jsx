import React, { Component } from "react";
import ContactModal from "./contactModal";

class Footer extends Component {
  state = {
    contactModalShow: false
  };

  contactModalClose = () => {
    this.setState({ contactModalShow: false });
  };

  render() {
    return (
      <React.Fragment>
        <footer id="profile-footer">
          <a
            className={`img-cover ${
              this.props.mode === "home" ? "d-none" : "d-block"
            }`}
            href="/"
          >
            <img
              src="img/referandom-w.svg"
              alt=""
              srcSet=""
              width="30"
              height="30"
            />
          </a>
          <div className="ui inverted text">
            <a className="item" href="/terms">
              <span>Kullanım Şartları</span>
            </a>
            <a className="item" href="/privacy">
              <span>Gizlilik Politikası</span>
            </a>
            <a className="item" href="/aboutus">
              <span>Hakkımızda</span>
            </a>
            <a
              className="item"
              href="#"
              onClick={() => this.setState({ contactModalShow: true })}
            >
              <span>İletişim</span>
            </a>
          </div>
          <div className="ui inverted text social">
            <a
              className="item"
              target="_blank"
              rel="noopener noreferrer"
              href="https://facebook.com/referandom"
            >
              <i className="facebook f icon" />
            </a>
            <a
              className="item"
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/referandomcom"
            >
              <i className="twitter icon" />
            </a>
            <a
              className="item"
              target="_blank"
              rel="noopener noreferrer"
              href="https://instagram.com/referandom"
            >
              <i className="instagram icon" />
            </a>
            <a
              className="item"
              target="_blank"
              rel="noopener noreferrer"
              href="https://medium.com/@referandom"
            >
              <i className="medium icon" />
            </a>
          </div>
        </footer>
        <ContactModal
          show={this.state.contactModalShow}
          onHide={this.contactModalClose}
        />
      </React.Fragment>
    );
  }
}

export default Footer;
