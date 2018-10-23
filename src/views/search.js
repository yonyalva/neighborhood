import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from '../BooksAPI'
import Book from '../components/book'

class search extends Component {

		constructor (props) {
			super (props);
			this.state = {
				books: [],
				results: [],
				query: ""
			}
		}
		
		componentDidMount () {
		BooksAPI.getAll().then((allbooks) => {
				this.setState({books: allbooks})
			})
		}
		
		updateQuery = (query) => {
			this.setState({query: query}, this.submitSearch)
		}
		
		submitSearch() {
			if(this.state.query === '' || this.state.query === undefined) {
				return this.setState({results: []});
			}
			BooksAPI.search(this.state.query.trim()).then(res => {
				if(res.error) {
					return this.setState({results: []})
				}
				else {
					res.forEach(b => {
						let find = this.state.books.filter(Boo => Boo.id === b.id);
					})
					return this.setState({results: res});
				}
			})
		}
		
		changeShelf  = (book, shelf) => {
			BooksAPI.update(book, shelf)
			.then(resp => {
			book.shelf = shelf;
			this.setState(s => ({
			books: s.books.filter(i => i.id !== book.id).concat([book])
			}))
		})
		}
		
		
		
		render(){
			return (
			<div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to={'/'}>Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author" value={this.state.query}
				onChange={(event) => this.updateQuery(event.target.value)}
				/>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
			  {
				  this.state.results.map((book, key) => <Book changeShelf={this.changeShelf} book={book} key={key} />)
			  }
			  </ol>
            </div>
          </div>
		)
	}
}


export default search