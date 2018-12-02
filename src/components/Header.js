import React from "react";
import { connect } from "react-redux";
import { loggedOut } from "../actions/LoginManager.js";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style.css";
import {Dropdown } from "semantic-ui-react";
import MiksSearch from "./MiksSearch";
import MiksImage from "../images/miks.svg";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      miks_result: { miks: [], assets: [] },
      tickerDict: [],
      username: undefined,
      isLoading: true,
      results: [],
      value: undefined
    };
    this.resetComponent = this.resetComponent.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  resetComponent() {
    this.setState({ isLoading: false, results: [], value: "" });
  }

  componentWillMount() {
    const url = "https://beta.miksinvest.com/kesfet";

    const formData = new FormData();
    const token = localStorage.getItem("jwtToken");
    const app = "true";

    formData.append("session_id", token);
    formData.append("app", app);

    this.resetComponent();

    axios({
      method: "get",
      url: url,
      headers: {
        "Content-Type": "multipart/form-data",
        session_id: token,
        app: "true"
      }
    })
      .then(response => {
        if (response.statusText === "OK") {
          this.setState({
            tickerDict: response.data.ticker_dict,
            username: response.data.username
          });
        } else {
          history.push("/failed");
        }
      })
      .catch(function(response) {
        console.log(response);
      });
  }

  handleSearchChange(e, { value }) {
    this.setState({
      isLoading: true,
      results: [],
      value: value
    });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const url1 = "https://beta.miksinvest.com/search?search_str=";
      const url2 = "&search_str_eng=";

      const formData = new FormData();

      const token = localStorage.getItem("jwtToken");
      const app = "true";

      formData.append("session_id", token);
      formData.append("app", app);

      axios({
        method: "get",
        url: url1 + this.state.value + url2 + this.state.value,
        headers: {
          "Content-Type": "multipart/form-data",
          session_id: token,
          app: "true"
        }
      })
        .then(response => {
          //handle success

          if (response.statusText === "OK") {
            this.setState({ search_result: response.data.search_result });
          } else {
            history.push("/failed");
          }
        })
        .catch(function(response) {
          //handle error
          console.log(response);
        });
    }, 500);
  }

  render() {
    const style = {
      red: { color: "red" },
      green: { color: "green" }
    };
    if (this.props.login) {
      return (
        <div className="header">
          <div id="tickerdict">
            {this.state.tickerDict &&
              this.state.tickerDict.map(function(datas, i) {
                return (
                  <span key={i}>
                    <a>
                      <font color="black">{datas.description}</font> :{" "}
                      {datas.last_close_price}{" "}
                      <font
                        style={
                          parseFloat(datas.daily_return) > 0
                            ? style.green
                            : style.red
                        }
                      >
                        ({datas.daily_return + "%"}){" "}
                      </font>
                      &#160;&#160;&#160;&#160;&#160;
                    </a>
                  </span>
                );
              })}
          </div>
          <div className="ui inverted segment">
            <div className="ui inverted secondary pointing menu">
              <Link
                className="item"
                to="/kesfet"
                style={{ color: "white", marginRight: "5%" }}
              >
                <img src={MiksImage} style={{ width: "70px" }} />
              </Link>

              <Dropdown text="Hesabım">
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    text="Yatırımlarım"
                    to="/hesabim/yatirimlarim"
                  />
                  <Dropdown.Item
                    as={Link}
                    text="Toplam Portföyüm"
                    to="/hesabim/toplam-portfoyum"
                  />
                  <Dropdown.Item
                    as={Link}
                    text="Emirlerim"
                    to="/hesabim/emirlerim"
                  />
                  <Dropdown.Item
                    as={Link}
                    text="İşlemlerim"
                    to="/hesabim/islemlerim"
                  />
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown text="Keşfet">
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    text="Miksleri Keşfet"
                    to="/kesfet"
                  />
                  <Dropdown.Item
                    as={Link}
                    text="Favorilerim"
                    to="/kesfet/favorilerim"
                  />
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown text="Oluştur">
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    text="Miks Oluştur"
                    to="/olustur/miks-olustur"
                  />
                  <Dropdown.Item
                    as={Link}
                    text="Oluşturduğum Miksler"
                    to="/olustur/olusturdugum-miksler"
                  />
                </Dropdown.Menu>
              </Dropdown>

              <MiksSearch />
              <div className="userName">{this.state.username}</div>
              <div className="second-menu" />

              <div className="item">
                <Link to="/login" onClick={() => this.props.loggedOut()}>
                  Logout
                </Link>
              </div>
              <div />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="ui inverted segment">
          <div className="ui inverted secondary pointing menu">
            <Link className="item" to="/">
              Home
            </Link>
            <div className="second-menu" />
            <Link className="item" to="/login">
              Login
            </Link>

            <Link className="item" to="/signup">
              Sign Up
            </Link>
            <div />
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    login: state.login
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loggedOut }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
