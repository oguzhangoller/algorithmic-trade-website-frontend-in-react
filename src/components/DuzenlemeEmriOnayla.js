import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import forEach from "lodash.foreach";

export class DuzenlemeEmriOnayla extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      moneyLeft: false,

      data: {
        orders_data: [],
        portfolio_parameters: {
          fund_name: undefined,
          fund_image: undefined,
          fund_description: undefined
        }
      }
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {

    if (e.target.id==="onayla") {
        const url = "https://beta.miksinvest.com/emir/confirm-order";
        const formData = new FormData();
        const token = localStorage.getItem("jwtToken");
        formData.append("portfolio_id", this.props.match.params.id1);
        formData.append("order_group_id", this.props.match.params.id2);
  
        axios({
          method: "post",
          url: url,
          data: formData,
          headers: {
            session_id: token,
            app: "true",
            "Content-Type": "multipart/form-data"
          }
        })
          .then(response => {
            this.setState({
              loaded: true,
              ready:true
            });
  
            if (response.statusText === "OK") {
              console.log(response);
              history.push(response.data.url)
            } else {
              console.log("not ok");
              console.log(response.statusText);
              history.push("/failed");
            }
          })
          .catch(function(response) {
            //handle error
            console.log(response);
          });
        
    } else if(e.target.id==="iptal-et"){
        history.push('/hesabim')
      }
  }

  componentWillMount() {
    const url =
      "https://beta.miksinvest.com/emir/duzenleme-emri-onayla/" +
      this.props.match.params.id1 +
      "/" +
      this.props.match.params.id2;

    const token = localStorage.getItem("jwtToken");

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
          this.setState({ data: response.data.data, loaded: true });
          console.log("response");
          console.log(response);
        } else {
          history.push("/failed");
        }
      })
      .catch(function(response) {
        console.log(response);
      });
  }

  render() {
    let items = [];
    const imageurl = "https://beta.miksinvest.com/static";

    forEach(this.state.data.orders_data, function(value, key) {
      items.push(value);
    });

    if (this.state.loaded) {
      return (
        <ul>
          <br />
          <br />
          <font style={{ fontSize: "18px" }}> Emir Onayla </font>
          <div className="ui segment">
            <div style={{ marginLeft: "10px", marginBottom: "10px" }}>
              <font> {this.state.data.portfolio_name} </font>
            </div>
            <img
              id="miks-detay-resim"
              src={
                imageurl +
                "/uploads/" +
                this.state.data.portfolio_parameters.fund_image
              }
            />
           <div className="detay-buttons">
              <div
                className="ui button miksdetay"
                id="onayla"
                onClick={this.onClick}
              >
                Onayla
              </div>{" "}
              <br />
              <div
                className="ui button miksdetay"
                id="iptal-et"
                onClick={this.onClick}
              >
                İptal Et
              </div>
            </div>
            
            <div id="upper-section-detay">
              <div id="left-section-detay">
               
                
                <div>
                  Miks'teki Yatırım
                  <font style={{ float: "right", color: "black" }}>
                    {this.state.data.total_volume}
                  </font>
                </div>
                <hr />
                <div>
                  Ödenecek Komisyon{" "}
                  <font style={{ float: "right", color: "black" }}>
                    {this.state.data.commission_cost}
                  </font>
                </div>
                <div>
                  Emir Tipi{" "}
                  <font style={{ float: "right", color: "black" }}>
                    Piyasa Emri
                  </font>
                </div>
              </div>
            </div>
            <hr style={{ marginTop: "60px" }} />

            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <font id="bottom-yazi">
                {" "}
                Lütfen aşağıdaki bilgileri doğrulayın. Emirler her bir sembol
                için pay bazında iletileceği için emirin toplam parasal değeri
                belirlemiş olduğunuz değerden farklı olacaktır. Fiyatlar
                değişebildiği için toplam miktar tahminidir.{" "}
              </font>
            </div>
          </div>

          <table className="ui celled table">
            <thead>
              <tr>
                <th>Sembol Detayı</th>
                <th>Sembol</th>
                <th>İşlem</th>
                <th>Lot Sayısı</th>
              </tr>
            </thead>
            <tbody>
              {items.map((datas, i) => {
                return (
                  <tr key={i}>
                    <td>{datas.symbol_description}</td>
                    <td>{datas.symbol_name}</td>
                    <td>{datas.action}</td>
                    <td>{datas.volume_lot}</td>
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

