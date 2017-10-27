import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Container, Header, Body, Title, Content, Form, Label, Item, Button,
  Input, Text, Spinner
} from 'native-base';

import { basicLogin, checkToken } from '../services/githubLogin';

import ErrorToast from './ErrorToast';

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50
  },
  form: {
    paddingBottom: 10
  },
  button: {
    margin: 10
  }
});

/**
 * Class for login screen
 *
 * @class LoginScreen
 * @desc  For typing name currently, will do oauth later.
 */
const LoginScreen = class extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.checkLocalStorage();

    this.state = {
      login: null,
      password: null,
      tfaToken: null,
      needTFA: false,
      loading: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // /**
  //  * Dispatch login status to redux
  //  */
  // login() {
  //   this.navigation.dispatch({ type: 'Login', params: { user: this.state.user } });
  // }

  async checkTokenAndDispatch({ login, token }) {
    try {
      const user = await checkToken(login, token);
      this.navigation.dispatch({ type: 'Login', params: { user: { login, token } } });
    } catch (e) {
      ErrorToast(e);
    }
  }

  async login() {
    const { login, password, tfaToken } = this.state;
    const { dispatch } = this.props;
    this.setState({ loading: true })
    try {
      const user = await basicLogin(login, password, tfaToken);
      this.checkTokenAndDispatch({ login, token: user.token });
    } catch (e) {
      if (~e.message.indexOf('two-factor')) {
        this.setState({ needTFA: true, });
      }
      ErrorToast(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  /**
   * Check local storage, if user have already logged in, pass automatically
   */
  checkLocalStorage() {
    AsyncStorage.getItem('@githubClient:user').then((user) => {
      if (!user) return
      return this.checkTokenAndDispatch(JSON.parse(user));
    });
  }

  /**
   * Render function
   *
   * @return ReactDOM
   */
  render() {
    const { loading, needTFA } = this.state;

    return (
      <Container>
        <Header>
          <Body>
            <Title>Login</Title>
          </Body>
        </Header>
        <Content>
          <View style={styles.logoContainer}>
            <Entypo name='github' size={30} />
            <Text>Login into GitHub</Text>
          </View>
          <Form style={styles.form}>
            <Item floatingLabel last>
              <Label>Username</Label>
              <Input onChangeText={(t) => this.setState({ login: t })} autoCapitalize='none' />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input onChangeText={(t) => this.setState({ password: t })} secureTextEntry={true} />
            </Item>
            {needTFA && <Item floatingLabel last>
              <Label>Two-factor Token</Label>
              <Input onChangeText={(t) => this.setState({ tfaToken: t })}
                keyboardType='number-pad' maxLength={6} />
            </Item>}
          </Form>
          {!loading
            ?
            <Button block style={styles.button}
              onPress={() => this.login()}>
              <Text>GO</Text>
            </Button>
            :
            <Spinner color='#00a6de' />
          }
        </Content>
      </Container>
    );
  }
};

/**
 * Prop Types
 * Need navigation from redux connector
 */
LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LoginScreen;