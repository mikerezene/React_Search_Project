import React, { Component } from 'react';

class Search extends Component{
    componentDidMount(){
      if(this.input){
        this.input.focus();
      }
    }
    render(){
      const { value , onChange , onSubmit , children } = this.props;
      return(
        <form onSubmit={onSubmit}>
        <input 
        type='text'
        onChange = {onChange}
        value = {value}
        ref={ (node)=>{this.input = node ;}}
        />
        <button type="submit">
          {children}
        </button>
  
        </form>
      );
  
    }
  }

  export default Search;