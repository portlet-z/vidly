import React, { Component } from 'react'
import { getMovies } from '../services/fakeMovieService'
import { getGenres } from '../services/fakeGenreService'
import MoviesTable from "./moviesTable";
import ListGroup from './common/listGroup'
import Pagination from './common/pagination'
import { paginate } from '../utils/paginate'
import _ from 'lodash'
import { Link } from 'react-router-dom';

export default class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: 'title', order: 'asc'}
  }
  componentDidMount() {
    const genres = [{_id: 'all', name: 'All Genres'}, ...getGenres()]
    this.setState({ movies: getMovies(), genres})
  }
  handleLiked = movie => {
    const movies = [...this.state.movies]
    const index = movies.indexOf(movie)
    movies[index].liked = !movies[index].liked
    this.setState({movies})
  }
  handlePageChange = page => {
    this.setState({ currentPage: page})
  }
  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 })
  }
  handleSort = sortColumn => {
    this.setState({ sortColumn })
  }
  getPageData = () => {
    const { pageSize, currentPage, movies: allMovies, selectedGenre, sortColumn } = this.state
    const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
    const movies = paginate(sorted, currentPage, pageSize)
    return {totalCount: filtered.length, data: movies}
  }
  render() {
    const { length: count} = this.state.movies
    const { pageSize, currentPage, selectedGenre, genres, sortColumn } = this.state
    if (count === 0) 
      return <p>There are no movies it the database</p>
    const {totalCount, data} = this.getPageData()
    return (
      <div className='row'>
        <div className="col-3">
          <ListGroup 
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <Link
            to="/movies/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Movie
          </Link>
          <p>Showing {totalCount} movies in the database</p>
          <MoviesTable 
            movies={data}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onLike={this.handleLiked}
            onSort={this.handleSort}
          />
          <Pagination 
            itemsCount={totalCount} 
            pageSize={pageSize} 
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    )
  }

  handleDelete = (movie) => {
    const movies = this.state.movies.filter(m => m._id !== movie._id)
    this.setState({ movies})
  }
}