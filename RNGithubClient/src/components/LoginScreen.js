import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Container, Header, Body, Title, Content, Form, Label, Item, Button, Input, Text } from 'native-base';

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },
  form: {
    paddingBottom: 10
  },
  button: {
    margin: 10
  }
});

const LoginScreen = class extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.checkLocalStorage();

    this.state = {
      user: null
    };
  }

  login() {
    this.navigation.dispatch({ type: 'Login', params: { user: this.state.user } });
  }

  checkLocalStorage() {
    AsyncStorage.getItem('@githubClient:user').then((user) => {
      if (user){
        this.setState({ user });
        this.login();
      }
    });
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Login</Title>
          </Body>
        </Header>
        <Content>
          <View style={styles.logoContainer}>
            <Entypo name='github' size={100} />
          </View>
          <Form style={styles.form}>
            <Item floatingLabel last>
              <Label>Username</Label>
              <Input onChangeText={(t) => this.setState({ user: t })}/>
            </Item>
          </Form>
          <Button block style={styles.button}
            onPress={() => this.login()}>
            <Text>GO</Text>
          </Button>
        </Content>
      </Container>
    );
  }
};

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LoginScreen;