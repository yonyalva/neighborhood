import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from '../BooksAPI'
import Shelf from '../components/shelf'

class home extends Component {
		
		constructor (props) {
			super (props);
			this.state = {
				books: []
			}
		}
		componentDidMount () {
		BooksAPI.getAll().then((allbooks) => {
				this.setState({books: allbooks})
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
			 <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
			<Shelf changeShelf={this.changeShelf} title="Currently Reading" books={this.state.books.filter(a => a.shelf === "currentlyReading")}/>
			<Shelf changeShelf={this.changeShelf} title="Want to Read" books={this.state.books.filter(a => a.shelf === "wantToRead")}/>
			<Shelf changeShelf={this.changeShelf} title="Read" books={this.state.books.filter(a => a.shelf === "read")}/>
            </div>
            <div className="open-search">
              <Link to={'/Search'}>Add a book</Link>
            </div>
          </div>
		)
	}
}


export default home