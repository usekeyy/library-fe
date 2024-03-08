
import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Paginations extends Component {
  constructor(props) {
    super(props);
		this._isMounted = false;

        this.state = {
            current_page: 1,
            offset: 5
          };
    }
    
    pagesNumbers() {
        if (!this.props.optionPaginate.to) {
            return [];
        }
        let from = this.props.optionPaginate.current_page - parseInt(this.props.optionPaginate.per_page);
        if (from < 1) {
            from = 1;
        }
        let to = from + (parseInt(this.props.optionPaginate.per_page) * 2);
        if (to >= this.props.optionPaginate.last_page) {
            to = this.props.optionPaginate.last_page;
        }
        let pagesArray = [];
        for (let page = from; page <= to; page++) {
            pagesArray.push(page);
        }
        return pagesArray;
    }

    pageList() {
        return this.pagesNumbers().map(page => {
        return <li className={ page === this.props.optionPaginate.current_page ? 'page-item active' : 'page-item' } key={page}>
            <button disabled={page === this.props.optionPaginate.current_page ? true : false } className="page-link" onClick={() => this.props.fetch(page)}>{page}</button>
        </li>
        })
    }

  render() {
    return (
      <div>
          { (this.props.data.data && this.props.data.data.length > 0) &&
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <Button className="page-link"
                  disabled={ 1 === this.props.optionPaginate.current_page }
                  // onClick={() => this.props.fetch(this.props.optionPaginate.current_page - 1)}
                >
                  Previous
                </Button>
              </li>
              { this.pageList() }
              <li className="page-item">
                <Button className="page-link"
                  disabled={this.props.optionPaginate.last_page === this.props.optionPaginate.current_page}
                  // onClick={() => this.props.fetch(this.props.optionPaginate.current_page + 1)}
                >
                  Next
                </Button>
              </li>
              <span style={{ marginTop: '8px' }}> &nbsp; <i>Showing { this.props.data.data.length } of { this.props.optionPaginate.total } entries.</i></span>
            </ul>
          </nav>
        }
      </div>
    );
  }
}

export default Paginations;