import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { 
     Container, 
     Row,
     Col,
     Tabs,
     Tab,
     Button 
       } from 'react-bootstrap'; 
import SignUp from './signup/signup';
import LogIn from './login/login';
import {
  getFromStorage,
} from './utils/storage';


class App extends Component { 
    constructor( props, context) {
        super(props, context);
        
        this.stateChanger = this.stateChanger.bind(this);
        this.logOutClicked = this.logOutClicked.bind(this);
        
        this.state = {
            loggedIn: false,
            token: '',
            loggedInName: 'Unnamed Ashok Kumar',
            logOutButtonStatus: 'warning',
            logOutLoadingMessage: 'Log Out',
            logOutLoading: false,
            
            
            
        }
    }
    
    stateChanger(newState) {
        this.setState(newState);
    }
    
    componentDidMount() {
    const obj = getFromStorage('the_login_n_signup');
    if (obj && obj.token) {
      const { token } = obj;
      const { name } = obj;
      // Verify token
      fetch('http://localhost:4000/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              loggedInName: name,
              logOutLoading: false,
              loggedIn: true,
            });
          } else {
            this.setState({
              logOutLoading: false,
            });
          }
        });
    } else {
      this.setState({
        logOutLoading: false,
      });
    }
  }
    
    logOutClicked() {
        this.setState({
          logOutLoading: true,
          logOutLoadingMessage: 'Logging Out...',
          logOutButtonStatus: 'info',
        });
        const obj = getFromStorage('the_login_n_signup');
        if (obj && obj.token) {
          const { token } = obj;
          // Verify token
          fetch( 'http://localhost:4000/api/account/logout?token=' + token)
            .then(res => {
              //console.log(res);
              return res.json();
          })
            .then(json => {
              if (json.success) {
                this.setState({
                  token: '',
                  logOutLoading: false,
                  loggedIn: false,
                });
              } else {
                this.setState({
                  logOutLoading: false,
                });
              }
            });
        } else {
          this.setState({
            logOutLoading: false,
          });
        }
        
    }
    
    
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
 
          <h1 className="App-title">Login Or Sign-Up</h1>
        </header>
            <Container>
                <Row>
                    <Col md={4}></Col>
                    <Col xs={12} md={4}>
                        {this.state.loggedIn ? 
                            <div><h1>Welcome {this.state.loggedInName}!</h1> 
                            <Button
                                  block
                                  bsStyle= {this.state.logOutButtonStatus}
                                  disabled = {this.state.logOutLoading}
                                  onClick = {this.state.logOutLoading ? null : this.logOutClicked}
                                  >
                                    {this.state.logOutButtonStatus ? 'Log Out' : 'Logging Out'}
                            </Button>
                            </div>
                            : 
                            
                            <div className = "loginBoxContainer">
                            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                                  <Tab eventKey={1} title="Login" className="tabContent">
                                    <LogIn stateChanger = {this.stateChanger}/>
                                  </Tab>
                                  <Tab eventKey={2} title="Sign Up" className="tabContent">
                                    <SignUp />
                                  </Tab>
                            </Tabs>
                        </div>}
                    
                    </Col>
                    <Col md={4}></Col>
                </Row>
            </Container>
      </div>
    );
  }
}

export default App;