import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import forEach from "lodash.foreach";
import { Input, Label } from "semantic-ui-react";

export class EmirOnayla extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyField: true,
      loaded: false,
      value: undefined,
      error: false,
      errorMessage: "",
      ready: false,
      data: {
        total_expected_buy_amount: undefined,
        orders_data: [],
        portfolio_parameters: {
          fund_name: undefined,
          fund_image: undefined,
          fund_description: undefined
        }
      },
      fieldData: {
        
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (e.target.id === "yatirim"){ 
      if(this.state.ready){
      const url = "https://beta.miksinvest.com/emir/confirm-order";
      const formData = new FormData();
      const token = localStorage.getItem("jwtToken");
      const val=this.state.value;
      formData.append("invest_amount", val);
      formData.append("portfolio_id", this.state.fieldData.portfolio_id);
      formData.append("order_group_id", this.state.fieldData.order_group_id);

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
            console.log("will mount");
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
      }else {
        this.setState({ error: true, errorMessage: "Bilgilerinizi kontrol edin"});
      }
    
    }
    else if(e.target.id==="iptal-et"){
      history.push('/miks-detayi/' + this.props.match.params.id)
    }
  }

  handleChange(e) {
    const val = e.target.value;
    this.setState({value: val});
    let values = this.state.data.free_cash.split(".");
    let result = values[0];
    let cash = values[1].split(",");
    result += cash[0] + "." + cash[1];
    
    if (val.toString().length > 4 && parseInt(val) <= result) {
      this.setState({ error: false, emptyField: false});
      const url = "https://beta.miksinvest.com/miks/invest";
      const formData = new FormData();

      const token = localStorage.getItem("jwtToken");

      formData.append("invest_amount", val);

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
            fieldData: response.data.data.invest_data.data,
            loaded: true,
            ready: true
          });

          if (response.statusText === "OK") {
            console.log("will mount");
            console.log(response);
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
    } else if (val.toString().length === 0) {
      this.setState({ error: false, emptyField: true, ready: false });
    } else if (parseInt(val) > result) {
      this.setState({ error: true, errorMessage: "Yetersiz Bakiye", ready: false });
    } else {
      this.setState({
        error: true,
        errorMessage: "Min 10.000 TL yatırabilirsiniz.",
        ready: false
      });
    }
  }

  componentWillMount() {
    const url =
      "https://beta.miksinvest.com/emir/emir-onayla/" +
      this.props.match.params.id;

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
    const invested = "Yatırımına Gözat";
    const notInvested = "Yatırım Yap";
    let items1= [];
    let items2= [];
    const imageurl = "https://beta.miksinvest.com/static";
    const style1 = {
      red: { color: "red" },
      green: { color: "green" }
    };

    forEach(this.state.data.orders_data,function(value,key){
      items1.push(value)});
    forEach(this.state.fieldData.orders_data,function(value,key){
      items2.push(value)});
    if (this.state.loaded) {
      return (
        <ul>
          <br />
          <br />
          <font style={{ fontSize: "18px" }}> Emir Onayla </font>
          <div className="ui segment" >
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
                id="yatirim"
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
            <div id="upper-section">
              <div id="left-section">
                <div>Almak istediğiniz miktar</div>
                <hr />
                <div style={{ marginBottom: "10px" }}>
                  Kullanılabilir Bakiye
                  <font style={{ float: "right", color: "black" }}>
                    {this.state.data.free_cash}
                  </font>
                </div>
                <div>
                  <Input
                    label={{ basic: true, content: "TL" }}
                    labelPosition="right"
                    onChange={this.handleChange}
                    type="number"
                    placeholder="0"
                  />
                </div>
                <div>
                  {this.state.error && (
                    <Label id="warning" pointing color="red">
                      {this.state.errorMessage}
                    </Label>
                  )}
                </div>
              </div>
              <div id="right-section">
                <div >
                  Tahmini Alınacak Miktar
                  <div id="rightAlign">
                    {this.state.emptyField
                      ? "--"
                      : this.state.fieldData.total_expected_buy_amount}
                  </div>
                </div>
                <hr />
                <div>
                  Miksteki Yatırım
                  <div id="rightAlign">{this.state.data.total_volume}</div>
                </div>
                <div>
                  Tahmini Yeni Yatırım
                  <div id="rightAlign">
                    {this.state.emptyField
                      ? "--"
                      : this.state.fieldData
                          .final_expected_investment_after_confirmation}
                  </div>
                </div>
                <div>
                  Ödenecek Komisyon
                  <div id="rightAlign"> {this.state.data.commission_cost}</div> 
                </div>
                <div>Emir Tipi <div id="rightAlign">Piyasa Emri</div></div>
              </div>
            </div>
            <hr style={{marginTop:"60px", width: "80%"}} />

            <div style={{ marginTop: "30px",textAlign:"center" }}>
              <font id="bottom-yazi">
                {" "}
                Lütfen aşağıdaki bilgileri doğrulayın. Emirler her bir sembol
                için pay bazında iletileceği için emirin toplam parasal değeri
                belirlemiş olduğunuz değerden farklı olacaktır. Fiyatlar
                değişebildiği için toplam miktar tahminidir.{" "}
              </font>
            </div>
          </div>

          <div className="ui segment">
            {this.state.data.portfolio_parameters.fund_description}
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
            
             {this.state.emptyField ? items1.map((datas, i) => {
                 return (
                  <tr key={i}>
                    <td>{datas.symbol_description}</td>
                    <td>{datas.symbol_name}</td>
                    <td>{datas.action}</td>
                    <td>{datas.volume_lot}</td>
                  </tr>
                );
            }) : items2.map((datas, i) => {
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

