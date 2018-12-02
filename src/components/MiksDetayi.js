import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import LoadingImage from "../images/loading.jpg";

export class MiksDetayi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      imageLoaded: false,
      data: {
        assets: [],
        task_parameters: {
          created_at_date: undefined,
          updated_at_date: undefined,
          fund_description: undefined,
          fund_name: undefined,
          fund_image: undefined
        }
      }
    };

    this.onClick = this.onClick.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  onClick(e) {
    if (e.target.id === "yatirim") {
      if (!this.state.data.invested_child.invested_child_flag)
        history.push("/emir/emir-onayla/" + this.props.match.params.id);
      else
        history.push(
          "/satin-alinan-miks/" + this.state.data.invested_child.portfolio_id
        );
    }
  }

  componentWillMount() {
    console.log("component will mount again");
    const url =
      "https://beta.miksinvest.com/miks-detayi/" + this.props.match.params.id;
    console.log("id: " + this.props.match.params.id);

    const formData = new FormData();
    const token = localStorage.getItem("jwtToken");
    const app = "true";

    formData.append("session_id", token);
    formData.append("app", app);

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
        this.setState({ data: response.data.portfolio_data, loaded: true });

        if (response.statusText === "OK") {
        } else {
          history.push("/failed");
        }
      })
      .catch(function(response) {
        console.log(response);
      });
  }

  handleLoad() {
    this.setState({ imageLoaded: true });
    console.log("handleLoad")
  }

  render() {
    const invested = "Yatırımına Gözat";
    const notInvested = "Yatırım Yap";
    const imageurl = "https://beta.miksinvest.com/static";
    const style = {
      red: { color: "red" },
      green: { color: "green" }
    };
    
    if (this.state.loaded) {
      console.log("render called ");
      return (
        <ul>
          <br />
          <br />
          <font style={{ fontSize: "18px" }}> Miks Detayi </font>
          <div className="ui segment" id="detay-box">
            <img
              id="miks-detay-resim"
              onLoad = {this.handleLoad}
              src={
                this.state.imageLoaded
                  ? imageurl +
                    "/uploads/" +
                    this.state.data.task_parameters.fund_image
                  : LoadingImage
              }
            />

            <div className="detay-buttons">
              <div
                className="ui button miksdetay"
                id="yatirim"
                onClick={this.onClick}
              >
                {this.state.data.invested_child.invested_child_flag
                  ? invested
                  : notInvested}
              </div>{" "}
              <br />
              <div
                className="ui button miksdetay"
                id="kisisellestir"
                onClick={this.onClick}
              >
                Kişiselleştir
              </div>
            </div>
            <div id="detay-yazi">
              <div style={{ fontSize: "18px", marginBottom: "10px" }}>
                {this.state.data.task_parameters.fund_name}
              </div>
              <div style={{ color: "grey" }}>
                <div>
                  Oluşturan:{" "}
                  <span className="tab">
                    {" "}
                    {" " + this.state.data.creator_username}{" "}
                  </span>
                  Oluşturulma:
                  <span className="tab">
                    {" " + this.state.data.task_parameters.created_at_date}{" "}
                  </span>
                  Güncellenme:{" "}
                  <span className="tab">
                    {this.state.data.task_parameters.updated_at_date
                      ? this.state.data.task_parameters.updated_at_date
                      : "-"}
                  </span>
                </div>
                <br />
                <div className="container">
                  <div className="inline-column">
                    <div>Endeks</div>
                    <br />
                    <div className="tab2">{this.state.data.fund_wealth}</div>
                  </div>
                  <div className="inline-column">
                    <div>Aylık Getiri</div>
                    <br />
                    <div className="tab2">
                      {this.state.data.portfolio_monthly_return}
                    </div>
                  </div>
                  <div className="inline-column">
                    <div>Yıllık Getiri</div>
                    <br />
                    <div className="tab2">
                      {this.state.data.portfolio_yearly_return}
                    </div>
                  </div>
                  <div className="inline-column">
                    <div>Volatilite</div>
                    <br />
                    <div className="tab2">
                      <img
                        style={{ width: "50px", height: "30px" }}
                        src={imageurl + this.state.data.risk_image}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ui segment">
            {this.state.data.task_parameters.fund_description}
          </div>
          <table className="ui celled table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Sembol</th>
                <th>Ağırlık</th>
                <th>Son Fiyat</th>
                <th>Günlük Değişim</th>
                <th>Aylık Değişim</th>
                <th>Yıllık Değişim</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.assets &&
                this.state.data.assets.map(function(datas, i) {
                  return (
                    <tr key={i}>
                      <td>{datas.description}</td>
                      <td>{datas.symbol}</td>
                      <td>{datas.volume_fraction_percent}</td>
                      <td>{datas.current_price}</td>
                      <td
                        style={
                          parseFloat(datas.daily_return_percent) > 0
                            ? style.green
                            : style.red
                        }
                      >
                        {"%" + datas.daily_return_percent}{" "}
                      </td>
                      <td
                        style={
                          parseFloat(datas.daily_return_percent) > 0
                            ? style.green
                            : style.red
                        }
                      >
                        {"%" + datas.monthly_return_percent}{" "}
                      </td>
                      <td
                        style={
                          parseFloat(datas.daily_return_percent) > 0
                            ? style.green
                            : style.red
                        }
                      >
                        {"%" + datas.one_year_return_percent}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </ul>
      );
    } else {
      return <div />;
    }
  }
}
