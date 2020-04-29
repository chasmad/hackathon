import React, { Component } from 'react';
import './App.css';
import { Route, NavLink, Redirect } from 'react-router-dom';

import * as postsApi from '../../services/posts-api';
import userService from '../../utils/userService';
import SignupPage from '../SignupPage/SignupPage';
import LoginPage from '../LoginPage/LoginPage';
import NavBar from '../../components/NavBar/NavBar';
import PostIndexPage from '../PostIndexPage/PostIndexPage';
import AddPostPopUp from '../AddPostPopUp/AddPostPopUp';
import PostDetailPopUp from '../PostDetailPopUp/PostDetailPopUp';
import EditPostPopUp from '../EditPostPopUp/EditPostPopUp';
import LandingPage from '../../pages/LandingPage/LandingPage';


class App extends Component {
  state = {
    posts: [],
    user: userService.getUser(),
  };

  handleSignupOrLogin = () => {
    this.setState({ user: userService.getUser() });
  }

  handleLogout = () => {
    userService.logout();
    this.setState({ user: null });
  }

  handleAddPost = async newPostData => {
    const newPost = await postsApi.create(newPostData);
    this.setState(state => ({
      posts: [...state.posts, newPost]
    }),
      () => this.props.history.push('/index'));
  }

  handleUpdatePost = async updatedItemPost => {
    const updatedPost = await postsApi.update(updatedItemPost);
    const newPostsArray = this.state.posts.map(post =>
      post._id === updatedPost._id ? updatedPost : post
    );
    this.setState(
      { posts: newPostsArray },
      () => this.props.history.push('/index')
    );
  }

  handleDeletePost = async id => {
    await postsApi.deleteOne(id);
    this.setState(state => ({
      posts: state.posts.filter(post => post._id !== id)
    }), () => this.props.history.push('/index'));
  }

  // Lifecycle Methods

  async componentDidMount() {
    const posts = await postsApi.getAll();
    console.log(posts)
    if (posts) this.setState({ posts });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <NavBar
            user={this.state.user}
            handleLogout={this.handleLogout}
          />
          <nav>
            {this.state.user && <NavLink exact to='/index'>Class Fridge</NavLink>}&nbsp;&nbsp;&nbsp;
            {this.state.user && <NavLink to='/add'>New Magnet</NavLink>}
          </nav>
        </header>
        <main>
          <Route exact path='/' render={() =>
            <LandingPage user={this.state.user} />
          } />
          <Route exact path='/index' render={() =>
            <PostIndexPage
              posts={this.state.posts}
            />
          } />
          <Route exact path='/detail' render={({ location }) =>
            <PostDetailPopUp location={location} handleDeletePost={this.handleDeletePost} user={this.state.user} />
          } />
          <Route exact path='/add' render={() =>
            userService.getUser() ?
              <AddPostPopUp handleAddPost={this.handleAddPost}
              />
              :
              <Redirect to='/login' />
          } />
          <Route exact path='/edit' render={({ location }) =>
            userService.getUser() ?
              <EditPostPopUp handleUpdatePost={this.handleUpdatePost} location={location} user={this.state.user}
              />
              :
              <Redirect to='/login' />
          } />
          <Route exact path='/signup' render={({ history }) =>
            <SignupPage
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin} />
          } />
          <Route exact path='/login' render={({ history }) =>
            <LoginPage
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin}
            />
          } />
        </main>
        <br></br>
        <br></br>
      </div>
    )
  };
}

export default App;