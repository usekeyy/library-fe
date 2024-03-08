import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from 'react-i18next';
// const defaultButton = props => <button {...props}>{props.children}</button>;

class Pagination extends React.Component {
  constructor(props) {
    super();
    this.changePage = this.changePage.bind(this);
    this.state = {
      pages: 0,
      recordsFiltered: 0,
      visiblePages: this.getVisiblePages(null, props.pages),
      item : 10
    };
  }

  static propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    // PageButtonComponent: PropTypes.any,
    onPageChange: PropTypes.func,
    defaultPageSize: PropTypes.number,
    previousText: PropTypes.string,
    nextText: PropTypes.string
  };

  static getDerivedStateFromProps(props, state) {
    if (props.pages !== state.pages) {
      return {
        pages: props.pages,
      };
    }

    if (props.recordsFiltered !== state.recordsFiltered) {
      return {
        recordsFiltered: props.recordsFiltered,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.pages !== prevProps.pages) {
      this.setState({
        visiblePages: this.getVisiblePages(null, this.props.pages)
      });
      this.changePage(this.props.page + 1);
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.pages !== nextProps.pages) {
  //     this.setState({
  //       visiblePages: this.getVisiblePages(null, nextProps.pages)
  //     });
  //   }

  //   this.changePage(nextProps.page + 1);
  // }

  filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter(page => page <= totalPages);
  };

  getVisiblePages = (page, total) => {
    if (total < 7) {
      return this.filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  onChanged(event) {
    this.props.onPageSizeChange(event.target.value)
    this.setState({item:event.target.value})
  }

  changePage(page) {

    const activePage = this.props.page + 1;

    if (page === activePage) {
      return;
    }

    const visiblePages = this.getVisiblePages(page, this.props.pages);

    this.setState({
      visiblePages: this.filterPages(visiblePages, this.props.pages)
    });

    this.props.onPageChange(page - 1);
  }

  onResetFilter = (e) => {
    e.preventDefault();
    const opt = this.props.options;
    if(opt !== undefined){
      opt['start'] = 0;
      opt['length'] = 10;
      opt['page'] = 0;
      Object.keys(opt).forEach((key) => { 
        if(key !== 'start' && key !== 'length' && key !== 'page' && key !== 'process'){
          opt[key] = "";
        }
      });
      this.props.onResetFilter(opt)
      this.setState({item:10})
      
    }
  }

  render() {
    // const { PageButtonComponent = defaultButton } = this.props;
    const { visiblePages } = this.state;
    const activePage = this.props.page + 1;
    const { t } = this.props;
    
    return (
      <div className="col-lg-12 m-t-10">
        <div className="row">
        {this.props.hiddenPaginationContent !== true &&
          <div className="col-lg-6 pull-left">
            <label className="m-t-5">{this.props.t("common:Tabel.Menampilkan")} </label> 
            <select onChange={(event) => this.onChanged(event)} className="m-l-5 m-r-5"  value={this.state.item}>
                {this.props.pageSizeOptions.map(item => <option key={item} value={item}> {item} </option>)}
            </select>
            <label className="m-t-5"> 
                {t("common:Tabel.Keterangan", { pages: activePage, totals: (this.state.recordsFiltered) ? this.state.recordsFiltered : 0 })}
            </label>
          </div>
        }
         {this.props.hiddenPaginationContent === true &&
          <div className="col-lg-6 pull-left">
          </div>
      }
          {this.props.offResetFilter !== true && <div className="col-lg-6">
            <button type="button" className="btn btn-xs btn-danger m-b-10 m-r-20 pull-right" onClick={(e) => this.onResetFilter(e)}> Reset Filter</button>
          </div>}
        </div>
        {/* <div className="row"> */}
        {this.props.hiddenPaginationContent !== true &&
          <div className="col-lg-12 pull-right">
            <ul className="pagination pull-right">
              <li className="page-item" >
                <button className="page-link" onClick={() => {
                  if (activePage === 1) return;
                  this.changePage(activePage - 1);
                }}
                  disabled={activePage === 1}>«  Prev</button>
              </li>
              {visiblePages.map((page, index, array) => {
                return (
                  <li key={index} className={
                    activePage === page
                      ? "page-item active"
                      : "page-item"
                  }>
                    <button
                      key={page}
                      className="page-link"
                      onClick={this.changePage.bind(null, page)}
                    >
                      {array[index - 1] + 2 < page ? `...${page}` : page}
                    </button>
                  </li>
                );
              })}
              <li className="page-item"  > <button className="page-link" onClick={() => {
                if (activePage === this.props.pages) return;
                this.changePage(activePage + 1);
              }}
                disabled={activePage === this.props.pages} > Next » </button> </li>
            </ul>
          </div>
        }
        {/* </div> */}
      </div>
    );
  }
}

export default withTranslation()(Pagination);