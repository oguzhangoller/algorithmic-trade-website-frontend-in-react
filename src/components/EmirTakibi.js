import React from "react";
import axios from "axios";
import { Progress } from "semantic-ui-react";
import { history } from "../routers/AppRouter.js";

export class EmirTakibi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: false,
      mountedOnce: false,
      accepted: 0,
      loaded: false,
      url: undefined,
      urlDefined: false,
      data: {
        portfolio_parameters: {
          fund_name: undefined,
          fund_image: undefined
        }
      },
      fieldData: {}
    };

    this.updateComponent = this.updateComponent.bind(this);
  }

  componentWillMount() {
    if (!this.state.mountedOnce) {
      const url =
        "https://beta.miksinvest.com/emir/emir-takibi/" +
        this.props.match.params.id1 +
        "/" +
        this.props.match.params.id2;

      const token = localStorage.getItem("jwtToken");

      axios({
        method: "get",
        url: url,
        headers: {
          session_id: token,
          app: "true",
          "Content-Type": "multipart/form-data"
        }
      })
        .then(response => {
          if (response.statusText === "OK") {
            console.log("emir takibi will mount");
            console.log(response);
            this.setState({
              data: response.data.data,
              loaded: true
            });
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

      this.setState({ mountedOnce: true });
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.updateComponent(), 1000);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  updateComponent() {
    const url =
      "https://beta.miksinvest.com/emir/emir-takibi/" +
      this.props.match.params.id1 +
      "/" +
      this.props.match.params.id2;
      
    const token = localStorage.getItem("jwtToken");
    if(!this.state.completed){
    
    axios({
      method: "get",
      url: url,
      headers: {
        session_id: token,
        app: "true",
        "Content-Type": "multipart/form-data"
      }
    })
      .then(response => {
        this.setState({
          completed: response.data.data.all_orders_realized_flag,
          loaded: true,
          accepted: response.data.data.accepted_order_count,
          url: response.data.url
        });


        if (response.statusText === "OK") {
          console.log(response);
        } else {
          console.log("not ok");
          console.log(response.statusText);
          history.push("/failed");
        }
      })
      .catch(function(response) {
        console.log(response);
      });
    }

    else if(!this.state.urlDefined){
      console.log("accepted");
      
      let redirectUrl;
      
        axios({
          method: "post",
          url: url,
          headers: {
            session_id: token,
            app: "true",
            "Content-Type": "multipart/form-data"
          }
        })
          .then(response => {
            this.setState({url: response.data.url,urlDefined:true})
    
            console.log("url " + response.data.url)
    
            if (response.statusText === "OK") {
              console.log("emir takibi update");
              console.log(response);
            } else {
              console.log("not ok");
              console.log(response.statusText);
              history.push("/failed");
            }
          })
          .catch(function(response) {
            console.log(response);
          });
        
       
        
    }
    else {
      console.log("redirecting")
      clearInterval(this.interval);
      history.push(this.state.url);
    }
  }

  render() {
    const imageurl = "https://beta.miksinvest.com/static";
    if (this.state.loaded) {
      console.log("ilk veri : " + this.state.data.total_order_count)
      return (
        <ul>
          <br />
          <br />
          <font style={{ fontSize: "18px" }}> Emir Takibi </font>
          <div className="ui segment" style={{ overflow: "auto" }}>
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


              <div style={{float:'left'}}>
              Emirleriniz piyasaya iletildi. Emirlerinizin gerçekleşme sürecini aşağıda takip edebilirsiniz.
                <Progress
                  value={this.state.accepted}
                  total={this.state.data.total_order_count}
                  progress="ratio"
                  content={"Gerçekleştirilen Emirler"}
                  indicating
                />{" "}
              </div>
           
          </div>
        </ul>
      );
    } else {
      return <div />;
    }
  }
}

