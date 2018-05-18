import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase';
import Results from './Results';

// Create anonymous Firebase user
firebase.auth().signInAnonymously();
window.fb = firebase;

// Initialize Firestore
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      ratings: [],
      croissants: [],
    };
  }

  componentDidMount() {
    db
      .collection("ratings")
      .get()
      .then(snapshot => {
        const ratings = snapshot.docs.map(doc => {
          return doc.data();
        });
        this.setState({
          ratings: ratings,
        });
      });

    db
      .collection("croissants")
      .orderBy("index")
      .get()
      .then(snapshot => {
        const croissants = snapshot.docs.map(doc => {
          const c = doc.data();
          c.id = doc.id;
          switch (c.index) {
            case 1:
              c.bakery = "7-11";
              c.price = 18;
              break;
            case 2:
              c.bakery = "Rene Brød";
              c.price = 18;
              break;
            case 3:
              c.bakery = "Brødflov";
              c.price = 20;
              break;
            case 4:
              c.bakery = "Andersen & Maillard";
              c.price = 25;
              break;
            case 5:
              c.bakery = "Juno";
              c.price = 24;
              break;
            case 6:
              c.bakery = "Steinbeck";
              c.price = 13;
              break;
            case 7:
              c.bakery = "Brød";
              c.price = 19;
              break;
            case 8:
              c.bakery = "Democratic Coffee Bar";
              c.price = 22;
              break;

            default:
              break;
          }
          return c;
        });
        this.setState({
          croissants: croissants,
        });
      });
  }


  render() {
    return ( <
      div className = "App" >
      <
      Results croissants = {
        this.state.croissants
      }
      ratings = {
        this.state.ratings
      }
      /> <
      /div>
    );
  }
}

export default App;