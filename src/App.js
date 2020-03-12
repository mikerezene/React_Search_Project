import React, { Component } from 'react';
import axios from 'axios';
import './App.css';



import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP

} from './Constants/index'

import Table from './Components/Table/index';

import Search from './Components/Search/index'

import Button from './Components/Button/index'




const Loading = () => {
  return <div>Loading ... </div>
}
 
 

const withFoo = (Component) =>  ({isLoading , ...rest}) =>  
isLoading ?
<Loading/> :
<Component {...rest}/>

const ButtonWithLoading = withFoo(Button);

const updateSearchTopStoriesState = (hits,page) => (prevState) => {
    const { searchKey , results} = prevState;
     console.log("SO far I'm good");
    const oldHits = (results && results[searchKey]) ? results[searchKey].hits : [];
     console.log("am i still good");
    const updatedHits = [ ...oldHits,...hits];

    return  {results: {...results,[searchKey] : {hits: updatedHits,page}}, isLoading : false}
}


class App extends Component {
  is_Mounted = false;
constructor(props){
    super(props);
    this.state = {
        
        results:null,
        error: null,
        searchKey:'',
        searchTerm: DEFAULT_QUERY,
        isLoading :false,

    }
  this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
  this.setSearchTopStories = this.setSearchTopStories.bind(this);
  this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  this.onSearchSubmit = this.onSearchSubmit.bind(this);
  this.onSearchChange = this.onSearchChange.bind(this);
  this.onDismiss = this.onDismiss.bind(this);


}
componentDidMount(){
  this.is_Mounted = true
  const {searchTerm} =  this.state
  this.setState({searchKey:searchTerm});
   this.fetchSearchTopStories(searchTerm);

}
componentWillUnmount(){
  this.is_Mounted = false;
}
needsToSearchTopStories(searchTerm){
  return !this.state.results[searchTerm];

}
 fetchSearchTopStories(searchTerm, page = 0){
   this.setState({isLoading : true  })
  axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
  .then((result)=>this.is_Mounted && this.setSearchTopStories(result.data))
  .catch((error)=>this.is_Mounted && this.setState({error}))
}
onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState({searchKey: searchTerm});
    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }
    
    event.preventDefault();
}
clientJackpot(value){
  this.setState({result : value});
}
setSearchTopStories(result) {
  const {hits, page} = result;

  this.setState(updateSearchTopStoriesState(hits,page));

}

onSearchChange(event){
   this.setState({searchTerm:event.target.value})
}

onDismiss(id){
  const {searchKey , results } = this.state;
  const {hits, page} = results[searchKey];
  const updatedList = hits.filter(item=> id !== item.objectID)
  this.setState({results : {...results,[searchKey]: {updatedList,page}}})

  
};
  render() {
    const {  searchTerm ,results , searchKey, error , isLoading } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = ( results && results[searchKey] && results[searchKey].hits) || [];
    // if(!result){
    //   return null;
    // }
    if(error){
      return <p>Something went wrong</p>;
    }
    console.log(this.state.result);
    return (
      <div className= "page">
      <div className="interactions">
        <Search value={searchTerm} 
                 onChange={this.onSearchChange}
                 onSubmit={this.onSearchSubmit}>
              Search
        </Search>  
      </div>
     { error
       ? <div className="interactions">
          <p>Something went wrong.</p>
          <p>Last Check is On!!!!!!!!!!!!!</p>
          <p>Going well</p>
          <p>Yo Heni</p>
         </div>
          : <Table
          list={list}
          onDismiss={this.onDismiss}
          />
      }
     <div className="interactions">
       <ButtonWithLoading
        isLoading = {isLoading}
        onClick={() => this.fetchSearchTopStories(searchKey,page + 1)}>
         More
       </ButtonWithLoading>
       </div>

      </div>
    );
  }
}

export default App;