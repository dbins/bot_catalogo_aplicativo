import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from './config';
import './ReactotronConfig';

const BOT_USER = {
  _id: 2,
  name: 'Bins',
  avatar: 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=BT',
};

class App extends Component {
  state = {
    messages: [
      {
        _id: 1,
        text: 'Olá! Eu sou o catalogo BOT 🤖 .\n\nComo eu posso te ajudar?',
        createdAt: new Date(),
        user: BOT_USER,
      },
    ],
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }

  handleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    //let payload = result.queryResult.webhookPayload;
    let payload = {is_image: false};
    if (result.queryResult.fulfillmentMessages[1]) {
      if (result.queryResult.fulfillmentMessages[1].card) {
        payload.is_image = true;
        payload.text = text;
        payload.image = result.queryResult.fulfillmentMessages[1].card.imageUri;
      }
    }
    this.showResponse(text, payload);
  }

  showResponse(text, payload) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    if (payload && payload.is_image) {
      msg.text = payload.text;
      msg.image = payload.image;
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      result => this.handleResponse(result),
      error => console.log(error),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          placeholder={'Digite sua mensagem...'}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

//

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
