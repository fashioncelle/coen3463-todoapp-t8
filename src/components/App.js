import React, { Component } from 'react';
import { connect } from 'react-refetch';
import Header from './Header/Index';
import Taskstodo from './Taskstodo/Index';
import Footer from './Footer/Index';

class App extends Component {
  render() {
  	const { userDataFetch } = this.props;
  	 if (userDataFetch.pending) {
        return (
          <div className="progress">
          <div className="indeterminate"/>
         </div>
      )
    }
  	if (userDataFetch.fulfilled) {
  		const [ user ] = userDataFetch.value;
	    return(
	    	<div className="main">
		      	<Header user={user}/>
		      	<Taskstodo user={user} />
            <Footer />
	      </div>
	    )
  	}	
  }
}

export default connect(() => {
    return {
        userDataFetch: `/api/user`,
    }
})(App);
