import React, { Component } from 'react';

class Header extends Component {
    render() {
    	const {user} = this.props;

        return (
        	<div className="banner">
			 	<header>
			 		 <h3>Your DoReMiFaSoLa to-do </h3> 
			    	 <h4> 
			    		{
			    	 		user.firstName	
			    	 	}	
			    	 	&nbsp;
			    	 	{
			    	 		user.lastName	
			    	 	}	 		
			    	 </h4>
			    </header>   
			</div>
        )
    }
}

export default Header;