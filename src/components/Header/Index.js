import React, { Component } from 'react';

class Header extends Component {
    render() {
    	const {user} = this.props;

        return (
		 	<header className="zerogrid">
		 		 <h5>Your DoReMiFaSoLa to-do </h5> 
		    	 <h1> 
		    		{
		    	 		user.firstName	
		    	 	}	
		    	 	&nbsp;
		    	 	{
		    	 		user.lastName	
		    	 	}	 		
		    	 </h1>
		    	 <h3> 
		    	 	&#64;
		    		{
		    	 		user.username	
		    	 	}	 		
		    	 </h3>
		    </header>   
        )
    }
}

export default Header;