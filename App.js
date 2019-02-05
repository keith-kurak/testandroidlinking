import { Linking, WebBrowser } from 'expo';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  state = {
    redirectData: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Redirect Example</Text>

        <Button
          onPress={this._openWebBrowserAsync}
          title="openWebBrowserAsync()"
        />

        <View style={{ height: 10 }} />
        <Button
          onPress={this._openAuthSesssionAsync}
          title="openAuthSessionAsync()"
        />

        {this._maybeRenderRedirectData()}
      </View>
    );
  }

  _handleRedirect = event => {
    console.log('Redirect handled!');
    WebBrowser.dismissBrowser();

    let data = Linking.parse(event.url);

    this.setState({ redirectData: data });
  };

  _openWebBrowserAsync = async () => {
    try {
      this._addLinkingListener();
      let result = await WebBrowser.openBrowserAsync(
        // We add `?` at the end of the URL since the test backend that is used
        // just appends `authToken=<token>` to the URL provided.
        `https://backend-xxswjknyfi.now.sh/?linkingUri=${Linking.makeUrl('/?')}`
      );
      this._removeLinkingListener();
      this.setState({ result });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  _openAuthSesssionAsync = async () => {
    try {
      console.log('before auth session');
      let result = await WebBrowser.openAuthSessionAsync(
        // We add `?` at the end of the URL since the test backend that is used
        // just appends `authToken=<token>` to the URL provided.
        `https://backend-xxswjknyfi.now.sh/?linkingUri=${Linking.makeUrl('/?')}`
      );
      console.log('after auth session');
      console.log(`you'll never see this!`);
      console.log(result);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  _addLinkingListener = () => {
    Linking.addEventListener('url', this._handleRedirect);
    console.log('Linking is listening!');
  };

  _removeLinkingListener = () => {
    Linking.removeEventListener('url', this._handleRedirect);
    console.log('Linking is not listening!');
  };

  _maybeRenderRedirectData = () => {
    if (!this.state.redirectData) {
      return;
    }

    return <Text>{JSON.stringify(this.state.redirectData)}</Text>;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: {
    fontSize: 25,
    marginBottom: 25,
  },
});